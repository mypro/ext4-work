Ext.define('Layout.controller.EditFactorController', {
    extend: 'Ext.app.Controller',
    stores: [
             "CommonFactorStore"
    ],
    models: [
             "CommonFactorModel"   
    ],
    

    init: function() {
    	this.control({
        	'#editFactorGrid' : {
        		cellclick : this.cellclick,
        		clickProperty : this.clickProperty,
        		clickRelation : this.clickRelation,
        		clickDelete : this.clickDelete
            }
        });
    },
    
    cellclick: function(cell, td, cellIndex,record, tr){
    	if(0 == cellIndex){
    		this.selectFactor(tr, record);
    	}
    },
    
    selectFactor : function(dom,record){
    	var uuid = record.get('uuid');
    		cellView = Layout.DrawController.paper.findViewByModel(
    						Layout.DrawController.graph.getCell(uuid));
    		
    	Layout.Select.cancelSelect();
    	cellView.highlight();
    	Ext.getCmp('drawPanel').focus();
    },
    
    clickDelete : function(uuid){
    	var poolStore = Layout.EventSchedule.factorStore,
    		record = poolStore.findRecordByKey('uuid', uuid);
    	
    	poolStore.remove(record);
    },
    
    clickProperty : function(uuid, grid){
    	var poolStore = Layout.EventSchedule.factorStore;
    		records = poolStore.getPropertyRecords(uuid);
    	
    	// add other property
    	var selectedPropMap = {};
    	Ext.Array.each(records, function(record){
    		selectedPropMap[record.get('defineUuid')] = true;
    	});
    	Ext.Array.each(defaultFactorProp, function(defaultProp, i){
    		if(selectedPropMap[defaultProp.defineUuid]){
    			return true;
    		}
    		
    		var record = new Layout.model.CommonFactorModel();  
    		Ext.apply(record.data, defaultProp);
    		record.set('uuid', 'newProp-'+i);   
    		
    		records.push(record);
    	});
    		
    	// show property in grid
    	grid.parentUuid = uuid;
    	grid.selModel.selection = null;
    	grid.getStore().removeAll();
    	grid.getStore().add(records);
    	grid.loadEditor.call(grid, records);
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
    
    beginEdit : function(editor){
    	var grid = Ext.getCmp('editFactorGrid');
    	
    	editor.selectRow = grid.selectPosition.row;
    },
    
    completeEditProp : function(editor, newValue, oldValue){
    	var grid = Ext.getCmp('editFactorGrid'),
    		record = grid.getStore().getAt(editor.selectRow),
    		factorUuid = record.get('uuid'),
    		poolStore = Layout.EventSchedule.factorStore,
    		factor = poolStore.findRecordByKey('uuid', factorUuid);
    	
    	if(newValue instanceof Date){
    		newValue = Ext.Date.format(newValue, 'Y-m-d');
    	}
    	
    	Layout.FactorValue.setFactorValue(factor, newValue);
    }
});