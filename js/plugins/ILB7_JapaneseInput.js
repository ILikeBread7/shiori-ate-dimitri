//=============================================================================
// ILB7_JapaneseInput.js
//=============================================================================

/*:
 * @plugindesc This plugin allows the player to use the Japanese name input
 * @author I_LIKE_BREAD7
 *
 * @param japaneseLanguageId
 * @type number
 * @min 0
 * @desc The language ID that represents Japanese.
 * @default 1
 *
 * @help
 * This plugin allows the player to use the Japanese name input when the language is set to Japanese
 * It requires the SRD_TranslationEngine plugin
 */

(function() {

    var parameters = PluginManager.parameters('ILB7_JapaneseInput');
    var japaneseLanguageId = Number(parameters['japaneseLanguageId'] || 1);

    Game_System.prototype.isJapanese = function() {
        return ConfigManager.language === japaneseLanguageId;
    };
    
})();
