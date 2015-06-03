Ext.define('Layout.controller.EditRelationController', {
    extend: 'Ext.app.Controller',
    stores: [
             "CommonRelationStore"
    ],
    models: [
             "RelationModel"   
    ],

    init: function() {
    	this.control({
        	'#editRelationGrid' : {
        		clickProperty: this.clickProperty,
        		clickFactor : this.clickFactor,
        		clickDelete : this.clickDelete
            }
        });
    },
    
    clickProperty : function(uuid, grid){
    	var poolStore = Layout.EventSchedule.relationStore;
			records = poolStore.getPropertyRecords(uuid);
			
		// add other property
    	var selectedPropMap = {};
    	Ext.Array.each(records, function(record){
    		selectedPropMap[record.get('defineUuid')] = true;
    	});
    	Ext.Array.each(defaultRelationProp, function(defaultProp, i){
    		if(selectedPropMap[defaultProp.defineUuid]){
    			return true;
    		}
    		
    		var record = new Layout.model.CommonFactorModel();  
    		Ext.apply(record.data, defaultProp);
    		record.set('uuid', 'newProp-'+i);   
    		
    		records.push(record);
    	});
	    	
		grid.parentUuid = uuid;
		grid.selModel.selection = null;
		grid.getStore().removeAll();
		grid.getStore().add(records);
		grid.loadEditor.call(grid, records);
		grid.up('tabpanel').setActiveTab(3);
    }
});