Ext.define('Layout.controller.EditFactorPropController', {
    extend: 'Ext.app.Controller',
    stores: [
             "CommonPropStore"
    ],
    models: [
             "CommonFactorModel"   
    ],
    view: [
    ],
    
    init: function() {
    	this.control({
        	'#editFactorPropGrid' : {
        		containerdblclick : this.addProp,
        		clickFactor: this.clickFactor,
        		clickDelete: this.clickDelete
            }
        });
    },
    
    addProp : function(){
    	
    	var win = Ext.getCmp('factorDefineWindow');
    	var grid = Ext.getCmp('editFactorPropGrid');
    	
    	win.isEditProperty = true; 
    	win.parentUuid = grid.factorUuid;
    	
    	var windowController = FDW.App.getController('DefineWindowController');
    	windowController.clear(win);
    	
    	win.show();
    	win.callback.save = function(factorDefineRecord, parentUuid, parentType){
    		var propertyRec = new Layout.model.CommonFactorModel();
        	Ext.apply(propertyRec.data, factorDefineRecord);
        	
        	var poolController = Layout.App.getController('PoolFactorController');
        	var factor = poolController.factorStore.findRecordByKey('uuid', parentUuid);
        	factor.addProperty(propertyRec.data);
        	this.hide();
        	
        	poolController.factorStore.fireEvent('addProperty', parentUuid, propertyRec, grid, "editGridCallback");
    	};
    	
    },
    
    clickDelete : function(factorUuid, uuid){
    	var poolController = Layout.App.getController('PoolFactorController');
    	poolController.factorStore.fireEvent('deleteProperty', factorUuid, uuid, Ext.getCmp('editFactorPropGrid'),'editGridCallback');
    },
    
    clickFactor : function(uuid, grid){
    	$('#'+grid.id+' .x-grid-row-selected').removeClass('x-grid-row-selected');
    	$('#'+grid.id+' tr[data-recordid='+uuid+']').addClass('x-grid-row-selected');
    	
    	grid.up('tabpanel').setActiveTab(0);
    },
    
    completeEditProp : function(editor, newValue, oldValue){
    	var propGrid = Ext.getCmp('editFactorPropGrid');
    	var selectRow = propGrid.selectPosition.row;
    	var propRecord = propGrid.getStore().getAt(selectRow);
    	var propDefineUuid = propRecord.get('defineUuid');
    	var factorUuid = propGrid.factorUuid;
    	
    	var poolStore = Layout.App.getController('PoolFactorController').factorStore;
    	var factor = poolStore.findRecordByKey("uuid",factorUuid);
    	
    	var prop = factor.setProperty(propDefineUuid,newValue);
    	poolStore.fireEvent('editProperty', prop, oldValue, factor, "editGridCallback");
    }
});