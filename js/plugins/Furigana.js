/*:
 * @plugindesc Allows to add rubi text (furigana) to text messages using the format {漢字|ふりがな}.
 * @param Furigana Text Size
 * @desc The font size of the furigana text.
 * @default 20
 *
 * @param Furigana Vertical Offset
 * @desc The vertical offset of the furigana text from the main text.
 * @default -10
 *
 * @help
 * This plugin allows you to add rubi text (furigana) to text messages by using
 * the format {漢字|ふりがな}.
 *
 * Example:
 *   {漢字|かんじ} will display 漢字 with かんじ above it as furigana.
 */

(function() {
    var parameters = PluginManager.parameters('Furigana');
    var furiganaTextSize = parseInt(parameters['Furigana Text Size']);
    var furiganaVerticalOffset = parseInt(parameters['Furigana Vertical Offset']);

    const _Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
    
    Window_Base.prototype.convertEscapeCharacters = function(text) {
        text = _Window_Base_convertEscapeCharacters.call(this, text);
        text = text.replace(/\{(.+?)\|(.+?)\}/g, function() {
            return '\x1bFS[' + arguments[1] + '|' + arguments[2] + ']';
        });
        return text;
    };

    const _Window_Message_processEscapeCharacter = Window_Message.prototype.processEscapeCharacter;
    
    Window_Message.prototype.processEscapeCharacter = function(code, textState) {
        switch (code) {
            case 'FS':
                const furiganaText = this.obtainFuriganaText(textState);
                if (furiganaText) {
                    this.processFuriganaText(furiganaText, textState);
                }
                break;
            default:
                _Window_Message_processEscapeCharacter.call(this, code, textState);
                break;
        }
    };

    Window_Message.prototype.obtainFuriganaText = function(textState) {
        const text = textState.text.slice(textState.index);
        const match = /^\[([^\]]+)\|([^\]]+)\]/.exec(text);
        if (match) {
            textState.index += match[0].length;
            return { kanji: match[1], furigana: match[2] };
        } else {
            return null;
        }
    };

    Window_Message.prototype.processFuriganaText = function(furiganaText, textState) {
        if (furiganaText) {
            const kanjiWidth = this.textWidth(furiganaText.kanji);
            const furiganaWidth = this.textWidth(furiganaText.furigana);
            const offsetX = (kanjiWidth - furiganaWidth) / 2;
            
            // Draw furigana
            this.contents.fontSize = furiganaTextSize;
            this.contents.drawText(furiganaText.furigana, textState.x + offsetX, textState.y + furiganaVerticalOffset, furiganaWidth, this.lineHeight(), 'center');
            this.resetFontSettings();
            
            // Draw kanji
            const textBackup = textState.text;
            const indexBackup = textState.index;
            textState.text = furiganaText.kanji;
            textState.index = 0;
            while (textState.index < furiganaText.kanji.length) {
                this.processNormalCharacter(textState);
            }
            textState.text = textBackup;
            textState.index = indexBackup;
        }
    };

})();
