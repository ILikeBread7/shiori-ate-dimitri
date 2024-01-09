//=============================================================================
// ILB7_RemoveGoldFromMainMenu.js
//=============================================================================

/*:
 * @plugindesc Removes gold from the main menu screen
 * @author I_LIKE_BREAD7
 * 
 * @param Move options to middle of the screen
 * @desc Moves the options on the left to middle of the screen
 * OFF - false     ON - true
 * Default: ON
 * @default true
 *
 * @help This plugin does not provide plugin commands.
 */

(function() {

    var parameters = PluginManager.parameters('ILB7_RemoveGoldFromMainMenu');
    var moveToMiddle = JSON.parse(parameters['Move options to middle of the screen']);

    Scene_Menu.prototype.createGoldWindow = function() {
        // empty
    };

    if (moveToMiddle) {
        var oldInitialize = Window_MenuCommand.prototype.initialize;
        Window_MenuCommand.prototype.initialize = function(x, y) {
            oldInitialize.call(this, x, y);
            this.y = (Graphics.boxHeight - this.windowHeight()) / 2;
        };
    }

})();