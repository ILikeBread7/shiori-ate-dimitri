//=============================================================================
// ILB7_RemoveUnusedOptions.js
//=============================================================================

/*:
 * @plugindesc Removes unused options from the options menu
 * @author I_LIKE_BREAD7
 *
 * @param Enable Always dash
 * @desc Enable always dash option
 * OFF - false     ON - true
 * Default: ON
 * @default true
 * 
 * @param Enable Command remember
 * @desc Enable command remember option
 * OFF - false     ON - true
 * Default: ON
 * @default true
 * 
 * @param Enable Bgm volume
 * @desc Enable bgm volume option
 * OFF - false     ON - true
 * Default: ON
 * @default true
 * 
 * @param Enable Bgs volume
 * @desc Enable bgs volume option
 * OFF - false     ON - true
 * Default: ON
 * @default true
 * 
 * @param Enable Me volume
 * @desc Enable me volume option
 * OFF - false     ON - true
 * Default: ON
 * @default true
 * 
 * @param Enable Se volume
 * @desc Enable se volume option
 * OFF - false     ON - true
 * Default: ON
 * @default true
 * 
 * @help This plugin does not provide plugin commands.
 */

(function() {

    var parameters = PluginManager.parameters('ILB7_RemoveUnusedOptions');
    var alwaysDash = JSON.parse(parameters['Enable Always dash']);
    var commandRemember = JSON.parse(parameters['Enable Command remember']);
    var bgmVolume = JSON.parse(parameters['Enable Bgm volume']);
    var bgsVolume = JSON.parse(parameters['Enable Bgs volume']);
    var meVolume = JSON.parse(parameters['Enable Me volume']);
    var seVolume = JSON.parse(parameters['Enable Se volume']);

    Window_Options.prototype.makeCommandList = function() {
        if (alwaysDash) {
            this.addCommand(TextManager.alwaysDash, 'alwaysDash');
        }
        if (commandRemember) {
            this.addCommand(TextManager.commandRemember, 'commandRemember');
        }
        if (bgmVolume) {
            this.addCommand(TextManager.bgmVolume, 'bgmVolume');
        }
        if (bgsVolume) {
            this.addCommand(TextManager.bgsVolume, 'bgsVolume');
        }
        if (meVolume) {
            this.addCommand(TextManager.meVolume, 'meVolume');
        }
        if (seVolume) {
            this.addCommand(TextManager.seVolume, 'seVolume');
        }
    };

})();