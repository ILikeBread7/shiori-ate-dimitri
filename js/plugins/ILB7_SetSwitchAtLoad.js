//=============================================================================
// ILB7_SetSwitchAtLoad.js
//=============================================================================

/*:
 * @plugindesc Sets the switch from Switch ID parameter to the specified value after a save game is loaded
 * @author I_LIKE_BREAD7
 *
 * @param Switch ID
 * @desc Switch to be set to the value
 * @default 1
 *
 * @param Value
 * @desc Value to be set (true/false)
 * @default true
 * 
 * @help This plugin does not provide plugin commands.
 */

(function() {

    var parameters = PluginManager.parameters('ILB7_SetSwitchAtLoad');
    var switchId = Number(parameters['Switch ID'] || 1);
    var value = JSON.parse(parameters['Value']);

    var baseOnLoad = Game_System.prototype.onAfterLoad;
    Game_System.prototype.onAfterLoad = function() {
        baseOnLoad.call(this);
        $gameSwitches.setValue(switchId, value);
    };

})();