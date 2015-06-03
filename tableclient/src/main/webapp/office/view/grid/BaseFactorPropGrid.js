Ext.define('Layout.view.grid.BaseFactorPropGrid',{
	
    extend: 'Ext.grid.Panel',
    alias : 'widget.baseFactorPropGrid',
    mixins :['Layout.view.grid.CommonFactorGrid'],
    
    initComponent : function(){
    	
    	var store = new Layout.store.CommonFactorStore({
    		autoLoad: true,
    		proxy: {
    	        type: 'ajax',
    	        url : '../../../work-platform/loadFactorDefine.do?base=true&condition={prototype:0,createLevel:2}',
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
    		header : '属性名',
    		hideable : false,
    		hidden : false,
    		dataIndex : 'name',
    		tdCls: this.nameColumnCls,
            innerCls: this.nameColumnInnerCls,
            filter: {
                type: 'string'
            },
    		width : 160
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
    },
    
    getSelectType : function(){
    	return Layout.Select.TYPE_FACTOR_PROP;
    }
    

});