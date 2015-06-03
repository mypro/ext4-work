Ext.Loader.setPath('Layout.event','office/event');
Ext.Loader.setPath('Layout.func','office/func');
Ext.Loader.setPath('Layout.chart','office/chart');

Ext.require([
             'Ext.dd.*',
             'Ext.QuickTips',
             'Ext.grid.*',
             'component.editgrid.EditGrid',
             'component.factordefine.Window',
             'component.datatype.datatype',
             'component.valuelabel.valuelabel',
             'Ext.ux.grid.FiltersFeature',
             ]);

// the height of toolbar of draw center
var HEIGHT_CENTERTAB = 25;

// relation type
var RELATIONTYPE_FACTOR = 0;
var RELATIONTYPE_FACTOR_PROP = 1;
var RELATIONTYPE_RELATION_PROP = 2;

// the width of name input in draw center
var WIDTH_NAME_INPUT = 50;

// the width,height of draw center 
var DRAW_WIDTH = 4000;
var DRAW_HEIGHT = 3000;

var OPRATE_WIDTH = 560;
var OPRATE_HEIGHT = 420;

var isShiftActive = function(){
	return window.currentKey && (16==window.currentKey
			|| 17==window.currentKey || 18==window.currentKey);
};

var switchProject = function(projectUuid){
	window.project = projectUuid;
	
	
};

Ext.onReady(function(){

	document.onkeydown=function(e){
		var e = e ||event;
		var currKey=e.keyCode||e.which||e.charCode;
		window.currentKey = currKey;
		
		if (8 == currKey 
				&& (e.srcElement.type != 'text') 
				&& (e.srcElement.type != 'textarea')
				&& (e.srcElement.type != 'password')
				&& (e.srcElement.tagName != 'g')) {
			e.keyCode = 0;
			e.returnValue = false;
        }
	};
	document.onkeyup=function(e){
		delete window.currentKey;
	};
	
	// common init
	Ext.QuickTips.init();
	Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));
	
	Ext.application({
		name : 'Layout',
		appFolder : 'office',
		controllers : [ 
		               'BaseFactorController',
		               'BaseRelationController',
		               'DrawController',
		               'FactorController',
		               'EditFactorController',
		               'EditFactorPropController',
		               'EditRelationController',
		               'EditRelationPropController',
		               'EventSchedule',
		               'ShapeController',
		               'TopTool',
		               'ChartController',
		               'Chart',
		               'AutoDraw',
		               'DrawTabController',
		               'SetChartController',
		               'ChartTabController',
		],
		views : [ 
		         		'grid.BaseFactorGrid',
		         		'grid.BaseRelationGrid',
		         		'grid.BaseFactorPropGrid',
		         		'grid.EditFactorGrid',
		         		'grid.EditFactorPropGrid',
		         		'grid.EditRelationGrid',
		         		'grid.EditRelationPropGrid',
		         		'grid.FactorForChartGrid',
		         		'grid.FactorPropForChartGrid',
		         		'tool.ChartTool',
		         		'tool.ColorSize',
		         		'tool.Shape',
		         		'tool.Relation',
		         		'tool.Scale',
		         		'panel.DrawTab',
		         		'panel.ChartPanel',
		         		'panel.AutoDraw',
		         		'panel.DrawPanel',
		         		'panel.FactorPanel',
		         		'panel.DatasetPanel',
		         		'panel.SelectChartPanel',
		         		'panel.OperateTab'
		],
		
		launch : function() {
			Layout.App = this;
			
			Ext.Array.each(Layout.App.controllers.keys, function(key){
				Layout[key] = Layout.App.getController(key);
			});
			
			Layout.Select = Ext.create('Layout.func.Select');
			Layout.Copy = Ext.create('Layout.func.Copy');
			Layout.DataServer = Ext.create('Layout.func.DataServer');
			Layout.DefaultDefine = Ext.create('Layout.func.DefaultDefine');
			Layout.Draw = Ext.create('Layout.func.Draw');
			Layout.Layout = Ext.create('Layout.func.Layout');
			Layout.FactorValue = Ext.create('Layout.func.FactorValue');
			Layout.Operate = Ext.create('Layout.func.Operate');
			Layout.ChartFunc = Ext.create('Layout.func.ChartFunc');
			
			Layout.FactorValue.init();
			
			var cp = new Ext.state.CookieProvider();         
		    Ext.state.Manager.setProvider(cp);
		    Layout.Cookie = cp;
        	    
			Ext.create('Ext.Viewport', {
				id:'framework',
				layout: 'border',
				renderTo: Ext.getBody(),
				items : [{
			        	 	xtype: 'panel',
		                	region: 'north',
		                	height: 60,
		                	id: 'northArea',
		                	layout: {
		                        type: 'hbox',
		                        align: 'stretch'
		                    },
		                    items:[{
		                    	xtype : 'panel',
		                    	width : 200,
		                    	id : 'tool-bar',
		                    	layout: 'absolute',
		                    	items:[
									{
									    xtype     :'button',
									    text      : '新建',
									    id : 'tool-new',
									    x : 1,
									    y : 1,
									    menu : [
									    	{text:'因子', id:'create-factor'},
									    	{text:'因子属性', id:'create-factorProp'},
									    	{text:'关系属性', id:'create-relationProp'}
									    ],
									    width : 44,
									    height:25
									},
									{
									    xtype     :'button',
									    id : 'tool-save',
									    text      : '保存',
									    x : 45,
									    y : 1,
									    width : 44,
									    height:25
									},
									{
									    xtype     :'button',
									    text      : '删除',
									    id : 'tool-delete',
									    x : 89,
									    y : 1,
									    width : 44,
									    height:25
									},{
									    xtype     :'button',
									    text      : '导入',
									    id : 'tool-import',
									    x : 133,
									    y : 1,
									    width : 44,
									    height:25
									},{
									    xtype     :'button',
									    text      : '复制(c)',
									    id : 'tool-c',
									    x : 1,
									    y : 26,
									    width : 66,
									    height:25
									},
									{
									    xtype     :'button',
									    id : 'tool-x',
									    text      : '另存',
									    x : 67,
									    y : 26,
									    width : 66,
									    height:25
									},
									{
									    xtype     :'button',
									    text      : '粘贴(v)',
									    id : 'tool-p',
									    x : 133,
									    y : 26,
									    width : 66,
									    height:25
									}
		                    	]
		                    }
		                    ,{
		                        xtype: 'colorSizeTool',
		                        id:'tool-edit'
		                    },{
		                        xtype: 'shapeTool',
		                        id:'tool-shape'
		                    },{
		                        xtype: 'relationTool',
		                        id:'tool-relation'
		                    },{
		                    	xtype : 'scaleTool',
		                    	id:'tool-scale'
		                    },{
		                        xtype: 'chartTool',
		                        id:'tool-chart',
		                        width: document.body.clientWidth-650
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
			                margins: '0 0 0 0'
			            },{
			                region: 'west',
			                id: 'westArea',
			                split: true,
			                collapsed: true,
			                width: 200,
			                minWidth: 175,
			                maxWidth: 400,
			                collapsible: true,
			                animCollapse: true,
			                layout:'column',
			                items: [
			                    {
			                    	id: 'factor-grid',
			                    	split: true,
			                    	xtype:'panel',
			                    	columnWidth: 1,
			                    	activeTab : 1,
			                    	height: document.body.clientHeight-240-60-40,
			                    	width : 180,
			                    	layout: 'accordion',
			                    	items:[
			                    	     {
			                    	    	 id: 'tab-project',
			                    	    	 title : '项目库',
		                    	    		 xtype: 'tabpanel',
			                    	    	 tabBar : {
			 		                	    	defaults : {
			 		                	    		height : 23
			 		                	    	}
			 		                	     },
			 		                	     tabPosition: 'bottom',
			                    	    	 items:[{
								                        title: '因子',
								                        xtype: 'editFactorGrid',
								                        id: 'editFactorGrid',
								                        autoScroll: true
								                    },{
								                        title: '因子属性',
								                        xtype: 'editFactorPropGrid',
								                        id: 'editFactorPropGrid',
								                        autoScroll: true
								                    },{
								                        title: '关系',
								                        xtype: 'editRelationGrid',
								                        id: 'editRelationGrid',
								                        autoScroll: true
								                    },{
								                        title: '关系属性',
								                        xtype: 'editRelationPropGrid',
								                        id: 'editRelationPropGrid',
								                        autoScroll: true
								                    }]
			                    	     },{
			                    	    	 id: 'tab-base',
			                    	    	 title : '基本库',
			                    	    	 xtype: 'tabpanel',
			                    	    	 tabBar : {
			 		                	    	defaults : {
			 		                	    		height : 23
			 		                	    	}
			 		                	     },
			 		                	     tabPosition: 'bottom',
			                    	    	 items:[{
						                        title: '因子',
						                        xtype: 'baseFactorGrid',
						                        id: 'baseFactorGrid',
						                        autoScroll: true
						                    },{
						                        title: '关系',
						                        xtype: 'baseRelationGrid',
						                        id: 'baseRelationGrid',
						                        autoScroll: true
						                    },{
						                    	title: '属性集',
						                    	xtype: 'baseFactorPropGrid',
						                    	id: 'baseFactorPropGrid',
						                    	autoScroll: true
						                    }]
			                    	     } 
			                    	]
			                    },
			                    {
			                    	xtype:'factorPanel',
			                    	id:'factorPanel',
			                    	columnWidth: 1,
			                    	hideHeaders:true,
			                    	border:false,
			                    	height: 200,
			                    	width : 180,
			                    	title:'基本信息'
			                    },
			                ]
			            },
			            {
			            	 region: 'center',
			            	 xtype: 'drawTab',
			            	 id : 'centerArea'
			            },
			            {
			                region: 'east',
			                id : 'eastpanel',
			                xtype : 'tabpanel',
			                title : '输出区',
			                split: true,
			                collapsed: true,
			                width: 560,
			                collapsible: true,
			                animCollapse: true,
			                margins: '0 0 0 5',
			                items: [{
					                	xtype:'operateTab',
				                		id: 'operateTab',
						                title: '输出设置'
				                		
					                },{
					                	xtype:'selchartPanel',
				                		id: 'selchartPanel',
						                title: '选择图形'
				                		
					                },{
					                	xtype:'chartPanel',
				                	 	id: 'chartPanel',
						                title: '输出图'
					                }]
			            }],
			      listeners : {
			    	  afterrender : function(){
			    		  Layout.Select.init();
			    	  }
			      }
			});
			
			// load valuelabel
			ValueLabel.App.getController('ValueLabelController').initValueLabel();
			
			
			window.ctrls = function(){
				arguments[1].browserEvent.preventDefault();
				Ext.getCmp('tool-save').fireEvent('click', Ext.getCmp('tool-save'), arguments[1]);
			};
			window.ctrlc = function(){
				var btn = Ext.getCmp('tool-c'),
					args = Array.prototype.slice.call(arguments, 1);
				
				args.unshift(btn);
				
				btn.fireEventArgs('click', args);
			};
			window.ctrlv = function(){
				var btn = Ext.getCmp('tool-p'),
					args = Array.prototype.slice.call(arguments, 1);
				
				args.unshift(btn);
				
				btn.fireEventArgs('click', args);
			};
			window.pressDel = function(){
				Ext.getCmp('tool-delete').fireEvent('click', Ext.getCmp('tool-delete'), arguments[1]);
			};
			window.pressUp = function(){
				Layout.TopTool.direction(Ext.EventObject.UP);
			};
			window.pressDown = function(){
				Layout.TopTool.direction(Ext.EventObject.DOWN);
			};
			window.pressLeft = function(){
				Layout.TopTool.direction(Ext.EventObject.LEFT);
			};
			window.pressRight = function(){
				Layout.TopTool.direction(Ext.EventObject.RIGHT);
			};
			
			new Ext.KeyMap(Ext.getBody(), [{
				key : "s",
				ctrl : true,
				shift : false,
				fn : window.ctrls
			},{
				key : "c",
				ctrl : true,
				shift : false,
				fn : window.ctrlc
			},{
				key : "v",
				ctrl : true,
				shift : false,
				fn : window.ctrlv
			},{
				key : Ext.EventObject.DELETE,
				ctrl : false,
				shift : false,
				fn : window.pressDel
			},{
				key : Ext.EventObject.UP,
				ctrl : false,
				shift : false,
				fn : window.pressUp
			},{
				key : Ext.EventObject.DOWN,
				ctrl : false,
				shift : false,
				fn : window.pressDown
			},{
				key : Ext.EventObject.LEFT,
				ctrl : false,
				shift : false,
				fn : window.pressLeft
			},{
				key : Ext.EventObject.RIGHT,
				ctrl : false,
				shift : false,
				fn : window.pressRight
			},{
				key : Ext.EventObject.UP,
				ctrl : true,
				shift : false,
				fn : function() {
					Layout.TopTool.direction(Ext.EventObject.UP, 1);
				}
			},{
				key : Ext.EventObject.DOWN,
				ctrl : true,
				shift : false,
				fn : function() {
					Layout.TopTool.direction(Ext.EventObject.DOWN, 1);
				}
			},{
				key : Ext.EventObject.LEFT,
				ctrl : true,
				shift : false,
				fn : function() {
					Layout.TopTool.direction(Ext.EventObject.LEFT, 1);
				}
			},{
				key : Ext.EventObject.RIGHT,
				ctrl : true,
				shift : false,
				fn : function() {
					Layout.TopTool.direction(Ext.EventObject.RIGHT, 1);
				}
			}]);
			
		}
	});
	
	
});