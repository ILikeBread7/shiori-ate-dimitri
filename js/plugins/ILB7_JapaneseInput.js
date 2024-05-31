//=============================================================================
// ILB7_JapaneseInput.js
//=============================================================================

/*:
 * @plugindesc This plugin allows the player to use the Japanese name input
 * @author I_LIKE_BREAD7
 *
 * @param Japanese Language Name
 * @type string
 * @min 0
 * @desc The language name that represents Japanese as defined in the SRD_TranslationEngine plugin
 * @default 日本語
 *
 * @help
 * This plugin allows the player to use the Japanese name input when the language is set to Japanese
 * It requires the SRD_TranslationEngine plugin
 */

(function() {

    var parameters = PluginManager.parameters('ILB7_JapaneseInput');
    var japaneseLanguageName = parameters['Japanese Language Name'] || '日本語';

    Game_System.prototype.isJapanese = function() {
        return ConfigManager.getLanguage() === japaneseLanguageName;
    };
    
})();
