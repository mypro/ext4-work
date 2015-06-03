Ext.define('Layout.controller.BaseFactorController', {
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
    
    refs : [{  
        selector: '#baseFactorPropGrid',  
        ref: 'baseFactorPropGrid'  
    },{
    	selector : '#factor-tab',
    	ref: 'factorTab'
    },{
    	selector : '#relationGrid',
    	ref: 'relationGrid'
    },{
    	selector : '#drawPanel',
    	ref: 'drawPanel'
    }],

    init: function() {
    	this.control({
        	'#baseFactorGrid' : {
        		clickProperty : this.clickProperty,
        		clickRelation : this.clickRelation
            }
        });
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
    	this.getFactorTab().setActiveTab(1);
    },
    
    clickRelation : function(uuid, grid){
    	grid.getStore().load({
    		scope: grid,
    		callback: function(records, operation, success){
    			// init relation drag event
    			var grid = this;
    			
    			if(grid.loadCallback){
    				grid.loadCallback.apply(this, arguments);
    			}
    		},
			params:{
				condition : Ext.encode({
					factorUuid : uuid
				})
			}
		});
    	this.getFactorTab().setActiveTab(2);
    }
});