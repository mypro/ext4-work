Ext.define('Layout.view.grid.EditFactorPropGrid',{
	
	extend: 'Layout.view.grid.CommonFactorGrid',
    alias : 'widget.editFactorPropGrid',
    
    isAutoLoad : false,
    
    initComponent : function(){
    	var me = this;
    	
    	me.store = new Layout.store.CommonPropStore({
    	    proxy: {
	          type: 'ajax',
	          url : '../../../work-platform/loadFactorProperty_v2.do',
	          reader: {
	              type: 'json'
	          }
	      }
    	});
    	
    	me.addEvents(
                'clickFactor',
                'clickDelete'
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
    						isEdit : true,
    						editorListeners : {
    							'complete':Layout.App.getController('EditFactorPropController')
    										.completeEditProp
    						},
    						width : 105
    					}, {
    						header : '操作',
    						hideable : false,
    						hidden : false,
    						dataIndex : 'uuid',
    						renderer : function(uuid, dom, record){
    							var factorGridId = 'editFactorGrid';
    							var factorHrefHtml = '<a class=operator href="javascript:void(Ext.getCmp(\''+this.id+'\').fireEvent(\'clickFactor\',\''+this.factorUuid+'\', Ext.getCmp(\''+factorGridId+'\')))">因子</a>';
    							var deleteHrefHtml = '<a class=operator href="javascript:void(Ext.getCmp(\''+this.id+'\').fireEvent(\'clickDelete\',\''+this.factorUuid+'\', \''+uuid+'\'))">删除</a>';
    							return factorHrefHtml + 
    								(('1'!==record.get('prototype') && '2'!==record.get('prototype'))?('&nbsp;&nbsp;' + deleteHrefHtml):'')
    											;
    						},
    						width : 165
    					}
    	];
    	
        this.callParent(arguments);
    }
    

});