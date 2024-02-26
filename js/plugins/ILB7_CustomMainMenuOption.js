//=============================================================================
// ILB7_CustomMainMenuOption.js
//=============================================================================

/*:
 * @plugindesc Adds custom options to the main menu which run common events.
 * @author I_LIKE_BREAD7
 *
 * @param Options List
 * @desc Comma-separated list of option settings in arrays: [commonEvent1Id,"Option name 1",switch1Id],[commonEvent2Id,"Option name 2",switch2Id],...
 * @default [1,"Custom Option 1",1],[2,"Custom Option 2",2]
 *
 * @help
 * This plugin allows you to add multiple custom options to the main menu of your game.
 * You can specify a common event to be executed for each option, and control the
 * visibility of each option using a switch.
 * If you want the option to be always visible use 0 for the switchId
 * 
 * The format for the options list is as follows
 * [ - beginning of option data
 * commonEventId,
 * "Option name", - has to be in quotes
 * switchId
 * ] - end of option data
 * , - comma if you want to add another option
 * for example:
 * [1,"Custom Option 1",1],[2,"Custom Option 2",2]
 */

(function() {

    var parameters = PluginManager.parameters('ILB7_CustomMainMenuOption');
    var optionsList = JSON.parse('[' + parameters['Options List'] + ']');

    // Add custom menu commands
    var _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        _Window_MenuCommand_addOriginalCommands.call(this);
        for (var i = 0; i < optionsList.length; i++) {
            var option = optionsList[i];
            var optionText = String(option[1]);
            var switchId = Number(optionsList[i][2]);
            if (switchId === 0 || $gameSwitches.value(switchId)) {
                this.addCommand(optionText, 'customOption_' + i, true);
            }
        }
    };

    // Execute common event when custom option is selected
    var _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.call(this);
        for (var i = 0; i < optionsList.length; i++) {
            var option = optionsList[i];
            var commonEventId = Number(option[0]);
            this._commandWindow.setHandler('customOption_' + i, this.commandCustomOption.bind(this, commonEventId));
        }
    };

    Scene_Menu.prototype.commandCustomOption = function(commonEventId) {
        $gameTemp.reserveCommonEvent(commonEventId);
        this._commandWindow.callHandler('cancel');
    };

})();
