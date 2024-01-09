//=============================================================================
// ILB7_HanoiTowers.js
//=============================================================================

/*:
 * @plugindesc Creates a hanoi towers minigame
 * @author I_LIKE_BREAD7
 *
 * @param Stone variable ID
 * @desc ID of the variable to store which stone is being moved
 * @default 1
 *
 * @param Stack height variable ID
 * @desc ID of the variable to store the height of the selected stack
 * @default 2
 * 
 * @param Left move switch ID
 * @desc ID of the switch to check if move to/from the left stack can be made
 * @default 1
 *
 * @param Middle move switch ID
 * @desc ID of the switch to check if move to/from the middle stack can be made
 * @default 2
 *
 * @param Right move switch ID
 * @desc ID of the switch to check if move to/from the right stack can be made
 * @default 3
 * 
 * @param Done switch ID
 * @desc ID of the switch to check if the game is over
 * @default 4
 * 
 * @help
 * 
 * Plugin Command:
 *   ILB7_HanoiTowers start 4  # Starts the game at level 4
 *   ILB7_HanoiTowers pick 0   # Pick the left stack to move from/to (0 = left, 1 = middle, 2 = right)
 *   The parameters in the commands use the same escape characters as the messages,
 *   so you can use variables in them, for example:
 *    - ILB7_HanoiTowers start \V[1]
 *    - ILB7_HanoiTowers pick \V[2]
 *   to start the game at level stored in variable 1 and pick stack from variable 2
 */

(function() {

    var parameters = PluginManager.parameters('ILB7_HanoiTowers');
    var stoneVariableId = Number(parameters['Stone variable ID'] || 1);
    var stackHeightVariableId = Number(parameters['Stack height variable ID'] || 1);
    var leftSwitchId = Number(parameters['Left move switch ID'] || 1);
    var middleSwitchId = Number(parameters['Middle move switch ID'] || 2);
    var rightSwitchId = Number(parameters['Right move switch ID'] || 3);
    var doneSwitchId = Number(parameters['Done switch ID'] || 3);

    var _level = 4;
    var _left = [];
    var _middle = [];
    var _right = [];
    var _stacks = [];
    var _current = 0;

    function init(level) {
        _level = level;
        _current = 0;
        _left = [];
        _middle = [];
        _right = [];
        _stacks = [_left, _middle, _right];

        for (var i = _level; i > 0; i--) {
            _left.push(i);
        }

        $gameSwitches.setValue(doneSwitchId, false);
    }

    function setPossibleMoveStart() {
        var moveLeft = _left.length > 0;
        var moveMiddle = _middle.length > 0;
        var moveRight = _right.length > 0;
        $gameSwitches.setValue(leftSwitchId, moveLeft);
        $gameSwitches.setValue(middleSwitchId, moveMiddle);
        $gameSwitches.setValue(rightSwitchId, moveRight);
    }

    function setPossibleMoveEnd() {
        var moveLeft = _left.length === 0 || _current < _left[_left.length - 1];
        var moveMiddle = _middle.length === 0 || _current < _middle[_middle.length - 1];
        var moveRight = _right.length === 0 || _current < _right[_right.length - 1];
        $gameSwitches.setValue(leftSwitchId, moveLeft);
        $gameSwitches.setValue(middleSwitchId, moveMiddle);
        $gameSwitches.setValue(rightSwitchId, moveRight);
    }

    function checkDone() {
        var done = _right.length === _level;
        $gameSwitches.setValue(doneSwitchId, done);
    }

    function pickStart(stack) {
        _current = _stacks[stack].pop();
        $gameVariables.setValue(stoneVariableId, _current);
        setPossibleMoveEnd();
    }

    function pickEnd(stack) {
        _stacks[stack].push(_current);
        _current = 0;
        setPossibleMoveStart();
    }

    function pick(stack) {
        if (_current) {
            pickEnd(stack);
            setStackHeightValue(stack);
            checkDone();
        } else {
            pickStart(stack);
        }
    }

    function setStackHeightValue(stack) {
        $gameVariables.setValue(stackHeightVariableId, _stacks[stack].length);
    }

    function start(level) {
        init(level);
        setPossibleMoveStart();
    }

    var oldPluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        oldPluginCommand.call(this, command, args);
        if (command === 'ILB7_HanoiTowers')
        switch (args[0]) {
            case 'start':
                start(Number(Window_Base.prototype.convertEscapeCharacters(args[1])));
            break;
            case 'pick':
                pick(Number(Window_Base.prototype.convertEscapeCharacters(args[1])));
            break;
        }
    };

})();