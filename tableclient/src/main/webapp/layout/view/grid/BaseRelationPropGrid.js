Ext.define('Layout.view.grid.BaseRelationPropGrid',{
	
    extend: 'EditGrid.view.EditGrid',
    alias : 'widget.baseRelationPropGrid',
    
    isAutoLoad : false,
    
    initComponent : function(){
    	var me = this;
    	
    	me.store = new Layout.store.CommonPropStore({
    		proxy: {
    	        type: 'ajax',
    	        url : '../../../work-platform/loadRelationProperty.do?base=true',
    	        reader: {
    	            type: 'json'
    	        }
    	    }
    	});
    	
    	me.addEvents(
                'clickRelation'
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
    							var relationGridId = 'baseRelationGrid';
    							return '<a class=operator href="javascript:void(Ext.getCmp(\''+this.id+'\').fireEvent(\'clickRelation\',\''+this.relationUuid+'\', Ext.getCmp(\''+relationGridId+'\')))">关系</a>';
    						},
    						width : 165
    					}
    	];
    	
        this.callParent(arguments);
    }
    

});