Ext.define('Layout.view.grid.EditFactorGrid',{
    extend: 'EditGrid.view.EditGrid',
    alias : 'widget.editFactorGrid',
    
    isAutoLoad: false,
    
    initComponent : function(){
    	var me = this;
    	
    	me.addEvents(
                'clickProperty',
                'clickRelation',
                'clickDelete'
            );
    	
    	var store = new Layout.store.CommonFactorStore({
    		proxy: {
    	        type: 'ajax',
    	        url : '../../../work-platform/loadFactor.do',
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
    		isEdit : true,
    		editorListeners : {
    			'startedit' : Layout.EditFactorController
							.beginEdit,
				'complete':Layout.EditFactorController
							.completeEditProp
			},
    		width : 80
    	}
    	];
    	
    	Ext.apply(me, { 
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