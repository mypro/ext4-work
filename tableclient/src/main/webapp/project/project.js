Ext.require([
    'Ext.window.*',
    'Ext.state.*'
]);

Ext.onReady(function(){
	
//	document.onkeydown=function(e){
//		var e = e ||event;
//		var currKey=e.keyCode||e.which||e.charCode;
//		window.frames[0].window.currentKey = currKey;
//	};
	document.onkeyup=function(e){
		delete window.frames[0].window.currentKey;
	};
	
	// main
	Ext.application({
		name : 'Project',
		appFolder : 'project',
		controllers : [ 
		         'ProjectTreeController'
		],
		views : [ 
		         'ProjectTree'
		],
		
		launch : function() {
			Project.App = this;
			
			var cp = new Ext.state.CookieProvider();         
		    Ext.state.Manager.setProvider(cp);
		    Project.Cookie = cp;
		    Project.Cookie.set('IframeSrc', 'office.html');
			Ext.create('Ext.Viewport', {
				id:'framework',
				layout: 'border',
				renderTo: Ext.getBody(),
				items : [{
			                region: 'west',
			                id: 'projectArea',
			                split: true,
			                title: '项目列表',
			                animCollapse: true,
		                    collapsible: true,
		                    split: true,
			                width: 200,
			                items:[{
			                	xtype:'projectTree',
			                	id:'projectTree',
			                	border: true,
			                	height: document.body.clientHeight-60,
			                	autoScroll: true
			                }],
			                tbar:[{  
		        		            text:"新建",  
		        		            handler:Project.App.getController('ProjectTreeController').createProject
		        		          },{  
		          		            text:"复制",  
		        		            handler:function(){
		        		            	panel.copyProject = record;
		        		            	Ext.Ajax.request({
		        				    		url: '../work-platform/copyProject.do',    
		        				    	    params: { 
		        				    	    	projectUuid : panel.copyProject.get('uuid'),
		        				    	    	projectName : panel.copyProject.get('value')
		        				    	    },    
		        				    	    success: function(response){ 
		        				    	    	Ext.getCmp('projectTree').store.load();
		        				    	    }
		        				    	});
		        		            }  
		        		        },{  
		        		            text:"删除",  
		        		            handler:Project.App.getController('ProjectTreeController').deleteProject
		        		        }/*,
			                      { xtype: 'button', 
			                    	  text: '数据录入',
			                    	  handler :Project.App.getProjectTreeControllerController().btnShowTableArea },
			                      { xtype: 'button', 
			                    	  text: '布局映射',
			                    	  handler :Project.App.getProjectTreeControllerController().btnShowLayoutArea
			                    	    }*/
			                      ]
			            },Ext.create('Ext.tab.Panel', {
			            	region: 'center',
				            id:'cenPanel',
				            split:true,
			                items: [{
				                title:'布局区',
				            	 xtype: 'panel',
				            	 html:'<iframe id=mainPage width="100%" height="100%"/>',
	//			            	 html:'<iframe id=mainPage width="100%" height="100%" frameborder=0 src=layout.html?project='
	// 								+'aaa'+'></iframe>',
	 							 id: 'layoutArea',
	 							 listeners: {
		 			                    activate: function(){
		 			                    	Project.App.getProjectTreeControllerController().showLayoutArea();
		 			                    }
		 			                }
			                },{
				                title:'数据区',
				            	 xtype: 'panel',
				            	 html:'<iframe id=main2Page width="100%" height="100%"/>',
	//			            	 html:'<iframe id=mainPage width="100%" height="100%" frameborder=0 src=layout.html?project='
	// 								+'aaa'+'></iframe>',
	 							 id: 'dataArea',
	 							 listeners: {
	 			                    activate: function(){
	 			                    	Project.App.getProjectTreeControllerController().showTableArea();
	 			                    }
	 			                }
			                }],
			            listeners: {
			            	afterrender: function(){
			            		if(IS_DATA_AREA){
			            			Ext.getCmp('cenPanel').setActiveTab(1);
			            		}
			            	}
			            }
			            })
		        ]
			});
			
			new Ext.util.DelayedTask(function(){ 
				new Ext.KeyMap(Ext.getBody(), [{
					key : "s",
					ctrl : true,
					shift : false,
					fn : function() {
						arguments[1].browserEvent.preventDefault();
						window.frames[0].window.ctrls();
					}
				},{
					key : "c",
					ctrl : true,
					shift : false,
					fn : function() {
						window.frames[0].window.ctrlc.apply(this, arguments);
					}
				},{
					key : "v",
					ctrl : true,
					shift : false,
					fn : function() {
						window.frames[0].window.ctrlv.apply(this, arguments);
					}
				},{
					key : Ext.EventObject.DELETE,
					ctrl : false,
					shift : false,
					fn : function() {
						alert('del');
						window.frames[0].window.pressDel.apply(this, arguments);
					}
				},{
					key : Ext.EventObject.UP,
					ctrl : false,
					shift : false,
					fn : function() {
						window.frames[0].window.pressUp();
					}
				},{
					key : Ext.EventObject.DOWN,
					ctrl : false,
					shift : false,
					fn : function() {
						window.frames[0].window.pressDown();
					}
				},{
					key : Ext.EventObject.LEFT,
					ctrl : false,
					shift : false,
					fn : function() {
						window.frames[0].window.pressLeft();
					}
				},{
					key : Ext.EventObject.RIGHT,
					ctrl : false,
					shift : false,
					fn : function() {
						window.frames[0].window.pressRight();
					}
				},{
					key : Ext.EventObject.CTRL,
					ctrl : true,
					shift : false,
					fn : function() {
						window.frames[0].window.currentKey = 17;
					}
				}]);
			}).delay(2000);
		}
	});
	
});