//=============================================================================
// ILB7_ClickToButtonPress.js
//=============================================================================

/*:
 * @plugindesc Makes clicking at a certain part of the screen work like a button press
 * @author I_LIKE_BREAD7
 *
 * @help This plugin allows mapping a click on a specified area of the screen to a key press.
 * It does not map when a message is on the screen or the main menu is open to not mess with the games system too much.
 * Example 1: ILB7_ClickToButtonPress left ok 10 20 30 40 - maps the left click on a rectangle at 10,20 position with 30 width and 40 height to the ok (enter) key
 * Example 2: ILB7_ClickToButtonPress left ok - maps the left click on any part of the screen to the ok (enter) key
 * Keys: ok (ENTER), left, right, up, down, escape, tab, shift, control, pageup, pagedown, debug (F9)
 * 
 * Plugin Command:
 *   ILB7_ClickToButtonPress left key X Y WIDTH HEIGHT  # Maps left mouse click on the specified to the key
 *   ILB7_ClickToButtonPress right key X Y WIDTH HEIGHT # Maps right mouse click on the specified to the key
 *   ILB7_ClickToButtonPress clear                      # Clears the mappings
 */

(function() {

    var leftClickZones = [];
    var rightClickZones = [];

    Input.simulatePress = function(key) {
        this._currentState[key] = true;
    }

    document.addEventListener('pointerdown', function(e) {
        if ($gameMessage.isBusy() || SceneManager._scene.constructor === Scene_Menu) {
            return;
        }

        var x = Graphics.pageToCanvasX(e.pageX);
        var y = Graphics.pageToCanvasY(e.pageY);

        var keysToPress;
        switch (e.button) {
            // Left mouse button
            case 0:
                keysToPress = findKeysToPress(x, y, leftClickZones);
            break;
            
            // Right mouse button
            case 2:
                keysToPress = findKeysToPress(x, y, rightClickZones);
            break;
        }

        if (keysToPress) {
            for (var i = 0; i < keysToPress.length; i++) {
                Input.simulatePress(keysToPress[i]);
            }
        }
    });

    document.addEventListener('pointerup', function(e) {
        Input.clear();
    });

    function findKeysToPress(x, y, zones) {
        var keys = [];
        for (var i = 0; i < zones.length; i++) {
            var zone = zones[i];
            if (zone.length === 1 || zoneCollides(x, y, zone)) {
                keys.push(zone[0]);
            }
        }
        return keys;
    }

    function zoneCollides(x, y, zone) {
        var zoneX = zone[1];
        var zoneY = zone[2];
        var zoneW = zone[3];
        var zoneH = zone[4];
        return x >= zoneX && x < zoneX + zoneW && y >= zoneY && y < zoneY + zoneH;
    }

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'ILB7_ClickToButtonPress') {
            switch (args[0]) {
                case 'left':
                    leftClickZones.push(mapToZone(args));
                break;
                case 'right':
                    rightClickZones.push(mapToZone(args));
                break;
                case 'clear':
                    leftClickZones = [];
                    rightClickZones = [];
                break;
            }
        }
    }

    function mapToZone(args) {
        var zone = args.slice(1);
        for (var i = 1; i < zone.length; i++) {
            zone[i] = Number(zone[i]);
        }
        return zone;
    }

})();