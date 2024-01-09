//=============================================================================
// ILB7_MessageWindowBackSprite.js.js
//=============================================================================

/*:
 * @plugindesc Adds backsprite to message window
 * @author I_LIKE_BREAD7
 * 
 * @param Number of images
 * @desc The amount of background sprites used in the game
 * @default 2
 * 
 * @param Image var ID
 * @desc ID of the in-game variable used to determine which image to use
 * @default 1
 * 
 * @param Image X
 * @desc X (horizontal) position of the image relative to the top left corner of the message window
 * @default 0
 * 
 * @param Image Y
 * @desc Y (vertical) position of the image relative to the top left corner of the message window
 * @default 0
 *
 * @param Add items list backsprite
 * @desc Adds the backsprite to items list too
 * OFF - false     ON - true
 * Default: ON
 * @default true
 * 
 * @param Items image X
 * @desc X (horizontal) position of the image relative to the top left corner of the items list window
 * @default 0
 * 
 * @param Items image Y
 * @desc Y (vertical) position of the image relative to the top left corner of the items list window
 * @default 0
 * 
 * @param Add save list backsprite
 * @desc Adds the backsprite to save/load list too
 * OFF - false     ON - true
 * Default: ON
 * @default true
 * 
 * @param Save image X
 * @desc X (horizontal) position of the image relative to the top left corner of the save/load list window
 * @default 0
 * 
 * @param Save image Y
 * @desc Y (vertical) position of the image relative to the top left corner of the save/load list window
 * @default 0
 * 
 * @help Place the images in /img/system/bgsprite_X.png where X is the value of the variable in Image var ID
 */

(function() {

    var parameters = PluginManager.parameters('ILB7_MessageWindowBackSprite');
    var imagesNumber = Number(parameters['Number of images'] || 2);
    var imageVarId = Number(parameters['Image var ID'] || 1);
    var imageX = Number(parameters['Image X'] || 0);
    var imageY = Number(parameters['Image Y'] || 0);
    var addItemsBackSprite = JSON.parse(parameters['Add items list backsprite']);
    var itemsImageX = Number(parameters['Items image X'] || 0);
    var itemsImageY = Number(parameters['Items image Y'] || 0);
    var addSaveBackSprite = JSON.parse(parameters['Add save list backsprite']);
    var saveImageX = Number(parameters['Save image X'] || 0);
    var saveImageY = Number(parameters['Save image Y'] || 0);

    var _image = [];
    var _currentImage = 0;
    var _currentSkin = 0;
    var _currentSprite = null;

    for (var i = 1; i <= imagesNumber; i++) {
        _image.push(ImageManager.loadSystem('bgsprite_' + i));
    }

    var baseInitialize = Window_Message.prototype.initialize;
    Window_Message.prototype.initialize = function() {
        baseInitialize.call(this);
        this._ILB7_sprite = new Sprite();
        this._ILB7_sprite.initialize(_image[_currentImage]);
        this._ILB7_sprite.visible = false;
        this._ILB7_sprite.move(imageX, imageY);
        this.addChildToBack(this._ILB7_sprite);
    }

    var baseStartMessage = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function() {
        var skin = $gameVariables.value(imageVarId);
        if (skin !== 0) {
            if (_currentImage !== skin - 1) {
                _currentImage = skin - 1;
                this._ILB7_sprite.bitmap = _image[_currentImage];
            }
            this._ILB7_sprite.visible = true;
        }
        baseStartMessage.call(this);
    };

    var baseTerminateMessage = Window_Message.prototype.terminateMessage;
    Window_Message.prototype.terminateMessage = function() {
        this._ILB7_sprite.visible = false;
        baseTerminateMessage.call(this);
    };

    if (addItemsBackSprite) {
        var oldItemWindow = Scene_Item.prototype.createItemWindow;
        Scene_Item.prototype.createItemWindow = function() {
            oldItemWindow.call(this);
            var skin = $gameVariables.value(imageVarId);
            if (skin !== 0) {
                var sprite = new Sprite();
                sprite.initialize(_image[skin - 1]);
                sprite.move(itemsImageX, itemsImageY);
                this._itemWindow.addChildToBack(sprite);
            }
        }
    }

    if (addSaveBackSprite) {
        var oldListWindow = Scene_File.prototype.createListWindow;
        Scene_File.prototype.createListWindow = function() {
            oldListWindow.call(this);
            var skin = $gameVariables.value(imageVarId);
            if (skin !== 0) {
                var sprite = new Sprite();
                sprite.initialize(_image[skin - 1]);
                sprite.move(saveImageX, saveImageY);
                this._listWindow.addChildToBack(sprite);
                _currentSprite = sprite;
            }
        }

        var oldUpdate = Scene_Load.prototype.update;
        Scene_Load.prototype.update = function() {
            var skin = $gameVariables.value(imageVarId);
            if (skin !== _currentSkin) {
                if (_currentSprite) {
                    _currentSprite.bitmap = _image[skin - 1];
                    if (_currentSkin === 0) {
                        this._listWindow.addChildToBack(_currentSprite);
                    }
                } else {
                    var sprite = new Sprite();
                    sprite.initialize(_image[skin - 1]);
                    sprite.move(saveImageX, saveImageY);
                    this._listWindow.addChildToBack(sprite);
                    _currentSprite = sprite;
                }
                _currentSkin = skin;
            }
            oldUpdate.call(this);
        }
        
    }

})();