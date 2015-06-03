Ext.define('Layout.controller.EditRelationController', {
    extend: 'Ext.app.Controller',
    stores: [
             "CommonRelationStore"
    ],
    models: [
             "RelationModel"   
    ],
    view: [
    ],
    
    refs : [{
    	selector : '#factor-tab',
    	ref: 'factorTab'
    }],

    init: function() {
    	this.control({
        	'#editRelationGrid' : {
        		clickProperty: this.clickProperty,
        		clickFactor : this.clickFactor,
        		clickDelete : this.clickDelete
            }
        });
    },
    
    clickDelete : function(uuid){
    	var poolStore = Layout.App.getController('PoolFactorController').relationStore;
    	var record = poolStore.findRecordByKey('uuid', uuid);
    	poolStore.remove(record);
    },
    
    clickFactor : function(factor1uuid, factor2uuid, grid){
    	$('#'+grid.id+' .x-grid-row-selected').removeClass('x-grid-row-selected');
    	$('#'+grid.id+' tr[data-recordid='+factor1uuid+']').addClass('x-grid-row-selected');
    	$('#'+grid.id+' tr[data-recordid='+factor2uuid+']').addClass('x-grid-row-selected');
    	
    	grid.up('tabpanel').setActiveTab(0);
    },
    
    clickProperty : function(uuid, grid){
    	grid.relationUuid = uuid;
    	grid.getStore().load({
    		scope: grid,
    		callback: grid.loadEditor,
    	    params: {
    	    	condition : Ext.encode({
					parentUuid : uuid
				})
    	    }
    	});
    	grid.up('tabpanel').setActiveTab(3);
    }
});