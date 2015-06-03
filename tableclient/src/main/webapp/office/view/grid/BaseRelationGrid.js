Ext.define('Layout.view.grid.BaseRelationGrid',{
    extend: 'Ext.grid.Panel',
    alias : 'widget.baseRelationGrid',
    mixins :['Layout.view.grid.CommonFactorGrid'],
    
    canDrag : true,
    
    dragTarget : 'factorDDTarget',
    
    afterDragDrop : function(){
    	Layout.BaseRelationController.dragRelationFromBase.apply(this, arguments);
    },
    
    initComponent : function(){
    	
    	var store = new Layout.store.CommonRelationStore({
    		autoLoad : true,
    		proxy: {
    	        type: 'ajax',
    	        url : '../../../work-platform/loadRelation.do?base=true',
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
