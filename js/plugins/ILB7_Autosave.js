//=============================================================================
// ILB7_Autosave.js
//=============================================================================

/*:
 * @plugindesc Autosave plugin for RPG Maker MV (v.1.0.0)
 * @author I_LIKE_BREAD7
 * 
 * @param Switch ID
 * @desc ID of the switch to turn autosave on, 0 if should be on all the time, does not affect autosave from plugin command
 * @default 0
 * 
 * @param Label
 * @desc Text label of the autosave on save/load menu, empty if none should be there
 * @default (Autosave)
 * 
 * @help This plugin automatically saves the game state to a file named "autosave.rpgsave".
 *       It creates the autosave file whenever an event that modified some
 *       of the data used for enabling/disabling events finishes execution
 *       (player transfer and modifying switches, variables, self-switches, party or items).
 *       The autosave file is overwritten each time a new autosave occurs.
 * 
 * Plugin Command:
 *   ILB7_Autosave         # Performs autosave manually (not affected by the switch parameter)
 *   ILB7_Autosave prevent # Prevents autosave if put at the end of an event (after all commands that trigger the autosave) that would otherwise autosave
 *   ILB7_Autosave trigger # Triggers autosave if put at the end of an event that would otherwise not trigger it  (is affected by the switch parameter)
 */

(function() {

    var parameters = PluginManager.parameters('ILB7_Autosave');
    var switchId = Number(parameters['Switch ID']);
    var autosaveLabel = parameters['Label'];

    var AUTOSAVE_ID = 1;

    var needsToSave = false;
    var gameStarted = false;

    function save() {
        var saveFileId = AUTOSAVE_ID;
        $gameSystem.onBeforeSave();
        if (DataManager.autosaveGame(saveFileId)) {
            StorageManager.cleanBackup(saveFileId);
            needsToSave = false;
        } else {
            console.err('Autosave error!');
        }
    }
    
    var _Game_Event_unlock = Game_Event.prototype.unlock;
    Game_Event.prototype.unlock = function() {
        _Game_Event_unlock.call(this);
        
        if (needsToSave && (!switchId || $gameSwitches.value(switchId))) {
            save();
        }
    };

    DataManager.autosaveGame = function(saveFileId) {
        var last = this._lastAccessedId;
        var result = DataManager.saveGame(saveFileId);
        this._lastAccessedId = last;
        return result;
    }

    var _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function() {
        _Game_Player_performTransfer.call(this);
        needsToSave = true;
    };
    
    var _Game_Switches_setValue = Game_Switches.prototype.setValue;
    Game_Switches.prototype.setValue = function(switchId, value) {
        _Game_Switches_setValue.call(this, switchId, value);
        needsToSave = true;
    };
    
    var _Game_Variables_setValue = Game_Variables.prototype.setValue;
    Game_Variables.prototype.setValue = function(variableId, value) {
        _Game_Variables_setValue.call(this, variableId, value);
        needsToSave = true;
    };
    
    var _Game_SelfSwitches_setValue = Game_SelfSwitches.prototype.setValue;
    Game_SelfSwitches.prototype.setValue = function(key, value) {
        _Game_SelfSwitches_setValue.call(this, key, value);
        needsToSave = true;
    };
    
    var _Game_Party_gainItem = Game_Party.prototype.gainItem;
    Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
        _Game_Party_gainItem.call(this, item, amount, includeEquip);
        needsToSave = true;
    };
    
    var _Game_Party_loseItem = Game_Party.prototype.loseItem;
    Game_Party.prototype.loseItem = function(item, amount, includeEquip) {
        _Game_Party_loseItem.call(this, item, amount, includeEquip);
        needsToSave = true;
    };
    
    var _Game_Party_addActor = Game_Party.prototype.addActor;
    Game_Party.prototype.addActor = function(actorId) {
        _Game_Party_addActor.call(this, actorId);
        needsToSave = true;
    };
    
    var _Game_Party_removeActor = Game_Party.prototype.removeActor;
    Game_Party.prototype.removeActor = function(actorId) {
        _Game_Party_removeActor.call(this, actorId);
        needsToSave = true;
    };

    var _Window_SavefileList_drawFileId = Window_SavefileList.prototype.drawFileId;
    Window_SavefileList.prototype.drawFileId = function(id, x, y) {
        if (id === AUTOSAVE_ID) {
            this.drawText(autosaveLabel, x, y + this.lineHeight());
        }
        _Window_SavefileList_drawFileId.call(this, id, x, y);
    };

    var _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_start.call(this);
        if (gameStarted) {
            return;
        }
        gameStarted = true;
        needsToSave = false;
    };

    var _Scene_Load_onLoadSuccess = Scene_Load.prototype.onLoadSuccess;
    Scene_Load.prototype.onLoadSuccess = function () {
        _Scene_Load_onLoadSuccess.call(this);
        gameStarted = false;
    }

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'ILB7_Autosave') {
            switch(args[0]) {
                case 'prevent':
                    needsToSave = false;
                break;
                case 'trigger':
                    needsToSave = true;
                break;

                // if no arg provided, just save
                default:
                    // the index voodoo is needed to prevent the plugin command
                    // from executing on load from an autosave which was saved
                    // using the same plugin command (the first command to be
                    // executed is the one which was current during saving)
                    this._index++;
                    save();
                    this._index--;
            }
        }
    }

})();
