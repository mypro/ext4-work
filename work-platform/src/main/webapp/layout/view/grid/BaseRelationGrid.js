Ext.define('Layout.view.grid.BaseRelationGrid',{
    extend: 'Ext.grid.Panel',
    alias : 'widget.baseRelationGrid',
    
    canDrag : true,
    
    afterDragDrop : function(){
    	Layout.App.getController('DrawController').dragRelationFromBase.apply(this, arguments);
    },
    
    loadCallback : function(records, operation, success){
    	var me = this;
    	
    	if(me.canDrag){
	    	Ext.Array.each(records, function(record){
	    		var td = Ext.select('#'+me.id+' tr[data-recordid="'+record.get('uuid')+'"]').elements[0];
	    		new Ext.dd.DragSource(td.id,{
	    			group:'factorDDTarget', 
	    			grid:me
	    		}).afterDragDrop = me.afterDragDrop;
	        		
	    	});
    	}
    },
    
    initComponent : function(){
    	var me = this;
    	
    	me.store = new Layout.store.CommonRelationStore({
    		proxy: {
    	        type: 'ajax',
    	        url : '../../../work-platform/loadRelation.do?base=true',
    	        reader: {
    	            type: 'json'
    	        }
    	    }
    	});
    	
    	me.addEvents(
                'clickProperty',
                'clickFactor'
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
					var factorGridId = 'baseFactorGrid';
					var propGridId = 'baseRelationPropGrid';
					var relationGridId = 'baseRelationGrid';
					var propHrefHtml = '<a class=operator href="javascript:void(Ext.getCmp(\''+this.id+'\').fireEvent(\'clickProperty\',\''+uuid+'\', Ext.getCmp(\''+propGridId+'\')))">属性</a>';
					var factorHrefHtml = '<a class=operator href="javascript:void(Ext.getCmp(\''+this.id+'\').fireEvent(\'clickFactor\',\''+arguments[2].get('factor1Uuid')+'\',\''+arguments[2].get('factor2Uuid')+'\', Ext.getCmp(\''+factorGridId+'\')))">因子</a>';
					var allFactorHrefHtml = '<a class=operator href="javascript:void(Ext.getCmp(\''+this.id+'\').fireEvent(\'clickRelation\',\''+uuid+'\', Ext.getCmp(\''+relationGridId+'\')))">全部因子</a>';
					return propHrefHtml + '&nbsp;&nbsp;' + factorHrefHtml + '&nbsp;&nbsp;' + allFactorHrefHtml;
				},
				width : 170
			}
    	];
    	
        this.callParent(arguments);
    }
});
