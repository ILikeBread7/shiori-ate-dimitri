//=============================================================================
// ILB7_StepSound Plugin
//=============================================================================

/*:
 * @plugindesc Plays a sound effect whenever the player or a specified event makes a step.
 * @author I_LIKE_BREAD7
 *
 * @param Step Sound
 * @desc Default sound effect to play when a step is made.
 * @default {"name":"Cursor1","volume":90,"pitch":100,"pan":0}
 *
 * @param Player Step Sound Switch
 * @desc Switch ID to enable/disable player step sound. Put 0 to always enable.
 * @default 1
 *
 * @param Event Step Sound Switch
 * @desc Switch ID to enable/disable event step sound. Put 0 to always enable.
 * @default 2
 *
 * @param Event Step Sounds
 * @desc JSON array of event and map ID combinations with custom step sounds. Example [{ "mapId": 1, "eventId": 2 }]
 * @default []
 *
 * @help ILB7_StepSound.js
 * ============================================================================
 */

(function() {
    var parameters = PluginManager.parameters('ILB7_StepSound');
    var stepSound = JSON.parse(parameters['Step Sound']);
    var playerStepSwitch = Number(parameters['Player Step Sound Switch']);
    var eventStepSwitch = Number(parameters['Event Step Sound Switch']);
    var eventStepSounds = JSON.parse(parameters['Event Step Sounds']);

    var _Game_Player_moveStraight = Game_Player.prototype.moveStraight;
    Game_Player.prototype.moveStraight = function(d) {
        _Game_Player_moveStraight.call(this, d);
        if (!playerStepSwitch || $gameSwitches.value(playerStepSwitch)) {
            AudioManager.playSe(stepSound);
        }
    };

    var _Game_Event_moveStraight = Game_Event.prototype.moveStraight;
    Game_Event.prototype.moveStraight = function(d) {
        _Game_Event_moveStraight.call(this, d);
        if (!eventStepSwitch || $gameSwitches.value(eventStepSwitch)) {
            var mapId = $gameMap.mapId();
            var eventId = this.eventId();
            var eventStepSound = eventStepSounds.find(function(entry) {
                return entry.mapId === mapId && entry.eventId === eventId;
            });
            if (eventStepSound) {
                AudioManager.playSe(stepSound);
            }
        }
    };
})();
