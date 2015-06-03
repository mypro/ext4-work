Ext.define('Layout.controller.EditRelationPropController', {
    extend: 'Ext.app.Controller',
    stores: [
             "CommonPropStore"
    ],
    models: [
             "CommonFactorModel"   
    ],
    view: [
    ],
    
//    refs : [{  
//        selector: '#factorPropEditGrid',  
//        ref: 'factorPropEditGrid'  
//    }],

    init: function() {
    	this.control({
        	'#editRelationPropGrid' : {
        		clickRelation: this.clickRelation
            }
        });
    },
    
    clickRelation : function(uuid, grid){
    	$('#'+grid.id+' .x-grid-row-selected').removeClass('x-grid-row-selected');
    	$('#'+grid.id+' tr[data-recordid='+uuid+']').addClass('x-grid-row-selected');
    	
    	grid.up('tabpanel').setActiveTab(2);
    },
    
    completeEditProp : function(editor, newValue, oldValue){
    	var propGrid = Ext.getCmp('editRelationPropGrid');
    	var selectRow = propGrid.selectPosition.row;
    	var propRecord = propGrid.getStore().getAt(selectRow);
    	var propDefineUuid = propRecord.get('defineUuid');
    	var relationUuid = propGrid.relationUuid;
    	
    	var poolStore = Layout.App.getController('PoolFactorController').relationStore;
    	var relation = poolStore.findRecordByKey("uuid",relationUuid);
    	
    	var prop = relation.setProperty(propDefineUuid,newValue);
    	poolStore.fireEvent('editProperty', prop, oldValue, relation, "editGridCallback");
    }
});