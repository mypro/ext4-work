Ext.define('Layout.view.grid.BaseFactorPropGrid',{
	
	extend: 'Layout.view.grid.CommonFactorGrid',
    alias : 'widget.baseFactorPropGrid',
    
    isAutoLoad : false,
    
    initComponent : function(){
    	var me = this;
    	
    	me.store = new Layout.store.CommonFactorStore({
    		proxy: {
    	        type: 'ajax',
    	        url : '../../../work-platform/loadFactorProperty_v2.do?base=true',
    	        reader: {
    	            type: 'json'
    	        }
    	    }
    	});
    	
    	me.addEvents(
                'clickFactor'
            );
    	
    	me.columns = [{
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
    						width : 80
    					}, {
    						header : '属性值',
    						hideable : false,
    						hidden : false,
    						dataIndex : 'value',
    						isEdit : false,
    						width : 105
    					}, {
    						header : '操作',
    						hideable : false,
    						hidden : false,
    						dataIndex : 'uuid',
    						renderer : function(uuid){
    							var factorGridId = 'baseFactorGrid';
    							return '<a class=operator href="javascript:void(Ext.getCmp(\''+this.id+'\').fireEvent(\'clickFactor\',\''+this.factorUuid+'\', Ext.getCmp(\''+factorGridId+'\')))">因子</a>';
    						},
    						width : 165
    					}
    	];
    	
        this.callParent(arguments);
    }
    

});