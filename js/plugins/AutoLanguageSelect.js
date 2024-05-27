//=============================================================================
// AutoLanguageSelect.js
//=============================================================================

/*:
 * @plugindesc Automatically set language in RPG Maker MV based on browser language.
 * @author [Your Name]
 * @help This plugin automatically sets the language in RPG Maker MV
 * based on the browser language detected.
 *
 * @param LanguageMap
 * @text Language Map
 * @type struct<LanguageMap>[]
 * @desc Map of browser language to RPG Maker MV language.
 * @default []
 *
 * @param DefaultLanguage
 * @text Default Language
 * @type number
 * @desc Default language ID if no match is found in the language map.
 * @default 0
 */

/*~struct~LanguageMap:
 * @param BrowserLanguage
 * @text Browser Language
 * @type string
 * @desc Browser language code.
 * 
 * @param RMVLanguage
 * @text RPG Maker MV Language
 * @type number
 * @desc Corresponding RPG Maker MV language ID.
 */

(function() {
    var pluginParams = PluginManager.parameters('AutoLanguageSelect');
    var languageMap = JSON.parse(pluginParams['LanguageMap'] || '[]').map(JSON.parse);
    var defaultLanguage = parseInt(pluginParams['DefaultLanguage'] || 0);

    // Function to get browser language
    function getBrowserLanguage() {
        return navigator.language || navigator.userLanguage;
    }

    // Function to set language
    function setLanguage(languageId) {
        ConfigManager.language = languageId;
    }

    // Function to get RPG Maker MV language ID based on browser language
    function getRMVLanguageId(browserLanguage) {
        for (var i = 0; i < languageMap.length; i++) {
            if (browserLanguage === languageMap[i].BrowserLanguage) {
                return parseInt(languageMap[i].RMVLanguage);
            }
        }
        return defaultLanguage;
    }

    // Automatically set language on game load
    var _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.call(this);
        var browserLanguage = getBrowserLanguage();
        var rmvLanguageId = getRMVLanguageId(browserLanguage);
        setLanguage(rmvLanguageId);
    };
})();
