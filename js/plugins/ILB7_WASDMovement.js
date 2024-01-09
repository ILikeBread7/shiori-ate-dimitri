//=============================================================================
// ILB7_WASDMovement.js
//=============================================================================

/*:
 * @plugindesc Enables WASD as an alternative to arrow keys
 * @author I_LIKE_BREAD7
 *
 * @help This plugin does not provide plugin commands.
 */

(function() {

    Input.keyMapper[119] = Input.keyMapper[87] = 'up'; // W
    Input.keyMapper[97] = Input.keyMapper[65] = 'left'; // A
    Input.keyMapper[115] = Input.keyMapper[83] = 'down'; // S
    Input.keyMapper[100] = Input.keyMapper[68] = 'right'; // D

})();