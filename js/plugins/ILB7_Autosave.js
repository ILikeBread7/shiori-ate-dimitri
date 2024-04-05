//=============================================================================
// ILB7_Autosave.js
//=============================================================================

/*:
 * @plugindesc Autosave plugin for RPG Maker MV
 * @author I_LIKE_BREAD7
 * 
 * @param Debounce time (miliseconds)
 * @desc Time delay for save debounce, if you don't know what that means leave the default value (0)
 * @default 0
 *
 * @param Switch ID
 * @desc ID of the switch to turn autosave on, 0 if should be on all the time, does not affect autosave from plugin command
 * @default 0
 * 
 * @help This plugin automatically saves the game state to a file named "autosave.rpgsave".
 *       It creates the autosave file whenever an event finishes execution.
 *       The saves are debounced (delayed and omitted if a new save needs to be performed)
 *       to limit saving multiple times when more than one event finishes at the same time.
 *       The autosave file is overwritten each time a new autosave occurs.
 * 
 * Plugin Command:
 *   ILB7_Autosave         # Performs autosave manually
 *   ILB7_Autosave prevent # Prevents autosave if put at the end of an event that would otherwise autosave
 */

(function() {

    var parameters = PluginManager.parameters('ILB7_Autosave');
    var debounceTime = Number(parameters['Debounce time (miliseconds)'] || 0);
    var switchId = Number(parameters['Switch ID']);

    var AUTOSAVE_ID = 1;

    var needsToSave = false;

    function save() {
        console.log('save');
        var saveFileId = AUTOSAVE_ID;
        $gameSystem.onBeforeSave();
        if (DataManager.autosaveGame(saveFileId)) {
            StorageManager.cleanBackup(saveFileId);
            needsToSave = false;
        } else {
            console.err('Autosave error!');
        }
    }
    
    var debounceTimeout = null;
    var _Game_Event_unlock = Game_Event.prototype.unlock;
    Game_Event.prototype.unlock = function() {
        _Game_Event_unlock.call(this);
        
        if (needsToSave && (!switchId || $gameSwitches.value(switchId))) {
            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
            }
            debounceTimeout = setTimeout(save, debounceTime);
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
            this.drawText('(Autosave)', x, y + this.lineHeight());
        }
        _Window_SavefileList_drawFileId.call(this, id, x, y);
    };

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'ILB7_Autosave') {
            switch(args[0]) {
                case 'prevent':
                    needsToSave = false;
                break;

                // if no arg provided, just save
                default:
                    save();
                    if (debounceTimeout) {
                        clearTimeout(debounceTimeout);
                    }
            }
        }
    }

})();
