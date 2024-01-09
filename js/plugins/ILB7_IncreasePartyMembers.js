//=============================================================================
// ILB7_IncreasePartyMembers.js
//=============================================================================

/*:
 * @plugindesc Changes the number of battle party members
 * @author I_LIKE_BREAD7
 *
 * @param Party size
 * @desc The new battle party size
 * @default 4
 *
 * @help This plugin does not provide plugin commands.
 */

(function() {

    var parameters = PluginManager.parameters('ILB7_IncreasePartyMembers');
    var partySize = String(parameters['Party size'] || 4);

    Game_Party.prototype.maxBattleMembers = function() {
        return partySize;
    };

})();