Ext.define('Layout.controller.EditRelationPropController', {
    extend: 'Ext.app.Controller',
    stores: [
             "CommonPropStore"
    ],
    models: [
             "CommonFactorModel"   
    ],
    
    init: function() {
    	this.control({
        	'#editRelationPropGrid' : {
        		containerdblclick : this.addProp,
        		cellclick : this.cellclick
            }
        });
    },
    
    cellclick: function(cell, td, cellIndex,record, tr){
    	if(0 == cellIndex){
    		this.selectProp(tr, record);
    	}
    },
    
    selectProp : function(dom,record, item, index){
    	var parentUuid = Ext.getCmp('editRelationPropGrid').parentUuid,
    		parent = Layout.EventSchedule.relationStore
    				.findRecordByKey('uuid', parentUuid),
    		propertyRec = new Layout.model.CommonFactorModel(),
    		propData = parent.getProperty(record.get('defineUuid')),
    		factorPanel = Ext.getCmp('factorPanel');
    	
    	Ext.apply(propertyRec.data, propData);
    	
    	factorPanel.isEditProperty = true;
		factorPanel.fireEvent('initForm', propertyRec, parentUuid, RELATIONTYPE_RELATION_PROP, true);
    },
    
    addProp : function(){
    	this.createProp(Layout.DefaultDefine.createProp());
    },
    
    createProp : function(propertyRec){
    	var grid = Ext.getCmp('editRelationPropGrid'),
			relationUuid = grid.parentUuid,
			ES = Layout.EventSchedule;
		
		var fn = function(relationUuid, relationType, propertyRec){
			var relation = ES.relationStore.findRecordByKey('uuid', relationUuid);
			relation.addProperty(propertyRec.data);
		};
		
		ES.fireEvent(ES.relationStore, 'addProperty', relationUuid, RELATIONTYPE_RELATION_PROP,
												    propertyRec, grid, fn);
    },
    
//    clickRelation : function(uuid, grid){
//    	$('#'+grid.id+' .x-grid-row-selected').removeClass('x-grid-row-selected');
//    	$('#'+grid.id+' tr[data-recordid='+uuid+']').addClass('x-grid-row-selected');
//    	
//    	grid.up('tabpanel').setActiveTab(2);
//    },
    
    beginEdit : function(editor){
    	var grid = Ext.getCmp('editRelationPropGrid');
    	
    	editor.uuid = grid.parentUuid;
    },
    
    completeEditProp : function(editor, newValue, oldValue){
    	var propGrid = Ext.getCmp('editRelationPropGrid'),
    		selectRow,
    		propRecord,
    		propDefineUuid,
    		relationUuid,
    		poolStore,
    		relation;
    	
    	// because of grid refresh, cause that inconformity
		if(editor.uuid !== propGrid.parentUuid){
			return;
		}
		
		selectRow = propGrid.selectPosition.row;
		propRecord = propGrid.getStore().getAt(selectRow);
		propDefineUuid = propRecord.get('defineUuid');
		relationUuid = propGrid.parentUuid;
		poolStore = Layout.EventSchedule.relationStore;
		relation = poolStore.findRecordByKey("uuid",relationUuid);
		
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
    		Layout.EditRelationPropController.createProp(propRecord);
    	}else{
    		//edit old property value
    		
    		poolStore.fireEvent('editValue', propRecord.get('uuid'), propDefineUuid, newValue, oldValue, 
    				function(uuid, defineUuid, newValue){
    					this.get('parent').setProperty(defineUuid, newValue);
    				},
    				Ext.create('Layout.event.EventContext',{parent:relation})
        	);
    	}
    	
    	
    	
    }
});