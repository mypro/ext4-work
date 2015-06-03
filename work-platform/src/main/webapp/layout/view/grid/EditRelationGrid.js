Ext.define('Layout.view.grid.EditRelationGrid',{
    extend: 'Ext.grid.Panel',
    alias : 'widget.editRelationGrid',
    
    initComponent : function(){
    	var me = this;
    	
    	me.store = new Layout.store.CommonRelationStore({
    		proxy: {
    	        type: 'ajax',
    	        url : '../../../work-platform/loadRelation.do',
    	        reader: {
    	            type: 'json'
    	        }
    	    }
    	});
    	
    	me.addEvents(
                'clickProperty',
                'clickFactor',
                'clickDelete'
            );
    	
    	me.columns = [
			{
				hideable : false,
				hidden : true,
				dataIndex : 'uuid'
			}, {
				header : '因子一',
				hideable : false,
				hidden : false,
				dataIndex : 'factor1Uuid',
				renderer : function(dataIndex, combo, record){
					return record.get("factor1Name");
				},
				width : 80
			}, {
				header : '因子二',
				hideable : false,
				hidden : false,
				dataIndex : 'factor2Uuid',
				renderer : function(dataIndex, combo, record){
					return record.get("factor2Name");
				},
				width : 80
			}, {
				header : '操作',
				hideable : false,
				hidden : false,
				dataIndex : 'uuid',
				renderer : function(uuid){
					console.log(arguments);
					var factorGridId = 'editFactorGrid';
					var propGridId = 'editRelationPropGrid';
					var relationGridId = 'editRelationGrid';
					var propHrefHtml = '<a class=operator href="javascript:void(Ext.getCmp(\''+this.id+'\').fireEvent(\'clickProperty\',\''+uuid+'\', Ext.getCmp(\''+propGridId+'\')))">属性</a>';
					var factorHrefHtml = '<a class=operator href="javascript:void(Ext.getCmp(\''+this.id+'\').fireEvent(\'clickFactor\',\''+arguments[2].get('factor1Uuid')+'\',\''+arguments[2].get('factor2Uuid')+'\', Ext.getCmp(\''+factorGridId+'\')))">因子</a>';
					var allFactorHrefHtml = '<a class=operator href="javascript:void(Ext.getCmp(\''+this.id+'\').fireEvent(\'clickRelation\',\''+uuid+'\', Ext.getCmp(\''+relationGridId+'\')))">全部因子</a>';
					var deleteHrefHtml = '<a class=operator href="javascript:void(Ext.getCmp(\''+this.id+'\').fireEvent(\'clickDelete\',\''+uuid+'\'))">删除</a>';
					return propHrefHtml + '&nbsp;&nbsp;' + factorHrefHtml + '&nbsp;&nbsp;' + allFactorHrefHtml + '&nbsp;&nbsp;' + deleteHrefHtml;
				},
				width : 190
			}
    	];
    	
        this.callParent(arguments);
    }
});
