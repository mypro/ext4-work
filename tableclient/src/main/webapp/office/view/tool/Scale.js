Ext.define('Layout.view.tool.Scale',{
	extend: 'Ext.panel.Panel',
    alias : 'widget.scaleTool',
    
    layout: 'absolute',
    
    width : 125,
    
    initComponent : function(){
    	var me = this;
    	
    	me.items = [{
            xtype: 'label',
            text: '比例',
            x:5,
            y:8,
            width : 25
    	},{
    	   xtype: 'numberfield',
    	   id : 'scale',
           x:30,
           y:5,
           width: 65,
           value: 100,
           maxValue: 100,
           minValue: 10,
           listeners:{
        	   'change':Layout.TopTool.changeScale
           }
    	},{
            xtype: 'label',
            text: '%',
            x:100,
            y:8
    	},{
		    xtype     :'button',
		    id : 	'layout-whole',
		    text      : '自动全屏',
		    x : 3,
		    y : 30,
		    width : 60,
		    height:23
		},{
		    xtype     :'button',
		    id : 	'layout-back',
		    text      : '<',
		    x : 68,
		    y : 30,
		    width : 25,
		    height:23
		},{
		    xtype     :'button',
		    id : 	'layout-front',
		    text      : '>',
		    x : 97,
		    y : 30,
		    width : 25,
		    height:23
		}];

    	me.callParent(arguments);
    }

});