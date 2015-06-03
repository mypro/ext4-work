Ext.define('Layout.view.grid.CommonFactorGrid',{
    
    initDrag : function(isRow){
    	var me = this;
    	if(!me.canDrag){
    		return;
    	}
    	new Ext.util.DelayedTask(function(){  
    		var records = me.getStore().data.items;
    		Ext.Array.each(records, function(record){
    			var dom = Ext.select(('#'+me.id+' tr[data-recordid="'+record.get('uuid')+'"]')+(isRow?'':' td')).elements[0];
    			new Ext.dd.DragSource(dom.id,{
    				group: me.dragTarget, 
    				grid: me
    			}).afterDragDrop = me.afterDragDrop;
    		});
    		
    	}).delay(1000);  
    	
    },
    
    initRowSelect : function(){
    	var me = this;
    	
    	me.addListener('itemclick', function(grid, record, dom, index){
    		Layout.Select.cancelSelect();
        	$('#'+grid.id+' tr[data-recordindex='+index+']').addClass('x-grid-row-selected');
    	});
    },
    
    getSelectRecord : function(){
    	var row = this.getSelectRow();
    	
    	if(isNaN(row)){
    		return null;
    	}
    	
    	return [{
    		record : this.getStore().getAt(row),
    		type : this.getSelectType()
    	}];
    },
    
    cancelSelect : function(){
    	$('#'+this.id+' .x-grid-row-selected').removeClass('x-grid-row-selected');
    },
    
    getSelectRow : function(){
    	var $selectRow = $('#'+this.id+' .x-grid-row-selected');
    	if($selectRow.length>0){
    		return $selectRow.index();
    	}
    	return NaN;
    }
});