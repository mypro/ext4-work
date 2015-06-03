Ext.define('VariableGrid.controller.VariableController', {
    extend: 'Ext.app.Controller',
    stores: [
             "VariableGridStore"
    ],
    models: [
             "VariableModel"   
    ],
    views: [
            'VariableView'
    ],
    init: function() {
        this.control({
        	'variableView' : {
        		select : this.selectRow,
        		selectionchange:this.selectionchange,
        		beforeedit:this.beforeedit,
        		afterlayout:this.afterlayout,
        		containerclick:this.containerclick
            }
        });
        this.selectedRowIndex = -1;
    },
    containerclick:function(grid,e,eOpts){
    	var win = Ext.getCmp(VARIABLE_GRID_ID);
    	win.callback.containerclick.call(grid, grid);
    },
    afterlayout:function(){
    	var win = Ext.getCmp(VARIABLE_GRID_ID);
    	win.callback.afterlayout.call(grid);;
    },
    beforeedit:function(editor,e,eOpts ){
    	var decimalColumn=e.column;
    	if('decimalWidth'===decimalColumn.dataIndex){
	    	var selectRecord = e.record;
	    	if(undefined==selectRecord) return;
	    	var type=selectRecord.get('type');
	    	if(decimalColumn){
	    		//selectRecord.set("decimalWidth", 0);
	    		if(COLUMNTYPE_DECIMAL===type
	    				||COLUMNTYPE_POINT===type
	    				||COLUMNTYPE_COMMA===type
	    				||COLUMNTYPE_CURRENCY===type
	    				||COLUMNTYPE_DOLLAR===type
	    				||COLUMNTYPE_SCIENTIFIC===type
	    				||COLUMNTYPE_LIMIT===type){
	    			var editor = {
	    					xtype : 'numberfield',
	    					minValue : 1,
	    					maxValue : 150000
	    				};
	    			
	    			decimalColumn.setEditor(editor);
	    		}else {
	    			var editor = {
	    					xtype : 'numberfield',
	    					minValue : 1,
	    					maxValue : 150000,
	    					disabled:true
	    				};
	    			selectRecord.set("decimalWidth", 0);
	    			decimalColumn.setEditor(editor);
	    		}
	    	}
    	}
    },
    selectionchange:function(selectedModel,selected,eOpts ){
    },
    selectRow : function(selectionModel, record,index,eOpts){
    	
    }
    
});

