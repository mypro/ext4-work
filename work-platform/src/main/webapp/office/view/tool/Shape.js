Ext.define('Layout.view.tool.Shape',{
	extend: 'Ext.panel.Panel',
    alias : 'widget.shapeTool',
    
    layout: 'absolute',
    width: 400,
    
    listeners : {
    	'afterrender' : function(){
    		
    		new Ext.dd.DragSource('circle-template',{
    			group:'factorDDTarget' ,
    			value:'1'
    		}).afterDragDrop = Layout.ShapeController.drapFactorFromShape;
    		
    		new Ext.dd.DragSource('square-template',{
    			group:'factorDDTarget' ,
    			value:'2'
    		}).afterDragDrop = Layout.ShapeController.drapFactorFromShape;
    		
    		new Ext.dd.DragSource('diamond-template',{
    			group:'factorDDTarget' ,
    			value:'3'
    		}).afterDragDrop = Layout.ShapeController.drapFactorFromShape;
    		
    		new Ext.dd.DragSource('triangle-template',{
    			group:'factorDDTarget' ,
    			value:'4'
    		}).afterDragDrop = Layout.ShapeController.drapFactorFromShape;
    		
    		new Ext.dd.DragSource('ellipse-template',{
    			group:'factorDDTarget' ,
    			value:'5'
    		}).afterDragDrop = Layout.ShapeController.drapFactorFromShape;
    		
    		new Ext.dd.DragSource('rectangle-template',{
    			group:'factorDDTarget' ,
    			value:'6'
    		}).afterDragDrop = Layout.ShapeController.drapFactorFromShape;
    	}
    },
    
    initComponent : function(){
    	var me = this;
    	
    	var items = [{
       		xtype: 'label',
		    text: '因子区域',
		    width:30,
		    style:{
		    	'font-weight':'bold'
		    },
		    x:10,
		    y:10
       	},{
            xtype: 'label',
            text: 'x轴',
            width:20,
            x:250,
            y:8,
       },{
    	   xtype: 'numberfield',
    	   id : 'axe-x',
           x:270,
           y:5,
           width: 55,
           value: 30,
           maxValue: 3999,
           minValue: 1,
           listeners:{
        	   'change':Layout.TopTool.changeX
           }
       },{
           xtype: 'label',
           text: 'y轴',
           width:20,
           x:250,
           y:28,
      },{
   	   xtype: 'numberfield',
   	   id : 'axe-y',
          x:270,
          y:28,
          width: 55,
          value: 30,
          maxValue: 3999,
          minValue: 1,
          listeners:{
        	  'change':Layout.TopTool.changeY
          }
      },{
		    xtype: 'button',
		    id:'showValue',
		    text: '显示值',
		    x:335,
		    y:8,
		    width:55,
		    height:20,
		    margin: '0 0 0 0',
		    listeners:{
		    	'click' : Layout.TopTool.showValue
		    }
      },{
		    xtype: 'button',
		    id:'showProperty',
		    text: '属性',
		    x:335,
		    y:28,
		    width:35,
		    height:20,
		    margin: '0 0 0 0',
		    listeners:{
		    	'click' : Layout.TopTool.showProperty
		    }
      },{
		    xtype: 'button',
		    id:'showPropertyValue',
		    text: '值',
		    x:370,
		    y:28,
		    width:20,
		    height:20,
		    margin: '0 0 0 0',
		    listeners:{
		    	'click' : Layout.TopTool.showPropertyValue
		    }
      },{
    		xtype : 'panel',
    		border : false,
    		layout: 'absolute',
    		autoScroll : true,
    		id : 'shapeGroup',
    		width:190,
    		height:60,
    		x:53,
    	    y:0,
    		items: [
			{
			    xtype: 'button',
			    id:'circle-template',
			    text: '圆',
			    value : '1',
			    x:3,
			    y:8,
			    width:30,
			    height:30,
			    margin: '0 0 0 0',
			    listeners:{
			    	'click' : Layout.TopTool.changeShape
			    }
			} ,
			{
			    xtype: 'button',
			    text: '方',
			    value : '2',
			    id:'square-template',
			    x:33,
			    y:8,
			    width:30,
			    height:30,
			    margin: '0 0 0 0',
			    listeners:{
			    	'click' : Layout.TopTool.changeShape
			    }
			},
			{
			    xtype: 'button',
			    text: '菱',
			    value : '3',
			    id:'diamond-template',
			    x:63,
			    y:8,
			    width:30,
			    height:30,
			    margin: '0 0 0 0',
			    listeners:{
			    	'click' : Layout.TopTool.changeShape
			    }
			} ,
			{
			    xtype: 'button',
			    text: '三',
			    value : '4',
			    id:'triangle-template',
			    x:93,
			    y:8,
			    width:30,
			    height:30,
			    margin: '0 0 0 0',
			    listeners:{
			    	'click' : Layout.TopTool.changeShape
			    }
			},
			{
			    xtype: 'button',
			    text: '椭',
			    value : '5',
			    id:'ellipse-template',
			    x:123,
			    y:8,
			    width:30,
			    height:30,
			    margin: '0 0 0 0',
			    listeners:{
			    	'click' : Layout.TopTool.changeShape
			    }
			},{
			    xtype: 'button',
			    text: '长',
			    value : '6',
			    id:'rectangle-template',
			    x:153,
			    y:8,
			    width:30,
			    height:30,
			    margin: '0 0 0 0',
			    listeners:{
			    	'click' : Layout.TopTool.changeShape
			    }
			}],
    	}];
    	
    	Ext.apply(me,{
    		items : items
    	});
    	me.callParent(arguments);
    }
});