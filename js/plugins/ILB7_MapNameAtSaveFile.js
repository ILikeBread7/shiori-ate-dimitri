//=============================================================================
// ILB7_MapNameAtSaveFile.js
//=============================================================================

/*:
 * @plugindesc Puts the map name instead of the game title in the save file
 * @author I_LIKE_BREAD7
 *
 * @help This plugin does not provide plugin commands.
 */

(function() {

    var baseMakeSavefileInfo = DataManager.makeSavefileInfo;
    DataManager.makeSavefileInfo = function() {
        var info = baseMakeSavefileInfo.call(this);
        info.title = $gameMap.displayName();
        return info;
    };

    DataManager.isThisGameFile = function(savefileId) {
        var globalInfo = this.loadGlobalInfo();
        if (globalInfo && globalInfo[savefileId]) {
            if (StorageManager.isLocalMode()) {
                return true;
            }
            var savefile = globalInfo[savefileId];
            return savefile.globalId === this._globalId;
        }
        return false;
    };

})();