Ext.define('Layout.view.grid.EditRelationGrid',{
    extend: 'Ext.grid.Panel',
    alias : 'widget.editRelationGrid',
    
    initComponent : function(){
    	var me = this;
    	
    	me.addEvents(
                'clickProperty',
                'clickFactor',
                'clickDelete'
            );
    	
    	var store = new Layout.store.CommonRelationStore({
    		proxy: {
    	        type: 'ajax',
    	        url : '../../../work-platform/loadRelation.do',
    	        reader: {
    	            type: 'json'
    	        }
    	    }
    	});
    	
    	var columns = [
			{
				hideable : false,
				hidden : true,
				dataIndex : 'uuid'
			}, {
				header : '因子一',
				hideable : false,
				hidden : false,
				dataIndex : 'factor1Name',
				filter: {
					type: 'string'
		        },
				width : 80
			}, {
				header : '因子二',
				hideable : false,
				hidden : false,
				dataIndex : 'factor2Name',
				filter: {
					type: 'string'
		        },
				width : 80
			}
    	];
    	
    	Ext.apply(this, { 
    		store : store,
    		columns : columns,
    		features: [{  
                ftype: 'filters',  
                encode: false, 
                local: true
            }]
    	});
        this.callParent(arguments);
    }
});
