Ext.define('Layout.view.tool.ColorSize',{
	extend: 'Ext.panel.Panel',
    alias : 'widget.colorSizeTool',
    
    layout: 'absolute',
    width: 100,
    
    initComponent : function(){
    	var me = this;
    	
    	var items = [{
		            xtype: 'label',
		            text: '尺寸',
		            x:3,
		            y:8,
		            anchor: '50%',
		            margin: '0 0 0 10'
		       },
		       {
		    	   xtype: 'numberfield',
		    	   id : 'size',
		           x:45,
		           y:5,
		           width: 45,
		           value: 30,
		           maxValue: 999,
		           minValue: 1,
		           listeners:{
//		        	   'blur':Layout.TopTool.changeSize,
		        	   'change':Layout.TopTool.changeSize
		           }
		       },
//		       {
//		            xtype: 'label',
//		            x:3,
//		            y:29,
//		            id: 'color-plate',
//		            height: 20,
//		            width: 30,
//		            margin: '0 0 0 10'
//		       },
		       {
		    	    xtype     :'button',
		    	   	text      :'<span style="font-size:12px;">字体</span>',
		    	   	id        :'font-color',
		    	    arrowAlign: 'right',
		    	    x : 3,
		    	    y : 28,
		    	    width : 45,
		    	    menu : Ext.create('Ext.menu.ColorPicker', {
					    value: '000000',
					    listeners:{
			        	   'select':Layout.TopTool.changeTextColor
			           }
		    		})
		       },
		       {
		    	    xtype     :'button',
		    	   	text      :'<span style="font-size:12px;">图形</span>',
		    	   	id        :'graph-color',
		    	    arrowAlign: 'right',
		    	    x : 45,
		    	    y : 28,
		    	    width : 45,
		    	    menu : Ext.create('Ext.menu.ColorPicker', {
					    value: '000000',
					    listeners:{
			        	   'select':Layout.TopTool.changeColor
			           }
		    		})
		    	}
		];
    	
    	Ext.apply(me,{
    		items : items
    	});
    	me.callParent(arguments);
    }
    
});