// I just asked ChatGPT
// Can you write me a plugin for RPG Maker MV that adds an option to the title screen that runs a common event?
// And this is what it replied

//=============================================================================
// Custom Title Command Plugin
// by [Your Name or Alias]
// Last Updated: [Date]
// Free for use in commercial and non-commercial projects with credit.
//=============================================================================

/*:
 * @plugindesc Adds a custom option to the title screen to run a common event.
 * @author [Your Name or Alias]
 *
 * @param Command Text
 * @desc Text for the custom command.
 * @default Custom Command
 *
 * @param Common Event ID
 * @desc ID of the common event to run when the custom command is selected.
 * @default 1
 *
 * @help This plugin adds a custom option to the title screen
 * that runs a specified common event when selected.
 */

(function() {
    var parameters = PluginManager.parameters('CustomTitleCommand');
    var commandText = String(parameters['Command Text'] || 'Custom Command');
    var commonEventId = Number(parameters['Common Event ID'] || 1);

    // Add custom command to title screen
    var _Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
        _Scene_Title_createCommandWindow.call(this);
        this._commandWindow.setHandler('custom', this.commandCustom.bind(this));
    };

    // Define action for custom command
    Scene_Title.prototype.commandCustom = function() {
        $gameTemp.reserveCommonEvent(commonEventId);
        this._commandWindow.close();
        this.fadeOutAll();
        SceneManager.goto(Scene_Map);
    };

    // Add custom command to title window
    var _Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function() {
        _Window_TitleCommand_makeCommandList.call(this);
        this.addCommand(commandText, 'custom');
    };
})();