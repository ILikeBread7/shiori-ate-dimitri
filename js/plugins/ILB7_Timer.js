//=============================================================================
// ILB7_Timer.js
//=============================================================================

/*:
 * @plugindesc Creates a timer
 * @author I_LIKE_BREAD7
 *
 * @param Timer variable ID
 * @desc ID of the variable to store timer value
 * @default 1
 *
 * 
 * @help
 * 
 * Plugin Command:
 *   ILB7_Timer start # Starts the timer and saves the start time in miliseconds to the provided variable
 *   ILB7_Timer stop  # Stops the timer and saves the elapsed time in minutes:seconds.miliseconds format to the provided variable
 */

(function() {

    var parameters = PluginManager.parameters('ILB7_Timer');
    var timerVariableId = Number(parameters['Timer variable ID'] || 1);

    function start() {
        var startTime = new Date().getTime();
        $gameVariables.setValue(timerVariableId, startTime);
    }

    function stop() {
        var stopTime = new Date().getTime();
        var totalTime = stopTime - $gameVariables.value(timerVariableId);
        var minutesString = '' + Math.floor(totalTime / 1000 / 60);
        var secondsString = ('' + Math.floor(totalTime / 1000) % 60).padStart(2, '0');
        var milisecondsString = ('' + totalTime % 1000).padStart(3, '0');
        var formattedTime = minutesString + ':' + secondsString + '.' + milisecondsString;
        $gameVariables.setValue(timerVariableId, formattedTime);
    }

    var oldPluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        oldPluginCommand.call(this, command, args);
        if (command === 'ILB7_Timer')
        switch (args[0]) {
            case 'start':
                start();
            break;
            case 'stop':
                stop();
            break;
        }
    };

})();