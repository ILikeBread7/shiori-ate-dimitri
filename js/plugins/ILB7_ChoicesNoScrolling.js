//=============================================================================
// ILB7_ChoicesNoScrolling.js
//=============================================================================

/*:
 * @plugindesc Disables scrolling in choices window making all available choices always visible
 * @author I_LIKE_BREAD7
 * 
 *
 * @help This plugin does not provide plugin commands.
 */

(function() {

    Window_ChoiceList.prototype.numVisibleRows = function() {
        return $gameMessage.choices().length;
    };

})();