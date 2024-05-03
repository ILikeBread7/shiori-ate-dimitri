//=============================================================================
// ILB7_ClickToButtonPress.js
//=============================================================================

/*:
 * @plugindesc Creates a snake minigame
 * 
 * @author I_LIKE_BREAD7
 * 
 * @help This plugin allows you to create a custom scene in RPG Maker MV.
 * 
 * Plugin Command:
 *   ILB7_Snake start # Starts the game.
 */

(function() {

    var bitmap = ImageManager.loadPicture('pebble');
    var bgImagePath = 'img/titles1/Volcano'

    function Window_Snake() {
        this.initialize.apply(this, arguments);
    }

    Window_Snake.prototype = Object.create(Window_Base.prototype);
    Window_Snake.prototype.constructor = Window_Snake;

    Window_Snake.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        var bgSprite = new Sprite();
        bgSprite.initialize(ImageManager.loadBitmapFromPath(bgImagePath));
        this.addChildToBack(bgSprite);
    };

    Window_Snake.prototype.refresh = function() {
        this.contents.clear();
        var x = 0;
        var y = 0;
        this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, x, y);
    };

    Window_Snake.prototype.standardPadding = function() {
        return 0;
    }

    function Scene_Snake() {
        this.initialize.apply(this, arguments);
    }

    Scene_Snake.prototype = Object.create(Scene_Base.prototype);
    Scene_Snake.prototype.constructor = Scene_Snake;

    Scene_Snake.prototype.initialize = function() {
        Scene_Base.prototype.initialize.call(this);
    };

    Scene_Snake.prototype.create = function() {
        Scene_Base.prototype.create.call(this);
        this.createWindowLayer();
        console.log('scene created')
        // setTimeout(() => this.popScene(), 1000);

        this._window = new Window_Snake(0, 0, Graphics.width, Graphics.height); // Adjust the position and size as needed
        this.addWindow(this._window);

        // Create a message window
        this._messageWindow = new Window_Message();
        this.addWindow(this._messageWindow);

        // Display a message
        // $gameMessage.addText("Hello, world!");

        // Wait for player input to close the message window
        // this.setWaitMode('button');
    };

    var first = true;
    Scene_Snake.prototype.update = function() {
        Scene_Base.prototype.update.call(this);
        this._window.refresh();
        console.log('scene updated')

        console.log($gameMessage.isBusy());
        // var commonEvent = $dataCommonEvents[113];
        if (first) {
            first = false;
            var commonEvent = $dataCommonEvents[113];
            this._interpreter = new Game_Interpreter();
            this._interpreter.setup(commonEvent.list);
        }

        if (this._interpreter) {
            if (!this._interpreter.isRunning()) {
                this._interpreter = null; // Clear the interpreter when it's finished
            } else {
                this._interpreter.update();
            }
        }

        // // Draw the image at position (x, y)
        // var x = 100; // X-coordinate
        // var y = 100; // Y-coordinate

        // this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, x, y);
    };

    // // Dispose of the scene
    // Scene_Snake.prototype.dispose = function() {
    //     Scene_Base.prototype.dispose.call(this);
    //     // Add cleanup code here
    // };

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'ILB7_Snake') {
            switch (args[0]) {
                case 'start':
                    SceneManager.push(Scene_Snake);
                break;
                case 'stop':
                    SceneManager.pop();
                break;
            }
        }
    };

    ImageManager.loadBitmapFromPath = function(path) {
        var lastSlashIndex = path.lastIndexOf('/')
        var folder = path.substr(0, lastSlashIndex + 1);
        var filename = path.substr(lastSlashIndex + 1);
        return ImageManager.loadBitmap(folder, filename);
    }

})();
