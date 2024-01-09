//=============================================================================
// ILB7_NonBlockingMessage.js
//=============================================================================

/*:
 * @plugindesc Creates a non blocking text message
 * @author I_LIKE_BREAD7
 *
 * @help
 *
 * Plugin Command:
 *   ILB7_NonBlockingMessage text            # Displays message containing "text"
 *   ILB7_NonBlockingMessagePermanent text   # Displays message containing "text" permanently until closed with the ILB7_NonBlockingMessageClose command
 *   ILB7_NonBlockingMessageClose            # Closes permanent message
 *   ILB7_NonBlockingMessageXY 10 20 center  # Sets x = 10, y = 20 and align = center (align in optional)
 */

(function() {

    var _ILB7_text;
    var _ILB7_x = 0;
    var _ILB7_y = 0;
    var _ILB7_align = 'center';
    var _ILB7_permanent = false;

    //-----------------------------------------------------------------------------
    // ILB7_NonBlockingMessage
    //
    // The window for displaying the non blocking message
    function ILB7_NonBlockingMessage() {
        this.initialize.apply(this, arguments);
    }

    ILB7_NonBlockingMessage.prototype = Object.create(Window_MapName.prototype);
    ILB7_NonBlockingMessage.prototype.constructor = ILB7_NonBlockingMessage;

    ILB7_NonBlockingMessage.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        if (_ILB7_permanent) {
            this.updateFadeIn();
            return;
        }
        if (this._showCount > 0) {
            this.updateFadeIn();
            this._showCount--;
        } else {
            this.updateFadeOut();
        }
    };

    ILB7_NonBlockingMessage.prototype.refresh = function() {
        this.contents.clear();
        if (_ILB7_text) {
            var width = this.contentsWidth();
            this.drawBackground(_ILB7_x, _ILB7_y, width, this.lineHeight());
            this.drawText(_ILB7_text, _ILB7_x, _ILB7_y, width, _ILB7_align);
        }
    };

    ILB7_NonBlockingMessage.prototype.windowWidth = function() {
        return Graphics.boxWidth;
    };
    
    ILB7_NonBlockingMessage.prototype.windowHeight = function() {
        return Graphics.boxHeight;
    };

    var _ILB7_nonBlockingMessage = null;
    var oldSceneMapcreateDisplayObjects = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function() {
        oldSceneMapcreateDisplayObjects.call(this);
        _ILB7_nonBlockingMessage = new ILB7_NonBlockingMessage();
        this.addChild(_ILB7_nonBlockingMessage);
    };

    var oldPluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        oldPluginCommand.call(this, command, args);
        switch (command) {
            case 'ILB7_NonBlockingMessage':
                _ILB7_permanent = false;
                _ILB7_text = _ILB7_nonBlockingMessage.convertEscapeCharacters(args.join(' '));
                _ILB7_nonBlockingMessage.open();
            break;
            case 'ILB7_NonBlockingMessagePermanent':
                _ILB7_permanent = true;
                _ILB7_text = _ILB7_nonBlockingMessage.convertEscapeCharacters(args.join(' '));
                _ILB7_nonBlockingMessage.open();
            break;
            case 'ILB7_NonBlockingMessageXY':
                _ILB7_x = Number(args[0]);
                _ILB7_y = Number(args[1]);
                if (args[2]) {
                    _ILB7_align = args[2];
                }
            break;
            case 'ILB7_NonBlockingMessageClose':
                _ILB7_permanent = false;
                _ILB7_nonBlockingMessage.close();
            break;
        }
    };

})();