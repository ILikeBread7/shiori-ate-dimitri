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

})();