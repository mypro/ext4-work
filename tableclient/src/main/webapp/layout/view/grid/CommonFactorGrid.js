Ext.define('Layout.view.grid.CommonFactorGrid',{
	
    extend: 'EditGrid.view.EditGrid',
    
    canDrag: false,
    
    loadCallback : function(records, operation, success){
    	var me = this;
    	
    	if(me.canDrag){
    		Ext.Array.each(records, function(record){
        		var td = Ext.select('#'+me.id+' tr[data-recordid="'+record.get('uuid')+'"] td').elements[0];
        		new Ext.dd.DragSource(td.id,{
        			group:'factorDDTarget', 
        			grid:me
        		}).afterDragDrop = me.afterDragDrop;
            		
        	});
    	}
    	
//    	Ext.Array.each(records, function(record){
//    		var td = Ext.select('#'+me.id+' tr[data-recordid="'+record.get('uuid')+'"] td').elements[0];
//    		new Ext.dd.DragSource(td.id,{
//    			group:'factorDDTarget', 
//    			grid:me
//    		}).afterDragDrop = Layout.App.getController('DrawController').dragFactorFromBase;
//        		
//    	});
    },
    
    initComponent : function(){
    	
    	this.callParent(arguments);
    }
});