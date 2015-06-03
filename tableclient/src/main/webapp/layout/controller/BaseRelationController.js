Ext.define('Layout.controller.BaseRelationController', {
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
        	'#baseRelationGrid' : {
        		clickProperty: this.clickProperty,
        		clickFactor : this.clickFactor
            }
        });
    },
    
    clickFactor: function(factor1uuid, factor2uuid, grid){
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
    	this.getFactorTab().setActiveTab(3);
    }
});