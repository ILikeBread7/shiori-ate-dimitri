//=============================================================================
// ILB7_RemoveItemCategories.js
//=============================================================================

/*:
 * @plugindesc Removes item categories, shows only items in the "items" category
 * @author I_LIKE_BREAD7
 * 
 *
 * @help This plugin does not provide plugin commands.
 */

(function() {

    Scene_Item.prototype.createCategoryWindow = function() {
        // empty
    };

    Scene_Item.prototype.createItemWindow = function() {
        var wy = this._helpWindow.height;
        var wh = Graphics.boxHeight - wy;
        this._itemWindow = new Window_ItemList(0, wy, Graphics.boxWidth, wh);
        this._itemWindow.setHelpWindow(this._helpWindow);
        this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
        this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
        this.addWindow(this._itemWindow);
        this._itemWindow.setCategory('item');
        this.onCategoryOk();
    };

    Scene_Item.prototype.onItemCancel = function() {
        this._itemWindow.deselect();
        this.popScene();
    };

})();