//=============================================================================
// ILB7_StepSound Plugin
//=============================================================================

/*:
 * @plugindesc Plays a sound effect whenever the player or a specified event makes a step.
 * @author I_LIKE_BREAD7
 *
 * @param Step Sound
 * @desc The sound effect to play when a step is made.
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
 * @param Step Sound Events
 * @desc JSON array of event and map ID combinations for events with the step sounds.
 * @default [{"mapId": 1, "eventId": 2}, {"mapId": 3, "eventId": 4}]
 *
 * @help This plugin does not provide plugin commands.
 */

(function() {
    var parameters = PluginManager.parameters('ILB7_StepSound');
    var stepSound = JSON.parse(parameters['Step Sound']);
    var playerStepSwitch = Number(parameters['Player Step Sound Switch']);
    var eventStepSwitch = Number(parameters['Event Step Sound Switch']);
    var stepSoundEvents = JSON.parse(parameters['Step Sound Events']);

    var stepsMapEvents = [];
    for (var i = 0; i < stepSoundEvents.length; i++) {
        var event = stepSoundEvents[i];
        if (!stepsMapEvents[event.mapId]) {
            stepsMapEvents[event.mapId] = [];
        }
        stepsMapEvents[event.mapId][event.eventId] = true;
    }

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
        this.playStepSoundIfApplicable();
    };

    var _Game_Event_moveDiagonally = Game_Event.prototype.moveDiagonally;
    Game_Event.prototype.moveDiagonally = function(horz, vert) {
        _Game_Event_moveDiagonally.call(this, horz, vert);
        this.playStepSoundIfApplicable();
    };

    Game_Event.prototype.playStepSoundIfApplicable = function() {
        if (!eventStepSwitch || $gameSwitches.value(eventStepSwitch)) {
            var stepsMap = stepsMapEvents[$gameMap.mapId()];
            if (stepsMap && stepsMap[this.eventId()]) {
                AudioManager.playSe(stepSound);
            }
        }
    };
})();