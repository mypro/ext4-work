Ext.require([
             'Ext.QuickTips',
             'Ext.grid.*',
             'Ext.menu.ColorPicker',
             'component.editgrid.EditGrid',
             'component.factordefine.Window'
             ]);

var RELATIONTYPE_FACTOR = 0;
var RELATIONTYPE_FACTOR_PROP = 1;
var RELATIONTYPE_RELATION_PROP = 2;

var FACTORDEFINE_FACTOR_COLOR = '8969027ac08b436ba369f4d65d29cb40';
var FACTORDEFINE_FACTOR_SIZE = 'f726b3b3529a4ba3b0cc4de1e455d762';
var FACTORDEFINE_FACTOR_SHAPE = 'aff485401768412ebf96f0acb2814414';
var FACTORDEFINE_FACTOR_X = '12a37a11e78245e0803d2c98b39d16e7';
var FACTORDEFINE_FACTOR_Y = '5d90ea940c45494da7fa8ee756c5865a';
var FACTORDEFINE_RELATION_COLOR = '7793b4cc624d4e86b398087498aea631';
var FACTORDEFINE_RELATION_SHAPE = 'b407ad1e2be346a182dc626dadafafec';

var getSvgcls = function(value){
	switch(value){
	case 1:
		return joint.shapes.basic.Circle;
	case 2:
		return joint.shapes.basic.Rect;
	default:
		break;
	}
	
	return joint.shapes.basic.Circle;
};

var getSvgShape = function(value){
	switch(value){
	case 1:
		return 'circle';
	case 2:
		return 'rect';
	default:
		break;
	}
	
	return 'circle';
};

var isShiftActive = function(){
	console.log(window.currentKey);
	return window.currentKey && (16==window.currentKey
			|| 17==window.currentKey || 18==window.currentKey);
};

Ext.onReady(function(){
	
	document.onkeydown=function(e){
		var e = e ||event;
		var currKey=e.keyCode||e.which||e.charCode;
		window.currentKey = currKey;
	};
	document.onkeyup=function(e){
		delete window.currentKey;
	};
	
	// common init
	Ext.QuickTips.init();
	Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));
	
	// main
	Ext.application({
		name : 'Layout',
		appFolder : 'layout',
		controllers : [ 
		          'BaseFactorController',
		          'BaseFactorPropController',
		          'BaseRelationController',
		          'BaseRelationPropController',
		          'DrawController',
		          'PoolFactorController',
		          'ShapeController',
		          'EditFactorController',
		          'EditFactorPropController',
		          'EditRelationController',
		          'EditRelationPropController',
		          'FactorOperator'
		],
		views : [ 
		         'grid.CommonFactorGrid',
		         'grid.BaseFactorGrid',
		         'grid.BaseFactorPropGrid',
		         'grid.BaseRelationGrid',
		         'grid.BaseRelationPropGrid',
		         'panel.DrawPanel',
		         'panel.ShapePanel',
		         'panel.ChartPanel',
		         'grid.EditFactorGrid',
		         'grid.EditFactorPropGrid',
		         'grid.EditRelationGrid',
		         'grid.EditRelationPropGrid'
		],
		
		launch : function() {
			Layout.App = this;
			
			Layout.FactorOperator = this.getController('FactorOperator');
			
			Ext.create('FDW.view.DefineWindow',{
				id : 'factorDefineWindow'
			});
			
			Ext.create('Ext.Viewport', {
				id:'framework',
				layout: 'border',
				renderTo: Ext.getBody(),
				items : [
				         {
				        	 	xtype: 'panel',
			                	region: 'north',
			                	height: 60,
			                	id: 'northArea',
			                    items:[{
	                        	   xtype:'shapePanel',
	                        	   id:'shapePanel',
	                        	   width:220,
	                           	   height:60
			                    }]
			            },{
				                region: 'south',
				                contentEl: 'south',
				                split: true,
				                height: 100,
				                minSize: 100,
				                maxSize: 200,
				                collapsible: true,
				                collapsed: true,
				                title: 'South',
				                margins: '0 0 0 0'
				        },{
			                region: 'west',
			                id: 'westArea',
			                split: true,
			                width: 350,
			                minWidth: 175,
			                maxWidth: 400,
			                collapsible: true,
			                animCollapse: true,
			                margins: '0 0 0 5',
			                layout: 'accordion',
			                items: [{
			                    title: '因子库',
			                    xtype: 'tabpanel',
			                    id: 'factor-tab',
			                    iconCls: 'nav',
			                    animCollapse: true,
			                    collapsible: true,
			                    collapsed:true,
			                    split: true,
			                    tabBar : {
		                	    	defaults : {
		                	    		height : 23
		                	    	}
		                	    },
			                    width: 350,
			                    minSize: 175,
			                    maxSize: 400,
			                    margins: '0 0 0 0',
			                    activeTab: 0,
			                    tabPosition: 'bottom',
			                    items: [{
			                        xtype: 'baseFactorGrid',
			                        id : 'baseFactorGrid',
			                        title: '因子',
			                        autoScroll: true
			                    }, {
			                    	xtype: 'baseFactorPropGrid',
			                    	id: 'baseFactorPropGrid',
		                            title: '因子属性',
		                            autoScroll: true
			                    },{
			                    	xtype: 'baseRelationGrid',
			                    	id: 'baseRelationGrid',
			                        title: '关系',
			                        autoScroll: true
			                    }, {
			                    	xtype: 'baseRelationPropGrid',
			                    	id: 'baseRelationPropGrid',
		                            title: '关系属性',
		                            autoScroll: true
			                    }]
			                }, {
			                    title: '项目库',
			                    iconCls: 'settings',
			                    xtype: 'tabpanel',
			                    id : 'project-tab',
			                    tabBar : {
		                	    	defaults : {
		                	    		height : 23
		                	    	}
		                	    },
			                    iconCls: 'nav',
			                    animCollapse: true,
			                    collapsible: true,
			                    split: true,
			                    width: 350,
			                    minSize: 175,
			                    maxSize: 400,
			                    margins: '0 0 0 0',
			                    activeTab: 0,
			                    tabPosition: 'bottom',
			                    items:[
									{
				                        xtype: 'editFactorGrid',
				                        id : 'editFactorGrid',
				                        title: '因子',
				                        autoScroll: true
				                    },{
				                    	xtype: 'editFactorPropGrid',
				                    	id: 'editFactorPropGrid',
			                            title: '因子属性',
			                            autoScroll: true
				                    },{
				                    	xtype: 'editRelationGrid',
				                    	id: 'editRelationGrid',
				                        title: '关系',
				                        autoScroll: true
				                    },{
				                    	xtype: 'editRelationPropGrid',
				                    	id: 'editRelationPropGrid',
				                        title: '关系属性',
				                        autoScroll: true
				                    }
			                    ]
			                }]
			            },
			            {
			            	 region: 'center',
			            	 xtype: 'drawPanel',
			            	 id: 'drawPanel'
			            }
			            ,
			            {
			                region: 'east',
			                xtype : 'chartPanel',
			                id: 'chartPanel',
			                title: '映射',
			                split: true,
			                width: 450,
			                collapsible: true,
			                animCollapse: true,
			                margins: '0 0 0 5',
			                items: []
			            }
		        ]
			});
			
			
		}
	});
	
});

