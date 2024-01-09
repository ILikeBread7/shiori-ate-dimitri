//=============================================================================
// ILB7_ResetVariableAtTitle.js
//=============================================================================

/*:
 * @plugindesc Sets the variable from Variable ID parameter to the specified value at the title screen
 * @author I_LIKE_BREAD7
 *
 * @param Variable ID
 * @desc Variable to be set to the value
 * @default 1
 *
 * @param Value
 * @desc Value to be set
 * @default 0
 * 
 * @help This plugin does not provide plugin commands.
 */

(function() {

    var parameters = PluginManager.parameters('ILB7_ResetVariableAtTitle');
    var variableId = Number(parameters['Variable ID'] || 1);
    var value = Number(parameters['Value'] || 0);

    var oldCreate = Scene_Title.prototype.create;
    Scene_Title.prototype.create = function() {
        $gameVariables.setValue(variableId, value);
        oldCreate.call(this);
    };

})();