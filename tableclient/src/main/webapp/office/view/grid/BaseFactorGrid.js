Ext.define('Layout.view.grid.BaseFactorGrid',{
	
    extend: 'Ext.grid.Panel',
    alias : 'widget.baseFactorGrid',
    mixins :['Layout.view.grid.CommonFactorGrid'],
    
    canDrag : true,
    
    dragTarget : 'factorDDTarget',
    
    afterDragDrop : function(){
    	Layout.BaseFactorController.dragFactorFromBase.apply(this, arguments);
    },
    
    initComponent : function(){
    	
    	var store = new Layout.store.CommonFactorStore({
    		autoLoad: true,
    		proxy: {
    	        type: 'ajax',
    	        url : '../../../work-platform/loadFactor.do?base=true',
    	        reader: {
    	            type: 'json'
    	        }
    	    }
    	});
    	
    	var columns = [{
    		hideable : false,
    		hidden : true,
    		dataIndex : 'uuid'
    	}, {
    		header : '因子名',
    		hideable : false,
    		hidden : false,
    		dataIndex : 'name',
    		tdCls: this.nameColumnCls,
            innerCls: this.nameColumnInnerCls,
            filter: {
                type: 'string'
            },
    		width : 80
    	}, {
    		header : '因子值',
    		hideable : false,
    		hidden : false,
    		dataIndex : 'value',
    		width : 80
    	}
//    	, {
//    		header : '',
//    		hideable : false,
//    		hidden : false,
//    		dataIndex : 'uuid',
//    		renderer : function(uuid){
//    		},
//    		width : 30
//    	}
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