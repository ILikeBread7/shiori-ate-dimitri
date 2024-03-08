//=============================================================================
// ILB7_DisableMovementLeftRight.js
//=============================================================================

/*:
 * @plugindesc Disables player movement left and right using a switch
 * @author I_LIKE_BREAD7
 *
 * @param Switch ID
 * @desc ID of the switch that disables the movement
 * @default 1
 * 
 * @help This plugin does not provide plugin commands.
 */

(function() {

    var parameters = PluginManager.parameters('ILB7_DisableMovementLeftRight');
    var switchId = Number(parameters['Switch ID'] || 1);

    var oldExecuteMove = Game_Player.prototype.executeMove;
    Game_Player.prototype.executeMove = function(direction) {
        if (
            $gameSwitches.value(switchId)
            && (direction === 4 || direction === 6)
            // 4 = left, 6 = right
        ) {
            return;
        }
        oldExecuteMove.call(this, direction);
    };

})();