//=============================================================================
// ILB7_RemoveCharacterStatusBattleItems.js
//=============================================================================

/*:
 * @plugindesc Removes battle related items on the character status screen
 * @author I_LIKE_BREAD7
 * 
 * @param Number of images
 * @desc The amount of background sprites used in the game
 * @default 2
 * 
 * @param Image X
 * @desc X (horizontal) position of the image relative to the top left corner of the character status window
 * @default 0
 * 
 * @param Image Y
 * @desc Y (vertical) position of the image relative to the top left corner of the character status window
 * @default 0
 *
 * @help This plugin does not provide plugin commands.
 */

(function() {

    var parameters = PluginManager.parameters('ILB7_RemoveCharacterStatusBattleItems');
    var imagesNumber = Number(parameters['Number of images'] || 2);
    var imageX = Number(parameters['Image X'] || 0);
    var imageY = Number(parameters['Image Y'] || 0);

    var _sprites = [];
    var _image = [];
    for (var i = 1; i <= imagesNumber; i++) {
        _image.push(ImageManager.loadSystem('bgsprite_' + i));
    }

    var baseInitialize = Window_MenuStatus.prototype.initialize;
    Window_MenuStatus.prototype.initialize = function(x, y) {
        if (_sprites.length < imagesNumber) {
            for (var i = 1; i <= imagesNumber; i++) {
                var sprite = new Sprite();
                sprite.initialize(_image[i - 1]);
                sprite.visible = false;
                _sprites.push(sprite);
            }
        }
        baseInitialize.call(this, x, y);
    }

    Window_MenuStatus.prototype.drawActorSimpleStatus = function(actor, x, y, width) {
        var lineHeight = this.lineHeight();
        this.drawActorName(actor, x, y, width);
        this.drawActorClass(actor, x, y + lineHeight, width);
        if (actor.actorId() <= imagesNumber) {
            var sprite = _sprites[actor.actorId() - 1];
            sprite.move(imageX, y + imageY);
            sprite.visible = true;
            this.addChildToBack(sprite);
        }
    };

    Window_MenuStatus.prototype.numVisibleRows = function() {
        return Math.min($gameParty.size(), 4);
    };

    Window_MenuStatus.prototype.windowHeight = function() {
        var pad = this.standardPadding();
        return (Graphics.boxHeight - 2 * pad) * this.numVisibleRows() / 4 + 2 * pad;
    };

    var oldRefresh = Window_MenuStatus.prototype.refresh;
    Window_MenuStatus.prototype.refresh = function() {
        this.y = (Graphics.boxHeight - this.windowHeight()) / 2;
        oldRefresh.call(this);
    }

})();