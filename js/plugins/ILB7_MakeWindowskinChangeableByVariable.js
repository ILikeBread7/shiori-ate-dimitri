//=============================================================================
// ILB7_MakeWindowskinChangeableByVariable.js
//=============================================================================

/*:
 * @plugindesc Makes it possible to change the window skin using an in-game variable
 * @author I_LIKE_BREAD7
 *
 * @param Number of skins
 * @desc The amount of skins used in the game (not including the default)
 * @default 2
 * 
 * @param Skin var ID
 * @desc ID of the in-game variable used to determine which skin to use
 * @default 1
 *
 * @help
 * The skins used needs to be placed in /img/system/Window_X.png where X
 * is the value of the variable from the parameter "Skin var ID"
 * For example: /img/system/Window_1.png, /img/system/Window_2.png, etc...
 * If the value is set to 0 the default skin at /img/system/Window.png will be used
 */

(function() {

    var parameters = PluginManager.parameters('ILB7_MakeWindowskinChangeableByVariable');
    var skinsNumber = Number(parameters['Number of skins'] || 2);
    var skinsVarId = Number(parameters['Skin var ID'] || 1);

    Window_Base.prototype.loadWindowskin = function() {
        this._ILB7_windowskins = [ ImageManager.loadSystem('Window') ];
        for (var i = 1; i <= skinsNumber; i++) {
            this._ILB7_windowskins.push(ImageManager.loadSystem('Window_' + i));
        }
        this.windowskin = this._ILB7_windowskins[0];
    };

    var baseUpdate = Window_Base.prototype.update;
    Window_Base.prototype.update = function() {
        baseUpdate.call(this);
        var currentSkin = $gameVariables.value(skinsVarId);
        this.windowskin = this._ILB7_windowskins[currentSkin];
    }

})();