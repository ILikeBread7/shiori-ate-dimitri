//=============================================================================
// ILB7_TitleMenuImages.js
//=============================================================================

/*:
 * @plugindesc Allows to use images as the background for the title menu options
 * @author I_LIKE_BREAD7
 * 
 * @param Image regular
 * @desc Filename (without the extension) from the system folder of the image for not selected options
 * @dir img/system/
 * @type file
 * @default title_image_regular
 * 
 * @param Image selected
 * @desc Filename (without the extension) from the system folder of the image for the selected option
 * @dir img/system/
 * @type file
 * @default title_image_selected
 * 
 * @param Selected color
 * @desc Color for the selected item's text
 * @default #ff0
 * 
 * @param Text align
 * @desc Item text alignment (left/center/right)
 * @default center
 * 
 * @param Text offset X
 * @desc X (horizontal) offset of the text's position inside an item
 * @default 0
 * 
 * @param Text offset Y
 * @desc Y (horizontal) offset of the text's position inside an item
 * @default 0
 * 
 * @param Window X
 * @desc X position of the title menu window (horizontal), allows scripts
 * @default (Graphics.boxWidth - this.width) / 2
 * 
 * @param Window Y
 * @desc Y position of the title menu window (vertical), allows scripts
 * @default (Graphics.boxHeight - this.height) / 2
 * 
 * @help This plugin does not provide plugin commands.
 */

(function() {

    var parameters = PluginManager.parameters('ILB7_TitleMenuImages');
    var selectedColor = String(parameters['Selected color'] || '#ff0');
    var textAlign = String(parameters['Text align'] || 'center');
    var textOffsetX = Number(parameters['Text offset X'] || 0);
    var textOffsetY = Number(parameters['Text offset Y']) || 0;

    var imageRegular = ImageManager.loadSystem(String(parameters['Image regular'] || 'title_image_regular'));
    var imageSelected = ImageManager.loadSystem(String(parameters['Image selected'] || 'title_image_selected'));

    // intentionally left undefined to be initialized
    // in the initialize function
    var windowX;
    var windowY;

    var _Window_TitleCommand_initialize = Window_TitleCommand.prototype.initialize;
    Window_TitleCommand.prototype.initialize = function() {
        _Window_TitleCommand_initialize.call(this);
        this.opacity = 0;
        if (typeof windowX === 'undefined') {
            windowX = eval(parameters['Window X'] || (Graphics.boxWidth - this.width) / 2);
        }
        if (typeof windowY === 'undefined') {
            windowY = eval(parameters['Window Y'] || (Graphics.boxHeight - this.height) / 2);
        }
        this.x = windowX;
        this.y = windowY;
    };

    Window_TitleCommand.prototype.drawItem = function(index) {
        var rect = this.itemRectForText(index);
        var selected = this._index === index;
        var bitmap = selected ? imageSelected : imageRegular;;
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, rect.x, rect.y);
        this.setOptionTextColor(selected);
        this.drawText(this.commandName(index), rect.x + textOffsetX, rect.y + textOffsetY, rect.width, textAlign);
    }

    Window_TitleCommand.prototype.setOptionTextColor = function(selected, disabled) {
        if (selected) {
            this.changeTextColor(selectedColor);
        } else {
            this.resetTextColor();
        }
    }

    var _Window_TitleCommand_select = Window_TitleCommand.prototype.select;
    Window_TitleCommand.prototype.select = function(index) {
        _Window_TitleCommand_select.call(this, index);
        this.refresh();
        this.setCursorRect(0, 0, 0, 0);
    }

    Window_TitleCommand.prototype.itemWidth = function() {
        return imageRegular.width;
    }

    Window_TitleCommand.prototype.windowWidth = function() {
        return imageRegular.width + this.standardPadding() * 2;
    }

    Window_TitleCommand.prototype.lineHeight = function() {
        return imageRegular.height;
    }

})();