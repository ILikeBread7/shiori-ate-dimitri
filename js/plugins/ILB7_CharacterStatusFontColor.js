//=============================================================================
// ILB7_CharacterStatusFontColor.js
//=============================================================================

/*:
 * @plugindesc Allows to use custom font colors for the characters status
 * @author I_LIKE_BREAD7
 * 
 * @param Colors
 * @desc Comma-separated list of actorId,color pairs, eg. 1,#ff0000,2,#00ff00...
 * @default 1,#ff0000,2,#00ff00
 *
 * @help This plugin does not provide plugin commands.
 */

(function() {

    var parameters = PluginManager.parameters('ILB7_CharacterStatusFontColor');
    var colorsParam = parameters['Colors'];

    var actorColors = [];

    var split = colorsParam.split(',');
    for (var i = 0; i < split.length; i += 2) {
        var actorId = Number(split[i]);
        var color = split[i + 1];
        actorColors[actorId] = color;
    }

    Window_Base.prototype.drawActorName = function(actor, x, y, width) {
        width = width || 168;
        var color = actorColors[actor.actorId()];
        if (color) {
            this.changeTextColor(color);
        } else {
            this.resetTextColor();
        }
        this.drawText(actor.name(), x, y, width);
    };

    Window_Base.prototype.drawActorClass = function(actor, x, y, width) {
        width = width || 168;
        var color = actorColors[actor.actorId()];
        if (color) {
            this.changeTextColor(color);
        } else {
            this.resetTextColor();
        }
        this.drawText(actor.currentClass().name, x, y, width);
    };

    Window_Base.prototype.drawActorNickname = function(actor, x, y, width) {
        width = width || 270;
        var color = actorColors[actor.actorId()];
        if (color) {
            this.changeTextColor(color);
        } else {
            this.resetTextColor();
        }
        this.drawText(actor.nickname(), x, y, width);
    };

    Window_Base.prototype.drawActorLevel = function(actor, x, y) {
        var color = actorColors[actor.actorId()];
        if (color) {
            this.changeTextColor(color);
        } else {
            this.resetTextColor();
        }
        this.drawText(TextManager.levelA, x, y, 48);
        this.drawText(actor.level, x + 84, y, 36, 'right');
    };


})();