Ext.define('Layout.controller.EditFactorPropController', {
    extend: 'Ext.app.Controller',
    stores: [
             "CommonPropStore"
    ],
    models: [
             "CommonFactorModel"   
    ],
    
    init: function() {
    	this.control({
        	'#editFactorPropGrid' : {
        		viewready : this.afterRender,
        		containerdblclick : this.addProp,
        		cellclick : this.cellclick
            }
        });
    },
    
    afterRender : function(grid){
    },
    
    cellclick: function(cell, td, cellIndex,record, tr){
    	if(0 == cellIndex){
    		this.selectProp(tr, record);
    	}
    },
    
    selectProp : function(dom,record){
    	var parentUuid = Ext.getCmp('editFactorPropGrid').parentUuid,
    		parent = Layout.EventSchedule.factorStore
    				.findRecordByKey('uuid', parentUuid),
    		propertyRec = new Layout.model.CommonFactorModel(),
    		propData = parent.getProperty(record.get('defineUuid')),
    		factorPanel = Ext.getCmp('factorPanel');
    	
    	Ext.apply(propertyRec.data, propData);
    	
    	factorPanel.isEditProperty = true;
		factorPanel.fireEvent('initForm', propertyRec, parentUuid, RELATIONTYPE_FACTOR_PROP, true);
    },
    
    addProp : function(){
    	this.createProp(Layout.DefaultDefine.createProp());
    },
    
    createProp : function(propertyRec){
    	var grid = Ext.getCmp('editFactorPropGrid'),
			factorUuid = grid.parentUuid,
			ES = Layout.EventSchedule;
		
		var fn = function(factorUuid, parentType, propertyRec){
			var factor = ES.factorStore.findRecordByKey('uuid', factorUuid);
			factor.addProperty(propertyRec.data);
		};
		
		ES.fireEvent(ES.factorStore, 'addProperty', factorUuid, RELATIONTYPE_FACTOR_PROP, 
													propertyRec, grid, fn);
    },
    
    beginEdit : function(editor){
    	var grid = Ext.getCmp('editFactorPropGrid');
    	
    	editor.uuid = grid.parentUuid;
    },
    
    completeEditProp : function(editor, newValue, oldValue){
    	var propGrid = Ext.getCmp('editFactorPropGrid'),
    		selectRow,
    		propRecord,
    		propDefineUuid,
    		factorUuid,
    		poolStore,
    		factor;
    	
    	// because of grid refresh, cause that inconformity
		if(editor.uuid !== propGrid.parentUuid){
			return;
		}
    		
    	selectRow = propGrid.selectPosition.row,
		propRecord = propGrid.getStore().getAt(selectRow),
		propDefineUuid = propRecord.get('defineUuid'),
		factorUuid = propGrid.parentUuid,
		poolStore = Layout.EventSchedule.factorStore,
		factor = poolStore.findRecordByKey("uuid",factorUuid);
    	
    	if(newValue instanceof Date){
    		newValue = Ext.Date.format(newValue, 'Y-m-d');
    	}
    	if(oldValue instanceof Date){
    		oldValue = Ext.Date.format(newValue, 'Y-m-d');
    	}
    	 
    	if(-1 != propRecord.get('uuid').indexOf('newProp-')){
    		//add new property
    		delete propRecord.data.uuid;
    		propRecord.set('value', newValue);
    		Layout.EditFactorPropController.createProp(propRecord);
    	}else{
    		//edit old property value
	    	poolStore.fireEvent('editValue', propRecord.get('uuid'), propDefineUuid, newValue, oldValue, 
					function(uuid, defineUuid, newValue){
						this.get('parent').setProperty(defineUuid, newValue);
					},
					Ext.create('Layout.event.EventContext',{parent:factor})
	    	);
    	}
    }
});