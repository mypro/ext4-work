Ext.define('Layout.controller.EditFactorController', {
    extend: 'Ext.app.Controller',
    stores: [
             "CommonFactorStore"
    ],
    models: [
             "CommonFactorModel"   
    ],
    view: [
           	//"FactorEditGrid"
    ],
    
//    refs : [{  
//        selector: '#baseFactorPropGrid',  
//        ref: 'baseFactorPropGrid'  
//    },{
//    	selector : '#factor-tab',
//    	ref: 'factorTab'
//    },{
//    	selector : '#relationGrid',
//    	ref: 'relationGrid'
//    },{
//    	selector : '#drawPanel',
//    	ref: 'drawPanel'
//    }],

    init: function() {
    	this.control({
        	'#editFactorGrid' : {
        		clickProperty : this.clickProperty,
        		clickRelation : this.clickRelation,
        		clickDelete : this.clickDelete
            }
        });
    },
    
    clickDelete : function(uuid){
    	var poolStore = Layout.App.getController('PoolFactorController').factorStore;
    	var record = poolStore.findRecordByKey('uuid', uuid);
    	poolStore.remove(record);
    },
    
    clickProperty : function(uuid, grid){
    	grid.factorUuid = uuid;
    	grid.getStore().load({
    		scope: grid,
    		callback: function(){
    			grid.loadEditor.apply(grid, arguments);
    			if(grid.loadCallback){
    				grid.loadCallback.apply(grid, arguments);
    			}
    		},
    			
    	    params: {
    	    	condition : Ext.encode({
					parentUuid : uuid
				})
    	    }
    	});
    	grid.up('tabpanel').setActiveTab(1);
    },
    
    clickRelation : function(uuid, grid){
    	grid.getStore().load({
			params:{
				condition : Ext.encode({
					factorUuid : uuid
				})
			}
		});
    	grid.up('tabpanel').setActiveTab(2);
    },
    
    completeEditProp : function(editor, newValue, oldValue){
    	var grid = Ext.getCmp('editFactorGrid');
    	var selectRow = grid.selectPosition.row;
    	var record = grid.getStore().getAt(selectRow);
    	var factorUuid = record.get('uuid');
    	
    	var poolStore = Layout.App.getController('PoolFactorController').factorStore;
    	poolStore.fireEvent('editValue', factorUuid, newValue, oldValue, "editGridCallback");
    	
//    	var factor = poolStore.findRecordByKey("uuid",factorUuid);
//    	
//    	var prop = factor.setProperty(propDefineUuid,newValue);
//    	poolStore.fireEvent('editProperty', prop, oldValue, factor, "editGridCallback");
    }
});