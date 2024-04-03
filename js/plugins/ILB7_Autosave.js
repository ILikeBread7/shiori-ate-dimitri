//=============================================================================
// ILB7_Autosave.js
//=============================================================================

/*:
 * @plugindesc Autosave plugin for RPG Maker MV
 * @author I_LIKE_BREAD7
 * 
 * @param Debounce time (miliseconds)
 * @desc Time delay for save debounce, if you don't know what that means leave the default value (500)
 * @default 500
 *
 * @param Switch ID
 * @desc ID of the switch to turn autosave on, empty (or 0) if should be on all the time, does not affect manual autosave
 * @default 0
 * 
 * @help This plugin automatically saves the game state to a file named "autosave.rpgsave".
 *       It creates the autosave file whenever an event finishes execution.
 *       The saves are debounced (delayed and omitted if a new save needs to be performed)
 *       to limit saving multiple times when more than one event finishes at the same time.
 *       The autosave file is overwritten each time a new autosave occurs.
 * 
 * Plugin Command:
 *   ILB7_Autosave # Performs autosave manually
 */

(function() {

    var parameters = PluginManager.parameters('ILB7_Autosave');
    var debounceTime = Number(parameters['Debounce time (miliseconds)'] || 0);
    var switchId = Number(parameters['Switch ID']);

    function save() {
        var saveFileId = Window_SavefileList.prototype.maxItems();
        $gameSystem.onBeforeSave();
        if (DataManager.saveGame(saveFileId)) {
            StorageManager.cleanBackup(saveFileId);
        } else {
            console.err('Autosave error!');
        }
    }
    
    var debounceTimeout = null;
    var baseUnlock = Game_Event.prototype.unlock;
    Game_Event.prototype.unlock = function() {
        baseUnlock.call(this);
        
        if (switchId && $gameSwitches.value(switchId)) {
            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
            }
            debounceTimeout = setTimeout(save, debounceTime);
        }
    };

    var baseLocalFilePath = StorageManager.localFilePath;
    StorageManager.localFilePath = function (savefileId) {
        if (savefileId === 21) {
            return StorageManager.localFileDirectoryPath() + 'autosave.rpgsave';
        }
        return baseLocalFilePath.call(this, savefileId);
    }

    var baseMaxFiles = Window_SavefileList.prototype.maxItems;
    Window_SavefileList.prototype.maxItems = function() {
        return baseMaxFiles.call(this) + 1;
    }

    DataManager.saveGameWithoutRescue = function(savefileId) {
        var json = JsonEx.stringify(this.makeSaveContents());
        if (json.length >= 200000) {
            console.warn('Save data too big!');
        }
        StorageManager.save(savefileId, json);
        if (savefileId !== Window_SavefileList.prototype.maxItems()) {
            this._lastAccessedId = savefileId;
        }
        var globalInfo = this.loadGlobalInfo() || [];
        globalInfo[savefileId] = this.makeSavefileInfo();
        this.saveGlobalInfo(globalInfo);
        return true;
    };

    var baseDrawFileId = Window_SavefileList.prototype.drawFileId;
    Window_SavefileList.prototype.drawFileId = function(id, x, y) {
        var width = 180;
        if (id !== Window_SavefileList.prototype.maxItems()) {
            baseDrawFileId.call(this, id, x, y, width);
            return;
        }
        this.drawText('Autosave', x, y, width);
    };

    var base = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        base.call(this, command, args);
        switch (command) {
            case 'ILB7_Autosave':
                save();
            break;
        }
    }

})();
