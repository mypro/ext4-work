Ext.define('Layout.view.grid.BaseFactorGrid',{
	
    extend: 'Layout.view.grid.CommonFactorGrid',
    alias : 'widget.baseFactorGrid',
    
    isAutoLoad: true,
    
    canDrag : true,
    
    afterDragDrop : function(){
    	Layout.App.getController('DrawController').dragFactorFromBase.apply(this, arguments);
    },
    
    initComponent : function(){
    	var me = this;
    	
    	me.store = new Layout.store.CommonFactorStore({
    		proxy: {
    	        type: 'ajax',
    	        url : '../../../work-platform/loadFactor.do?base=true',
    	        reader: {
    	            type: 'json'
    	        }
    	    }
    	});
    	
    	me.addEvents(
                'clickProperty',
                'clickRelation'
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
    		isEdit : false,
    		width : 105
    	}, {
    		header : '操作',
    		hideable : false,
    		hidden : false,
    		dataIndex : 'uuid',
    		renderer : function(uuid){
    			var propGridId = 'baseFactorPropGrid';
    			var relationGridId = 'baseRelationGrid';;
    			var propHrefHtml = '<a class=operator href="javascript:void(Ext.getCmp(\''+this.id+'\').fireEvent(\'clickProperty\',\''+uuid+'\', Ext.getCmp(\''+propGridId+'\')))">属性</a>';
    			var relationHrefHtml = '<a class=operator href="javascript:void(Ext.getCmp(\''+this.id+'\').fireEvent(\'clickRelation\',\''+uuid+'\', Ext.getCmp(\''+relationGridId+'\')))">关系</a>';
    			return propHrefHtml + '&nbsp;&nbsp;' +relationHrefHtml;
    		},
    		width : 165
    	}];
    	
        this.callParent(arguments);
    }
    

});