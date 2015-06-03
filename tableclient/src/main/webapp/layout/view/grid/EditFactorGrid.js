Ext.define('Layout.view.grid.EditFactorGrid',{
	
    extend: 'Layout.view.grid.CommonFactorGrid',
    alias : 'widget.editFactorGrid',
    
    isAutoLoad: false,
    
    initComponent : function(){
    	var me = this;
    	
    	me.store = new Layout.store.CommonFactorStore({
    		proxy: {
    	        type: 'ajax',
    	        url : '../../../work-platform/loadFactor.do',
    	        reader: {
    	            type: 'json'
    	        }
    	    }
    	});
    	
    	me.addEvents(
                'clickProperty',
                'clickRelation',
                'clickDelete'
            );
    	
    	this.columns = [{
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
    		width : 80
    	}, {
    		header : '因子值',
    		hideable : false,
    		hidden : false,
    		dataIndex : 'value',
    		isEdit : true,
    		editorListeners : {
				'complete':Layout.App.getController('EditFactorController')
							.completeEditProp
			},
    		width : 105
    	}, {
    		header : '操作',
    		hideable : false,
    		hidden : false,
    		dataIndex : 'uuid',
    		renderer : function(uuid){
    			var propGridId = 'editFactorPropGrid';
    			var relationGridId = 'editRelationGrid';;
    			var propHrefHtml = '<a class=operator href="javascript:void(Ext.getCmp(\''+this.id+'\').fireEvent(\'clickProperty\',\''+uuid+'\', Ext.getCmp(\''+propGridId+'\')))">属性</a>';
    			var relationHrefHtml = '<a class=operator href="javascript:void(Ext.getCmp(\''+this.id+'\').fireEvent(\'clickRelation\',\''+uuid+'\', Ext.getCmp(\''+relationGridId+'\')))">关系</a>';
    			var deleteHrefHtml = '<a class=operator href="javascript:void(Ext.getCmp(\''+this.id+'\').fireEvent(\'clickDelete\',\''+uuid+'\'))">删除</a>';
    			return propHrefHtml + '&nbsp;&nbsp;' +relationHrefHtml+'&nbsp;&nbsp;' + deleteHrefHtml;
    		},
    		width : 165
    	}];
    	
        this.callParent(arguments);
    }
    

});