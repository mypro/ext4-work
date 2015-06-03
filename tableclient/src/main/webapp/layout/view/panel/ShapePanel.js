Ext.define('Layout.view.panel.ShapePanel',{
	extend: 'Ext.panel.Panel',
    alias : 'widget.shapePanel',
    
    layout : 'column',
    
    border : true,
    
    initComponent : function(){
    	var me = this;
    	
    	this.items = [
    	              Ext.create('Ext.draw.Component', {
    	          	    viewBox: false,
    	          	    id : 'circle-template',
    	          	    items: [{
    	          	        type: 'circle',
    	          	        fill: '#f00',
    	          	        radius: 20,
    	          	        x: 30,
    	          	        y: 30
    	          	    }]
    	          	}),Ext.create('Ext.draw.Component', {
    	          	    viewBox: false,
    	          	    id : 'rect-template',
    	          	    items: [{
    	          	        type: 'rect',
    	          	        width: 40,
    	          	        height: 40,
    	          	        fill: '#f00',
    	          	        x: 20,
    	          	        y: 10
    	          	    }]
    	          	}) ];
    	
    	me.callParent(arguments);
    }
});