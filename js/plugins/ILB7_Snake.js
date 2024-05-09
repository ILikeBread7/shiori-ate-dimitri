//=============================================================================
// ILB7_Snake.js
//=============================================================================

/*:
 * @plugindesc Creates a snake minigame
 * 
 * @author I_LIKE_BREAD7
 * 
 * @param Tile width
 * @desc The width of a single tile on the snake minigame's board
 * @default 48
 * 
 * @param Tile height
 * @desc The height of a single tile on the snake minigame's board
 * @default 48
 * 
 * @param Background Image Path
 * @desc The file path for the background image of the snake minigame
 * @default img/titles1/Volcano
 * 
 * @param Snake Image Path
 * @desc The file path for the snake character's image
 * @default img/characters/Actor1
 * 
 * @param Snake Image Offsets
 * @desc The offsets for the snake character's image, in pixels
 * @default [[0, 0]]
 * 
 * @param Food Image Path
 * @desc The file path for the food item's image
 * @default img/characters/Actor2
 * 
 * @param Food Image Offsets
 * @desc The offsets for the food item's image, in pixels
 * @default [[0, 0]]
 * 
 * @param Eat Sound Effects
 * @desc The sound effect played when the snake eats food
 * @default [{"name":"Absorb2","volume":90,"pitch":100,"pan":0}]
 * 
 * @param Crash Sound Effect
 * @desc The sound effect played when the snake crashes
 * @default {"name":"Absorb1","volume":90,"pitch":100,"pan":0}
 * 
 * @param Score Text
 * @desc The text displayed before the score value
 * @default Score:
 * 
 * @param Finish Common Event ID
 * @desc The ID of the common event to be triggered when the game finishes (or 0 if not used)
 * @default 3
 * 
 * @param Cancel Common Event ID
 * @desc The ID of the common event to be triggered when the game is cancelled (or 0 if not used)
 * @default 2
 * 
 * @param Start Common Event ID
 * @desc The ID of the common event to be triggered when the game starts (or 0 if not used)
 * @default 1
 * 
 * @param Score Variable ID
 * @desc The ID of the variable to store the score (or 0 if not used)
 * @default 1
 * 
 * @help This plugin allows you to create a custom scene in RPG Maker MV.
 * 
 * Plugin Command:
 *   ILB7_Snake start 5                    # Starts the game at level 5 (lower levels are more difficult), accepts variables on the \V[ID] format
 *   ILB7_Snake stop                       # Stops the minigame and returns to the map
 *   ILB7_Snake reset                      # Resets the state of the game
 *   ILB7_Snake snakeimageoffset 0,0 48,48 # Redefines the "Snake Image Offsets" parameter
 *   ILB7_Snake foodimageoffset 0,0 48,48  # Redefines the "Food Image Offsets" parameter
 *   ILB7_Snake eatse {"name":"Absorb2","volume":90,"pitch":100,"pan":0}   # Redefines the "Eat Sound Effects" parameter
 *   ILB7_Snake crashse {"name":"Absorb1","volume":90,"pitch":100,"pan":0} # Redefines the "Crash Sound Effect" parameter
 */

(function() {

    var parameters = PluginManager.parameters('ILB7_Snake');
    var tileWidth = Number(parameters['Tile width'] || 48);
    var tileHeight = Number(parameters['Tile height'] || 48);
    var bgImagePath = String(parameters['Background Image Path'] || 'img/titles1/Volcano');
    var snakeImagePath = String(parameters['Snake Image Path'] || 'img/characters/Actor1');
    var snakeImageOffsets = JSON.parse(parameters['Snake Image Offsets'] || '[[0, 0]]');
    var foodImagePath = String(parameters['Food Image Path'] || 'img/characters/Actor2');
    var foodImageOffsets = JSON.parse(parameters['Food Image Offsets'] || '[[0, 0]]');
    var eatSoundEffects = JSON.parse(parameters['Eat Sound Effects'] || '[{"name":"Absorb2","volume":90,"pitch":100,"pan":0}]');
    var crashSoundEffect = JSON.parse(parameters['Crash Sound Effect'] || '{"name":"Absorb1","volume":90,"pitch":100,"pan":0}');
    var scoreText = String(parameters['Score Text'] || 'Score: ');
    var finishCommonEventId = Number(parameters['Finish Common Event ID'] || 3);
    var cancelCommonEventId = Number(parameters['Cancel Common Event ID'] || 2);
    var startCommonEventId = Number(parameters['Start Common Event ID'] || 1);
    var scoreVarId = Number(parameters['Score Variable ID'] || 1);

    var UP = 8;
    var DOWN = 2;
    var LEFT = 4;
    var RIGHT = 6;

    var boardWidthTiles = 0;
    var boardHeightTiles = 0;
    var boardTotalTiles = 0;
    var segments;
    var food;
    var direction;
    var directionBuffer;
    var pointerInput;
    var alive;
    var score;
    var generateFoodCounter;
    var frameCounter;
    var canChangeDir;
    var level;

    function Window_Snake() {
        this.initialize.apply(this, arguments);
    }

    Window_Snake.prototype = Object.create(Window_Base.prototype);
    Window_Snake.prototype.constructor = Window_Snake;

    Window_Snake.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this._boardXOffset = Graphics.width % tileWidth;
        this._boardYOffset = Graphics.height % tileHeight;
        boardWidthTiles = Math.floor(Graphics.width / tileWidth);
        boardHeightTiles = Math.floor(Graphics.height / tileHeight);
        boardTotalTiles = boardWidthTiles * boardHeightTiles;
        this._snakeBitmap = ImageManager.loadBitmapFromPath(snakeImagePath);
        this._foodBitmap = ImageManager.loadBitmapFromPath(foodImagePath);
        this._bgSprite = new Sprite();
        this._bgSprite.initialize(ImageManager.loadBitmapFromPath(bgImagePath));
        this.addChildToBack(this._bgSprite);
        resetGameState();
    };

    Window_Snake.prototype.refresh = function() {
        this.contents.clear();
        this.contents.drawText(scoreText + score, 0, 0, Graphics.width, this.lineHeight(), 'left');
        for (var i = 0; i < segments.length; i++) {
            var segment = segments[i];
            this.contents.blt(this._snakeBitmap, snakeImageOffsets[i % snakeImageOffsets.length][0], snakeImageOffsets[i % snakeImageOffsets.length][1], tileWidth, tileHeight, segment.x * tileWidth + this._boardXOffset, segment.y * tileHeight + this._boardYOffset);
        }
        if (food) {
            this.contents.blt(this._foodBitmap, foodImageOffsets[score % foodImageOffsets.length][0], foodImageOffsets[score % foodImageOffsets.length][1], tileWidth, tileHeight, food.x * tileWidth + this._boardXOffset, food.y * tileHeight + this._boardYOffset);
        }
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
        this._interpreter = null;
        document.addEventListener('pointerdown', pointerEventListener);
    };

    Scene_Snake.prototype.create = function() {
        Scene_Base.prototype.create.call(this);
        this._window = new Window_Snake(0, 0, Graphics.width, Graphics.height);
        this.addChild(this._window);
        this._messageWindow = new Window_Message();
        this.addChild(this._messageWindow);
        this._messageWindow.subWindows().forEach(function(window) {
            this.addChild(window);
        }, this);
        if (startCommonEventId) {
            this.playCommonEvent(startCommonEventId);
        }
    };

    Scene_Snake.prototype.update = function() {
        Scene_Base.prototype.update.call(this);
        this._window.refresh();
        this.updateGame();
    };

    Scene_Snake.prototype.terminate = function() {
        Scene_Base.prototype.terminate.call(this);
        document.removeEventListener('pointerdown', pointerEventListener);
    };

    Scene_Snake.prototype.updateGame = function() {
        if (this._interpreter) {
            if (this._interpreter.isRunning()) {
                this._interpreter.update();
            }
            if (!this._interpreter.isRunning()) {
                this._interpreter = null;
            }
            return;
        }

        if (Input.isTriggered('cancel')) {
            if (cancelCommonEventId) {
                saveScore();
                this.playCommonEvent(cancelCommonEventId);
            } else {
                saveScoreAndEndScene();
            }
            return;
        }

        if (Input.isTriggered('left')) {
            setDirection(LEFT);
        } else if (Input.isTriggered('up')) {
            setDirection(UP);
        } else if (Input.isTriggered('right')) {
            setDirection(RIGHT);
        } else if (Input.isTriggered('down')) {
            setDirection(DOWN);
        } else if (directionBuffer) {
            setDirection(directionBuffer);
        } else if (pointerInput) {
            setDirection(pointerInput);
        }

        frameCounter++;
        if (alive && frameCounter % level === 0) {
            move();
            if (!food) {
                generateFoodCounter++;
                if (generateFoodCounter === 5) {
                    generateFood(segments);
                    generateFoodCounter = 0;
                }
            }
            canChangeDir = true;
        }

        if (!alive) {
            if (finishCommonEventId) {
                saveScore();
                this.playCommonEvent(finishCommonEventId);
            } else {
                $gameMessage.addText('Total score: ' + score);
                saveScoreAndEndScene();
            }
        }
    }

    Scene_Snake.prototype.playCommonEvent = function(commonEventId) {
        var commonEvent = $dataCommonEvents[commonEventId];
        this._interpreter = new Game_Interpreter();
        this._interpreter.setup(commonEvent.list);
    }

    function saveScoreAndEndScene() {
        saveScore();
        SceneManager.pop();
    }

    function saveScore() {
        if (scoreVarId) {
            $gameVariables.setValue(scoreVarId, score);
        }
    }

    function resetGameState() {
        segments = [
            {
                x : Math.floor(boardWidthTiles / 4),
                y : Math.floor(boardHeightTiles / 2)
            }
        ];
        food = null;
        direction = RIGHT;
        directionBuffer = null;
        pointerInput = null;
        alive = true;
        score = 0;
        generateFoodCounter = 0;
        frameCounter = 0;
        canChangeDir = true;
    }

    ImageManager.loadBitmapFromPath = function(path) {
        var lastSlashIndex = path.lastIndexOf('/')
        var folder = path.substr(0, lastSlashIndex + 1);
        var filename = path.substr(lastSlashIndex + 1);
        return ImageManager.loadBitmap(folder, filename);
    }

    function copySegment(segment) {
        return {
            x: segment.x,
            y: segment.y
        }
    }

    function isOutOfBounds(segment) {
        return segment.x < 0 || segment.x >= boardWidthTiles || segment.y < 0 || segment.y >= boardHeightTiles;
    }

    function collidesWithItself(segments) {
        for (var i = 1; i < segments.length; i++) {
            if (segments[0].x === segments[i].x && segments[0].y === segments[i].y) {
                return true;
            }
        }
        return false;
    }

    function move() {
        segments.unshift(copySegment(segments[0]));
        if (direction === UP) {
            segments[0].y--;
        } else if (direction === DOWN) {
            segments[0].y++;
        } else if (direction === LEFT) {
            segments[0].x--;
        } else if (direction === RIGHT) {
            segments[0].x++;
        }
        if (food != null && food.x === segments[0].x && food.y === segments[0].y) {
            food = null;
            if (segments.length === boardTotalTiles) {
                alive = false;
                return;
            }
            AudioManager.playSe(eatSoundEffects[score % eatSoundEffects.length]);
            score++;
        } else {
            segments.pop();
        }
        if (isOutOfBounds(segments[0]) || collidesWithItself(segments)) {
            alive = false;
            AudioManager.playSe(crashSoundEffect);
        }
    }

    function collidesWithSegments(food, segments) {
        for (var i = 0; i < segments.length; i++) {
            if (food.x === segments[i].x && food.y === segments[i].y) {
                return true;
            }
        }
        return false;
    }

    function generateFood(segments) {
        do {
            food = {
                x: Math.floor(Math.random() * boardWidthTiles),
                y: Math.floor(Math.random() * boardHeightTiles)
            };
        } while (collidesWithSegments(food, segments));
    }

    function setDirection(newDirection) {
        if (!canChangeDir) {
            directionBuffer = newDirection;
            return;
        }
        if (direction === UP && newDirection === DOWN) {
            return;
        }
        if (direction === DOWN && newDirection === UP) {
            return;
        }
        if (direction === LEFT && newDirection === RIGHT) {
            return;
        }
        if (direction === RIGHT && newDirection === LEFT) {
            return;
        }
        direction = newDirection;
        canChangeDir = false;
        directionBuffer = null;
        pointerInput = null;
    }

    function pointerEventListener(e) {
        if (e.button !== 0 || $gameMessage.isBusy()) {
            return;
        }
        var x = Graphics.pageToCanvasX(e.pageX);
        var y = Graphics.pageToCanvasY(e.pageY);

        var headSegment = segments[0];
        if (direction === RIGHT || direction === LEFT) {
            if (touchUp(y, headSegment)) {
                pointerInput = UP;
            } else if (touchDown(y, headSegment)) {
                pointerInput = DOWN;
            }
        } else {
            if (touchLeft(x, headSegment)) {
                pointerInput = LEFT;
            } else if (touchRight(x, headSegment)) {
                pointerInput = RIGHT;
            } 
        }
    }

    function touchLeft(x, headSegment) {
        return headSegment.x > x / tileWidth;
    }
    
    function touchRight(x, headSegment) {
        return headSegment.x < x / tileWidth;
    }
    
    function touchUp(y, headSegment) {
        return headSegment.y > y / tileHeight;
    }
    
    function touchDown(y, headSegment) {
        return headSegment.y < y / tileHeight;
    }

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'ILB7_Snake') {
            switch (args[0]) {
                case 'start':
                    level = Number(Window_Base.prototype.convertEscapeCharacters(args[1]));
                    SceneManager.push(Scene_Snake);
                break;
                case 'stop':
                    if (SceneManager._scene.constructor === Scene_Snake) {
                        saveScoreAndEndScene();
                    }
                break;
                case 'reset':
                    if (args[1]) {
                        level = Number(umber(Window_Base.prototype.convertEscapeCharacters(args[1])));
                    }
                    resetGameState();
                break;
                case 'snakeimageoffset':
                    var offsets = args.slice(1);
                    snakeImageOffsets = [];
                    for (var i = 0; i < offsets.length; i++) {
                        var split = offsets[i].split(',');
                        snakeImageOffsets.push([Number(split[0]), Number(split[1])]);
                    }
                break;
                case 'foodimageoffset':
                    var offsets = args.slice(1);
                    foodImageOffsets = [];
                    for (var i = 0; i < offsets.length; i++) {
                        var split = offsets[i].split(',');
                        foodImageOffsets.push([Number(split[0]), Number(split[1])]);
                    }
                break;
                case 'eatse':
                    var effects = args.slice(1);
                    eatSoundEffects = [];
                    for (var i = 0; i < effects.length; i++) {
                        eatSoundEffects.push(JSON.parse(effects[i]));
                    }
                break;
                case 'crashse':
                    var seJson = args.slice(1).join('');
                    crashSoundEffect = JSON.parse(seJson);
                break;
            }
        }
    };

})();
