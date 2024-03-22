//=============================================================================
// ILB7_MapDispayNameAllowEscapeCodes.js
//=============================================================================

/*:
 * @plugindesc Allows using message escape codes in map names
 * @author I_LIKE_BREAD7
 * 
 *
 * @help This plugin does not provide plugin commands.
 */

(function() {

    var baseDisplayName = Game_Map.prototype.displayName;
    Game_Map.prototype.displayName = function() {
        var nonEscapedName = baseDisplayName.call(this);
        if (!nonEscapedName) {
            return nonEscapedName;
        }
        return Window_Base.prototype.convertEscapeCharacters(nonEscapedName);
    };

})();