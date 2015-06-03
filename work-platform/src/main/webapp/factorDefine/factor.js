createParamStore(PARAM_DEFINE_COLUMNTYPE);
createParamStore(PARAM_DEFINE_ALIGN);
createParamStore(PARAM_DEFINE_METRIC);
createParamStore(PARAM_DEFINE_ROLE);
createParamStore('paramDefine');
createTypeStore();

/*数值，int*/
var COLUMNTYPE_DECIMAL = "8743c7b7607d4dadbf6f6b111af82d4a";//数值
var COLUMNTYPE_POINT = "0fbabd96ec9b4824a3c94f27fb1ee566";//点
var COLUMNTYPE_COMMA = "12324ca659d4495f8fabea0e74c9de8d";//逗号
var COLUMNTYPE_CURRENCY = "5ce3d70cca524a69ad5c36ec6b601d4e";//货币
var COLUMNTYPE_DOLLAR = "608240402aea4a3cb3fd1ab5e36c9b25";//美元
var COLUMNTYPE_SCIENTIFIC = "b648b329ab9d4b84b5b20e2d676600d3";//科学计数法
var COLUMNTYPE_LIMIT = "d96620a7749b477d9a23e1e36a56ab19";//受限数值
/*日期，data*/
var COLUMNTYPE_DATE_1 = "09bd730a6a69412aaba66c02ff17e6af";//dd/mm/yyyy
var COLUMNTYPE_DATE_2 = "391c6c3a462844d38eea42a05d36ab4a";//dd-mmmm-yy
var COLUMNTYPE_DATE_3 = "58de42eaa33d46e1a0a4f8e65b5db105";//dd-mmmm-yyyy
var COLUMNTYPE_DATE_4 = "8b8586b943a04a8ebafd47c64195a8df";//mm/dd/yyyy
var COLUMNTYPE_DATE_5 = "af20aff4f5a74798995ee718a6c75202";//dd/mm/yy
/*字符串varchar*/
var COLUMNTYPE_CHAR = "85806344e6354482822f28ff055bcdd0";//字符串
/*全局变量，CurrentGridRecord用于记录当前操作的grid;CurrentRecordUuid,用于记录修改的记录的uuid*/
var CurrentGridRecord,
CurrentRecordInstUuid,
CurrentRecordDefineUuid;
var CurrentMaxTable=0;

//relation type
var RELATIONTYPE_FACTOR = 0;
var RELATIONTYPE_FACTOR_PROP = 1;
var RELATIONTYPE_RELATION_PROP = 2;
Ext.require([
    'Ext.tip.QuickTipManager',
    'Ext.container.Viewport',
    'Ext.layout.*',
    'Ext.form.Panel',
    'Ext.form.Label',
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.tree.*',
    'Ext.selection.*',
    'Ext.tab.Panel',
    'component.headtb.toolbar',
    'component.datatype.datatype',
    'component.valuelabel.valuelabel',
    'component.datafilter.datafilter',
    'Ext.ux.grid.FiltersFeature'
]);

Ext.onReady(function(){

Ext.application({
	name : 'Factor',
	appFolder : 'factorDefine',
	controllers : [ 
//	        'FactorPropertyParamController',
//	        'FactorPropertyOuterController',
//			'FactorPropertyController', 
			'tree.FactorTreeController',
			'window.FactorWindowController',
			'window.RelationWindowController',
			'panel.FactorController',
			'panel.FactorPropertyController',
			'panel.RelationController',
			'panel.RelationPropertyController',
			'panel.FactorPropertyGridController',
			'panel.FactorDataController',
			'panel.RelationDataController',
			'ComboController'
//			'RelationPropertyParamController',
//			'RelationPropertyController',
//			'RelationController'
	],
	views : [ 
//	        'panel.FactorPropertyDataGrid',
//	        'panel.FactorPropertyParamGrid',
//	        'panel.FactorPropertyGrid',
			'tree.FactorTree',
			'window.FactorWindow', 
			'window.RelationWindow', 
			'panel.FactorGrid', 
			'panel.FactorPropertyGrid',
			'panel.RelationGrid',
			'panel.FactorProperty', 
			'panel.RelationPropertyGrid',
			'panel.FactorDataGrid',
			'panel.RelationDataGrid'
			
			
//			'panel.RelationPropertyParamGrid',
//			'panel.RelationPropertyGrid',
//			'panel.RelationGrid' 
	],
	
	preventShake : function(name, scope){
		var current = new Date().getTime();
		var key = name+"-runtime";
		if(!scope[key]){
			scope[key] = 0;
		}
		if(current - scope[key] > 600){
			scope[key] = current;
			return true;
		}else{
			scope[key] = current;
			return false;
		}
	},

	launch : function() {
		Factor.App = this;
		ValueLabel.App.getController('ValueLabelController').initValueLabel();
		Ext.create('Factor.view.window.FactorWindow',{
			id : 'factorWindow'
		});
		Factor.DefaultDefine = Ext.create('Factor.func.DefaultDefine');
		Ext.create('Factor.view.window.RelationWindow',{
			id : 'relationWindow'
		});
		
		Ext.create('Ext.Viewport', {
	        layout: 'border',
	        title: 'Factor Define',
	        items: [{
	            xtype: 'panel',
	            id: 'header',
	            region: 'north',
	            tbar : {
	            	xtype:'toolbarView',
	            	id:'titleToolbar',
	            	callback : {
	        			// 点击保存
		            		newSth:function(){
		            			/*new Ext.menu.Menu({  
		            	             items : [{
		            	            	 text : '新增因子',  
		            	             }
		            	                      ]}).showAt(15,25);*/
//		            			Factor.App.getPanelFactorControllerController().containerdblclick();
		        			},
		        			save:function(){
		        				var gridId=CurrentGridRecord,
		        				instUuid=CurrentRecordInstUuid,
		        				defineUuid=CurrentRecordDefineUuid;
		        				var store=Factor.App.getPanelFactorPropertyGridControllerController().getFactorProperty().getStore();
		        				
		        				if("Factor"===gridId){
		        					var factorDefineRecord={
		    								dataType:format2DataType(store.getAt(1).get('value')),// 
		    								decimalWidth:store.getAt(3).get('value'), //
		    								defineUuid:defineUuid, //因子定义id
		    								typeShow:'', //
		    								valueLabelUuid:store.getAt(4).get('value'),//值标签索引 
		    								name:store.getAt(0).get('value'), //名称
		    								width:store.getAt(2).get('value'), 
		    								createLevel:1, 
		    								uuid:instUuid, //因子实例id
		    								format:store.getAt(1).get('value')};
		    		
						    		Ext.Ajax.request({ 
						    			url: '../work-platform/saveFactor.do',
						    			params: {
						    				addRecord : Ext.encode(factorDefineRecord),
						    				parentUuid : '',
						    				parentType : ''
						    			},
						    			success: function(response, options) {
						    				var result = Ext.JSON.decode(response.responseText); 
						    				if(result.duplicate){
						    					Ext.Msg.alert('','名称重复');
						    					return;
						    				}
						    				
						    				Factor.App.getPanelFactorControllerController().getFactorGrid().getStore().reload();
						    				factor1Store.reload();
						    				factor2Store.reload();
						    				Factor.App.getTreeFactorTreeControllerController().getFactorTreeStoreStore().load();
						    			}
						    		});
		        				}else if("FactorProperty"===gridId){
		        					var factorDefineRecord={
		        							dataType:format2DataType(store.getAt(1).get('value')),// 
		    								decimalWidth:store.getAt(3).get('value'), //
		    								defineUuid:defineUuid, //因子定义id
		    								typeShow:'', //
		    								valueLabelUuid:store.getAt(4).get('value')===''?'':store.getAt(4).get('value'),//值标签索引 
		    								name:store.getAt(0).get('value'), //名称
		    								width:store.getAt(2).get('value'), 
		    								createLevel:2, 
		    								uuid:instUuid, //因子实例id
		    								format:store.getAt(1).get('value')
//		    					            dataSourceUuid:store.getAt(5).get('value')===''?'':store.getAt(5).get('value'),
//		    					    		dataBaseUuid:store.getAt(5).get('value')===''?'':store.getAt(5).get('value'),
//		    					    		dataTableUuid:store.getAt(6).get('value')===''?'':store.getAt(6).get('value'),
//		    					    		dataColumnUuid:store.getAt(7).get('value')===''?'':store.getAt(7).get('value')
		    					    };
						    		// parent信息
						    		var parentUuid;
						    		var factorSelectModel = Factor.App.getPanelFactorControllerController().getFactorGrid().selModel;
						    		if( 0 < factorSelectModel.selected.length){
						    			parentUuid = factorSelectModel.selected.items[0].get('uuid');
						    	    
						    			// http request 保存
						    			Ext.Ajax.request({ 
						    				url: '../work-platform/saveFactor.do',
						    				params: {
						    					addRecord : Ext.encode(factorDefineRecord),
						    					parentUuid : parentUuid,
						    					parentType :1
						    				},
						    				success: function(response, options) {
						    					var result = Ext.JSON.decode(response.responseText); 
						    					if(result.duplicate){
						    						Ext.Msg.alert('','名称重复');
						    						return;
						    					}
						    					
						    					Factor.App.getPanelFactorPropertyControllerController().getFactorPropertyGrid().getStore().load({
						    								params:{
						    									condition : Ext.encode({
						    										parentUuid : parentUuid,
						    										parentType :1
						    									})
						    								}
						    							});
						    					Factor.App.getTreeFactorTreeControllerController().getFactorTreeStoreStore().load();
						    				}
						    			});
						    		}
		        				}else if("Relation"===gridId){
		        					var x = 10;
		        					var y = 10;
		        					
		        					if('1'=== store.getAt(0).get('value')||'2'===store.getAt(1).get('value')||''===store.getAt(0).get('value')||''===store.getAt(1).get('value')){
		        						Ext.MessageBox.alert('提示', '请选择两个因子！');
		        						return;
		        					}
		        					var factor1Uuid='',factor2Uuid='';
		        					var factorStore=Factor.App.getPanelFactorControllerController().getFactorGrid().getStore();
		        					for(var i=0;i<factorStore.getCount();i++){
		        						var record=factorStore.getAt(i);
		        						if(store.getAt(0).get('value')===record.get('uuid')||store.getAt(0).get('value')===record.get('name')){
//		        							factor1Uuid=store.getAt(0).get('value');
		        							factor1Uuid=record.get('uuid');
		        						}
		        						if(store.getAt(1).get('value')===record.get('uuid')||store.getAt(1).get('value')===record.get('name')){
//		        							factor2Uuid=store.getAt(1).get('value'); 
		        							factor2Uuid=record.get('uuid'); 
		        						}
		        					}
		        					if(''!==factor1Uuid&&''!==factor2Uuid){
		        						var relation = Factor.DefaultDefine.createRelationByUuid(instUuid,factor1Uuid,factor2Uuid);
		        						/*var record={
						        				factor1Name: "",
						        				factor1Uuid: factor1Uuid,
						        				factor2Name: "",
						        				factor2Uuid: factor2Uuid,
						        				seq: "",
						        				type: 0,
						        				uuid: ""
		        						};*/
		        						Factor.App.getPanelRelationControllerController().saveRelation(store,relation.data);
		        					}else if(''===factor1Uuid&&''!==factor2Uuid){
		        						
		        						var factor = Factor.DefaultDefine.createFactorByNewName(1, store.getAt(0).get('value'),x, y);
		        						Ext.Ajax.request({ 
		        							url: '../work-platform/importFactor.do',
		        							params: {
		        								record : Ext.encode(factor.data),
		        							},
		        							success: function(response, options) {
		        								var result = Ext.JSON.decode(response.responseText); 
		        								/*var record2={childs: RelationChildren,
								        				factor1Name: "",
								        				factor1Uuid: result.uuid,
								        				factor2Name: "",
								        				factor2Uuid: factor2Uuid,
								        				seq: "",
								        				type: 0,
								        				uuid: ""
				        						};*/
		        								var relation = Factor.DefaultDefine.createRelationByUuid(instUuid,result.uuid,factor2Uuid);
				        						Factor.App.getPanelRelationControllerController().saveRelation(store,relation.data);
				        						
		        								Factor.App.getPanelFactorControllerController().getFactorGrid().getStore().reload();
		        								factor1Store.reload();
		        								factor2Store.reload();
		        								Factor.App.getTreeFactorTreeControllerController().getFactorTreeStoreStore().load();
		        							}
		        						});
		        					}else if(''!==factor1Uuid&&''===factor2Uuid){
		        						var factor = Factor.DefaultDefine.createFactorByNewName(1, store.getAt(1).get('value'),x, y);
		        						/*var record={
		        								defineUuid:'', 
		        								measure:'', 
		        								width:8, 
		        								createLevel:1, 
		        								label:'', 
		        								relationUuid:'', 
		        								format:'85806344e6354482822f28ff055bcdd0', 
		        								prototype:0, 
		        								dataType:1, 
		        								decimalWidth:0, 
		        								valueLabelUuid:'', 
		        								name:store.getAt(1).get('value'), 
		        								value:'', 
		        								seq:Factor.App.getPanelFactorControllerController().getFactorStoreStore().getCount()>0?(Factor.App.getPanelFactorControllerController().getFactorStoreStore().getAt(Factor.App.getPanelFactorControllerController().getFactorStoreStore().getCount()-1).get('seq')+1024):0, 
		        								role:'', 
		        								childs:factorChildren
		        						};*/
		        						Ext.Ajax.request({ 
		        							url: '../work-platform/importFactor.do',
		        							params: {
		        								record : Ext.encode(factor.data),
		        							},
		        							success: function(response, options) {
		        								var result = Ext.JSON.decode(response.responseText); 
		        								/*var record2={childs: RelationChildren,
								        				factor1Name: "",
								        				factor1Uuid: factor1Uuid,
								        				factor2Name: "",
								        				factor2Uuid: result.uuid,
								        				seq: "",
								        				type: 0,
								        				uuid: ""
				        						};*/
		        								var relation = Factor.DefaultDefine.createRelationByUuid(instUuid,factor1Uuid,result.uuid);
				        						Factor.App.getPanelRelationControllerController().saveRelation(store,relation.data);
				        						
		        								Factor.App.getPanelFactorControllerController().getFactorGrid().getStore().reload();
		        								factor1Store.reload();
		        								factor2Store.reload();
		        								Factor.App.getTreeFactorTreeControllerController().getFactorTreeStoreStore().load();
		        							}
		        						});
		        					}else if(''===factor1Uuid&&''===factor2Uuid){
		        						var factor = Factor.DefaultDefine.createFactorByNewName(1, store.getAt(0).get('value'),x, y);
		        						/*var record={
		        								defineUuid:'', 
		        								measure:'', 
		        								width:8, 
		        								createLevel:1, 
		        								label:'', 
		        								relationUuid:'', 
		        								format:'85806344e6354482822f28ff055bcdd0', 
		        								prototype:0, 
		        								dataType:1, 
		        								decimalWidth:0, 
		        								valueLabelUuid:'', 
		        								name:store.getAt(0).get('value'), 
		        								value:'', 
		        								seq:Factor.App.getPanelFactorControllerController().getFactorStoreStore().getCount()>0?(Factor.App.getPanelFactorControllerController().getFactorStoreStore().getAt(Factor.App.getPanelFactorControllerController().getFactorStoreStore().getCount()-1).get('seq')+1024):0, 
		        								role:'', 
		        								childs:factorChildren
		        						};*/
		        						Ext.Ajax.request({ 
		        							url: '../work-platform/importFactor.do',
		        							params: {
		        								record : Ext.encode(factor.data),
		        							},
		        							success: function(response, options) {
		        								var result = Ext.JSON.decode(response.responseText); 
		        								factor1Uuid=result.uuid;
		        								var factor2 = Factor.DefaultDefine.createFactorByNewName(1, store.getAt(1).get('value'),x, y);
		        								/*var record3={
				        								defineUuid:'', 
				        								measure:'', 
				        								width:8, 
				        								createLevel:1, 
				        								label:'', 
				        								relationUuid:'', 
				        								format:'85806344e6354482822f28ff055bcdd0', 
				        								prototype:0, 
				        								dataType:1, 
				        								decimalWidth:0, 
				        								valueLabelUuid:'', 
				        								name:store.getAt(1).get('value'), 
				        								value:'', 
				        								seq:Factor.App.getPanelFactorControllerController().getFactorStoreStore().getCount()>0?(Factor.App.getPanelFactorControllerController().getFactorStoreStore().getAt(Factor.App.getPanelFactorControllerController().getFactorStoreStore().getCount()-1).get('seq')+1024):0, 
				        								role:'', 
				        								childs:factorChildren
				        						};*/
				        						Ext.Ajax.request({ 
				        							url: '../work-platform/importFactor.do',
				        							params: {
				        								record : Ext.encode(factor2.data),
				        							},
				        							success: function(response, options) {
				        								var result = Ext.JSON.decode(response.responseText); 
//				        								var record2={childs: RelationChildren,
//										        				factor1Name: "",
//										        				factor1Uuid: factor1Uuid,
//										        				factor2Name: "",
//										        				factor2Uuid: result.uuid,
//										        				seq: "",
//										        				type: 0,
//										        				uuid: ""
//						        						};
				        								var relation = Factor.DefaultDefine.createRelationByUuid(instUuid,factor1Uuid,result.uuid);
						        						Factor.App.getPanelRelationControllerController().saveRelation(store,relation.data);
						        						
				        								Factor.App.getPanelFactorControllerController().getFactorGrid().getStore().reload();
				        								factor1Store.reload();
				        								factor2Store.reload();
				        								Factor.App.getTreeFactorTreeControllerController().getFactorTreeStoreStore().load();
				        							}
				        						});
		        							}
		        						});
		        					}
//		        					var factor1Uuid=getDefineUuid(factorStore,store.getAt(0).get('value'),'uuid');
//		        					var factor2Uuid=getDefineUuid(factorStore,store.getAt(1).get('value'),'uuid');
		        					
		        					
		        					/*var  relationRecord= {
		        							uuid:instUuid, 
		        							factor1Uuid:store.getAt(0).get('value'), 
		        							type:0, 
		        							factor2Uuid:store.getAt(1).get('value')
		        							};
		        					Ext.Ajax.request({ 
		        						url: '../work-platform/saveRelation.do',
		        						params: {
		        							addRecord : Ext.encode(relationRecord)
		        						},
		        						success: function(response, options) {
		        							var result = Ext.JSON.decode(response.responseText); 
		        							if(result.duplicate){
		        								Ext.Msg.alert('','关系重复');
		        								return;
		        							}
		        							
		        							Factor.App.getPanelRelationControllerController().getRelationGrid().getStore().load();
		        						}
		        					});*/
		        				}else if("FactorRelationProperty"===gridId){
		        					var factorDefineRecord={
		        							dataType:format2DataType(store.getAt(1).get('value')),// 
		    								decimalWidth:store.getAt(3).get('value'), //
		    								defineUuid:defineUuid, //因子定义id
		    								typeShow:'', //
		    								valueLabelUuid:store.getAt(4).get('value'),//值标签索引 
		    								name:store.getAt(0).get('value'), //名称
		    								width:store.getAt(2).get('value'), 
		    								createLevel:2, 
		    								uuid:instUuid, //因子实例id
		    								format:store.getAt(1).get('value')/*,
//		    					            dataSourceUuid:store.getAt(5).get('value')===''?'':store.getAt(5).get('value'),
//		    					    		dataBaseUuid:store.getAt(5).get('value')===''?'':store.getAt(5).get('value'),
		    					    		dataTableUuid:store.getAt(6).get('value')===''?'':store.getAt(6).get('value'),
		    					    		dataColumnUuid:store.getAt(7).get('value')===''?'':store.getAt(7).get('value')*/};
						    		// parent信息
						    		var parentUuid;
						    		var selectModel = Factor.App.getPanelRelationPropertyControllerController().getRelationGrid().selModel;
						    		if(0 < selectModel.selected.length){
						    			parentUuid = selectModel.selected.items[0].get('uuid');
						    	    
						    			Ext.Ajax.request({ 
						    				url: '../work-platform/saveFactor.do',
						    				params: {
						    					addRecord : Ext.encode(factorDefineRecord),
						    					parentUuid : parentUuid,
						    					parentType : 2
						    				},
						    				success: function(response, options) {
						    					var result = Ext.JSON.decode(response.responseText); 
						    					if(result.duplicate){
						    						Ext.Msg.alert('','名称重复');
						    						return;
						    					}
						    					
						    					Factor.App.getPanelRelationPropertyControllerController().getRelationPropertyGrid().getStore().load({
						    						params:{
						    							condition : Ext.encode({
						    								parentUuid : parentUuid,
						    								parentType :2
						    							})
						    						}
						    					});
						    					Factor.App.getTreeFactorTreeControllerController().getFactorTreeStoreStore().load();
						    				}
						    			});
						    		}
		        				}
		        			},
		        			add : function(){
		        				var gridId=CurrentGridRecord,
		        				instUuid=CurrentRecordInstUuid,
		        				defineUuid=CurrentRecordDefineUuid;
		        				if("Factor"===gridId){
		        					Factor.App.getPanelFactorControllerController().containerdblclick();
		        				}else if("FactorProperty"===gridId){
		        					Factor.App.getPanelFactorPropertyControllerController().containerdblclick();
		        				}else if("Relation"===gridId){
		        					Factor.App.getPanelRelationControllerController().containerdblclick();
		        				}else if("FactorRelationProperty"===gridId){
		        					Factor.App.getPanelRelationPropertyControllerController().containerdblclick();
		        				}
		        				
		        			},
		        			insert : function(toolbar,btn){
		        			},
		        			remove : function(){
		        				var gridId=CurrentGridRecord,
		        				instUuid=CurrentRecordInstUuid,
		        				defineUuid=CurrentRecordDefineUuid;
		        				if("Factor"===gridId){
		        					Factor.App.getPanelFactorControllerController().deleteFactor();
		        				}else if("FactorProperty"===gridId){
		        					Factor.App.getPanelFactorPropertyControllerController().deleteFatorProperty();
		        				}else if("Relation"===gridId){
		        					Factor.App.getPanelRelationControllerController().deleteRelation();
		        				}else if("FactorRelationProperty"===gridId){
		        					Factor.App.getPanelRelationPropertyControllerController().deleteRelationProperty();
		        				}
		        			},
		        			import : function(toolbar,btn){
		        				relationUpload();
		        			},
		        			exportExcel:function(toolbar,btn){
		        				var list=['CPU','内存','d'];
		        				var by='text';
	        					Factor.App.getTreeFactorTreeControllerController().getFactorTree().filterByNoInTree(list,by);
		        			}
		            },
		            height: 28
		            }
	        },{
	            layout: 'border',
	            id: 'leftTreePanel',
	            region:'west',
	            border: false,
	            margins: '2 0 5 5',
	            width: 250,
	            height : document.body.clientHeight-69,
	            split: true,
                collapsible: true,
                animCollapse: true,
	            minSize: 100,
	            maxSize: 500,
	            items: [{
	                id: 'factorTree',
	                xtype : 'factorTree',
	                title: '预定义因子列表',
	                region:'north',
	                split: true,
	                height : (document.body.clientHeight-69)/2,
	                minSize: 150,
	                rootVisible: false,
	                autoScroll: true
	                //store: store
	            },Ext.create('Ext.tab.Panel', {
	            	width: 250,
		            minSize: 100,
		            region:'center',
		            id:'formPanel',
		            maxSize: 500,
		            height : (document.body.clientHeight-69)/2,
		            split:true,
//	                autoScroll: true,
	                items: [Ext.create('Ext.container.Container', {
	                    layout:'absolute',
	                    title:'属性录入',
	                    id:'factorPropertyContainer',
	                    height : (document.body.clientHeight-69)/2,
	                    split: true,
	                    minSize: 150,
		                listeners: {
		                    activate: function(){
		                    	propertyGridActivity();
		                    }
		                },
	                    items: [{
	                    	x:0,
	                    	y:0,
	                    	id:'factorProperty',
			            	xtype:'factorProperty',
			            	title:'当前未编辑',
			                height: (document.body.clientHeight-69)/2,
			                autoScroll: true,
	                    	listeners: {
	    						'afterrender': function(component,e){ 
	    							console.log('afterrender');
	    			            }
	                    	}
	                    },{
	                    	xtype:'combo',
	                    	x:116,
	                    	id:'triggerfield-combo',
	                    	width:114,
	                    	y:105,
//	                    	store:factorPropertyStore,
							editable : false,
							emptyText : "请选择...",
							displayField :'label',
			                valueField :'value',
			                queryMode: 'local',
							mode : 'remote',
							triggerAction : 'all',
//	                    	hidden:true,
	                    	style: {
	                    	'z-index':20000
	                    	},
	                    	listeners: {
	    						'blur': function(component,e){ 
	    							saveValue(component.value);
	    			            }
	                    	}
	                    },{
	                    	xtype:'triggerfield',
	                    	x:116,
	                    	id:'triggerfield-triggerfield',
	                    	triggerCls : 'x-form-my-trigger',
	                    	width:132,
	                    	y:105,
	                    	onTriggerClick : Factor.App.getController("panel.FactorPropertyGridController").openValueLabelWin,
//	                    	hidden:true,
	                    	style: {
	                    	'z-index':19011
	                    	}
	                    },{
	                    	xtype:'textfield',
	                    	x:116,
	                    	id:'triggerfield-textfield',
	                    	width:116,
	                    	y:105,
	                    	hidden:true,
	                    	style: {
	                    	'z-index':20000
	                    	},
	                    	listeners: {
	    						'blur': function(component,e){ 
	    							saveValue(component.value);
	    			            }
	                    	}
	                    },{
	                    	xtype:'numberfield',
	                    	x:116,
	                    	id:'triggerfield-numberfield',
	                    	width:116,
	                    	y:105,
	                    	hidden:true,
	                    	style: {
	                    	'z-index':20000
	                    	},
	                    	listeners: {
	    						'blur': function(component,e){ 
	    							saveValue(component.value);
	    			            }
	                    	}
	                    },{
	                    	xtype:'datefield',
	                    	x:116,
	                    	id:'triggerfield-datefield',
	                    	width:116,
	                    	y:104,
	                    	hidden:true,
	                    	style: {
	                    	'z-index':20000
	                    	},
	                    	listeners: {
	    						'blur': function(component,e){ 
	    							saveValue(component.value);
	    			            }
	                    	}
	                    }]
	                }),
                	Ext.create('DataFilter.view.DataFilterForm',{
	                	id:'dataFilterForm',
	                	height : (document.body.clientHeight-160)/2,
		                minSize: 150,
		                width:400,
		                split: true,
		                autoScroll: true,
		                listeners: {
		                    activate: function(){
		                    	Ext.getCmp('leftTreePanel').setWidth(420);
		                    	Ext.getCmp('factorTree').setHeight(Ext.getCmp('factorTree').getHeight()/2+53);
		                    	Ext.getCmp('formPanel').setSize(420,document.body.clientHeight-Ext.getCmp('factorTree').getHeight()/2-126);
		                    	var gridId=CurrentGridRecord,
		        				instUuid=CurrentRecordInstUuid,
		        				defineUuid=CurrentRecordDefineUuid;
		                    	var queryUuid='';
		                    	if("Factor"===gridId){
		                    		queryUuid=Factor.App.getPanelFactorControllerController().getFactorGrid().selModel.selected.items[0].get('queryUuid');
		                    	}else if("FactorProperty"===gridId){
		                    		queryUuid=Factor.App.getPanelFactorPropertyControllerController().getFactorPropertyGrid().selModel.selected.items[0].get('queryUuid');
		                    	}else if("Relation"===gridId){
		                    		queryUuid=Factor.App.getPanelRelationControllerController().getRelationGrid().selModel.selected.items[0].get('queryUuid');
		                    	}else if("FactorRelationProperty"===gridId){
		                    		queryUuid=Factor.App.getPanelRelationPropertyControllerController().getRelationPropertyGrid().selModel.selected.items[0].get('queryUuid');
		                    	}
		                    	Ext.getCmp('conditionGrid').getStore().load({
		                    		params:{
		                    			queryUuid : queryUuid
		                			}
		                    	});
		                    }
		                    
		                },
		            	callback : {
		            		saveQuery:function( form,queryUuid, dsKeyword, dbKeyword, tableKeyword, valueKeyword, resultField, conditionField){
		            			var gridId=CurrentGridRecord,
		        				instUuid=CurrentRecordInstUuid,
		        				defineUuid=CurrentRecordDefineUuid;
		        				var factorPropertyUuid=instUuid;
//		        				if("Factor"===gridId){
//		        					
//		        				}
//		            			var factorPropertyUuid=Factor.App.getPanelFactorPropertyControllerController().getFactorPropertyGrid().selModel.selected.items[0].get('uuid');
		            			Ext.Ajax.request({ 
				    				url: '../work-platform/saveCondition.do',
				    				params:{
		    							condition : Ext.encode({
		    								instUuid:factorPropertyUuid,
		    								uuid:queryUuid,
		    								dsKeyword : dsKeyword,
		    								dbKeyword : dbKeyword,
		    								tableKeyword : tableKeyword,
		    								valueKeyword : valueKeyword,
		    								resultField : resultField,
		    								conditionField :conditionField
		    							})
		    						},
				    				success: function(response, options) {
				    					Ext.getCmp('conditionGrid').getStore().commitChanges( );
				    					Factor.App.getPanelFactorDataControllerController().setFactorData(response.responseText,valueKeyword);
				    				}
		            			});
		            		},
		            		execQuery:function( form,queryUuid, dsKeyword, dbKeyword, tableKeyword, valueKeyword, resultField, conditionField){
		        				var dataTableUuid=tableKeyword;
		        				var conditionField=conditionField;
		        				var resultFields=[];
		        				for(var i=0;i<resultField.length;i++){
		        					resultFields.push(resultField[i]);
		        				}
		        				resultFields.push(valueKeyword);
		        				
		        				var columnModel= [Ext.create('Ext.grid.RowNumberer')];
		        				var fields=[];
		        				for(var i=0;i<resultFields.length;i++){
		        					var s=resultFields[i];
		        					var c={header:s,dataIndex:s,width:80,editor:{xtype:'textfield'}};
		        					columnModel.push(c);
		        					fields.push(s);
		        				}
//		        				columnModel.push({header:valueKeyword,dataIndex:valueKeyword,width:80,editor:{xtype:'textfield'}});
		        				fields.push(valueKeyword);
		        				Ext.define('column', {
		        	    			extend: 'Ext.data.Model',
		        	    			fields: fields
		        	    		});
		        				var storeModel=Ext.create('Ext.data.Store', {
		        	    			id:'premeterStore',
		        	    			model: 'column',
		        	    			proxy: {
		        	    				type: 'ajax',
		        	    				url :'../../../work-platform/loadConditionData.do?base=true&&condition='+ Ext.encode({
		        	    					dataTableUuid:dataTableUuid,
		        	    					conditionField:conditionField,
		        	    					resultField:resultFields
		        						}),
		        	    				reader: {
		        	    					type: 'json'
		        	    				}
		        	    			},
		        	    			autoLoad: true
		        	    		});
		        				var gridId=CurrentGridRecord;
		                    	if("Factor"===gridId||"FactorProperty"===gridId){
		                    		Factor.App.getPanelFactorDataControllerController().getFactorDataGrid().reconfigure( storeModel, columnModel);
		                    	}else if("Relation"===gridId||"FactorRelationProperty"===gridId){
		                    		Factor.App.getPanelRelationDataControllerController().getRelationDataGrid().reconfigure( storeModel, columnModel);
		                    	}
		        				
		            		}
		            	}
	                })]
	            })
	            ]
	        },{
	            id: 'centerPanel',
	            region: 'center', 
	            baseCls : 'x-plain',
	            layout : 'border',
				width :document.body.clientWidth-270,
				height : document.body.clientHeight-69,
	            margins: '2 5 5 0',
	            border: false,
				 listeners: {
					 resize: function(){
//						 if(CurrentMaxTable!=0){
//							 MaxGrid(CurrentMaxTable);
//						 }else{
							 if(Ext.getCmp('formPanel').getActiveTab().id==='dataFilterForm'){
								 Ext.getCmp('leftPanel').setWidth((document.body.clientWidth-440)/3);
								 Ext.getCmp('centersPanel').setWidth((document.body.clientWidth-440)/3);
								 Ext.getCmp('rightPanel').setWidth((document.body.clientWidth-440)/3);
								 if(CurrentMaxTable!=0){
									 MaxGrid(CurrentMaxTable);
								 }
							 }else{
								 Ext.getCmp('leftPanel').setWidth((document.body.clientWidth-270)/3);
								 Ext.getCmp('centersPanel').setWidth((document.body.clientWidth-270)/3);
								 Ext.getCmp('rightPanel').setWidth((document.body.clientWidth-270)/3);
								 if(CurrentMaxTable!=0){
									 MaxGrid(CurrentMaxTable);
								 }
							 }
//						 }
	                    }
	                },
	            items: [{
    	            region: 'west', 
    	            layout : 'border',
    	            id:'leftPanel',
					width :(document.body.clientWidth-270)/3,
    	            border: false,
    	            split: true,
	                collapsible: true,
	                animCollapse: true,
    	            minSize: 100,
    	            maxSize: 500,
    	            items: [{
			            	xtype : 'factorGrid',
			            	id : 'factorGrid',
			            	title : '因子',
			            	region: 'north',
			            	split:true,
		    	            minSize: 100,
		    	            maxSize: 500,
			            	height : (document.body.clientHeight-69)/2
				            },{
				            	xtype : 'relationGrid',
				            	id : 'relationGrid',
				            	title : '因子关系',
				            	split:true,
			    	            minSize: 100,
			    	            maxSize: 500,
				            	height : (document.body.clientHeight-69)/2,
				            	region: 'center'
				            }]
    				},{
        	            region: 'center', 
        	            layout : 'border',
        	            id:'centersPanel',
    					width :(document.body.clientWidth-270)/3,
        	            border: false,
        	            split: true,
        	            tools:[{
        	           	    type:'left',
        	           	    tooltip: '向左收缩',
        	           	    id:'lefts',
        	           	    handler: function(event, toolEl, panel){
        	           	    	if(!Ext.getCmp('rights').isVisible()){
        	           	    		Ext.getCmp('leftPanel').setWidth((document.body.clientWidth-270)/3);
	        	        	    	Ext.getCmp('centersPanel').setWidth((document.body.clientWidth-270)/3);
	        	        	    	Ext.getCmp('rightPanel').setWidth((document.body.clientWidth-270)/3);
	        	        	    	Factor.App.getPanelFactorPropertyControllerController().getFactorPropertyGrid().show();
	        	        	    	Factor.App.getPanelRelationPropertyControllerController().getRelationPropertyGrid().show();
	        	        	    	Ext.getCmp('rights').show();
        	           	    	}else{
	        	           	    	Ext.getCmp('leftPanel').setWidth((document.body.clientWidth-270)/3);
	        	        	    	Ext.getCmp('centersPanel').setWidth(30);
	        	        	    	Ext.getCmp('rightPanel').setWidth((document.body.clientWidth-270)/3*2-30);
	        	        	    	Factor.App.getPanelFactorPropertyControllerController().getFactorPropertyGrid().hide();
	        	        	    	Factor.App.getPanelRelationPropertyControllerController().getRelationPropertyGrid().hide();
	        	        	    	Ext.getCmp('lefts').hide();
	        	        	    	Ext.getCmp('rights').show();
        	           	    	}
        	           	    }
        	           	},{
        	           	    type:'right',
        	           	    id:'rights',
        	           	    tooltip: '向右收缩',
        	           	    handler: function(event, toolEl, panel){
        	           	    	if(!Ext.getCmp('lefts').isVisible()){
	        	           	    	Ext.getCmp('leftPanel').setWidth((document.body.clientWidth-270)/3);
	        	        	    	Ext.getCmp('centersPanel').setWidth((document.body.clientWidth-270)/3);
	        	        	    	Ext.getCmp('rightPanel').setWidth((document.body.clientWidth-270)/3);
	        	        	    	Factor.App.getPanelFactorPropertyControllerController().getFactorPropertyGrid().show();
	        	        	    	Factor.App.getPanelRelationPropertyControllerController().getRelationPropertyGrid().show();
	        	        	    	Ext.getCmp('lefts').show();
        	           	    	}else{
        	           	    		Ext.getCmp('leftPanel').setWidth((document.body.clientWidth-270)/3*2-30);
            	        	    	Ext.getCmp('centersPanel').setWidth(30);
            	        	    	Ext.getCmp('rightPanel').setWidth((document.body.clientWidth-270)/3);
            	        	    	Factor.App.getPanelFactorPropertyControllerController().getFactorPropertyGrid().hide();
            	        	    	Factor.App.getPanelRelationPropertyControllerController().getRelationPropertyGrid().hide();
            	        	    	Ext.getCmp('rights').hide();
            	        	    	Ext.getCmp('lefts').show();
        	           	    	}
        	           	    }
        	           	},],
//    	                collapsible: true,
    	                animCollapse: true,
        	            minSize: 100,
        	            maxSize: 500,
        	            items: [{
	        	            	xtype : 'factorPropertyGrid',
	        	            	id : 'factorPropertyGrid',
	        	            	title : '因子属性',
	        	            	split:true,
	            	            minSize: 100,
	            	            maxSize: 500,
	        	            	height : (document.body.clientHeight-69)/2,
	        	            	region: 'north'
	        	            },{
	        	            	xtype : 'relationPropertyGrid',
	        	            	id : 'relationPropertyGrid',
	        	            	height : (document.body.clientHeight-69)/2,
	        	            	title : '关系属性',
	        	            	split:true,
	            	            minSize: 100,
	            	            maxSize: 500,
	        	            	region: 'center'
	        	            }]
    				},{
        	            region: 'east', 
        	            layout : 'border',
        	            id:'rightPanel',
    					width :(document.body.clientWidth-270)/3,
        	            border: false,
        	            split: true,
    	                collapsible: true,
    	                animCollapse: true,
        	            minSize: 100,
        	            maxSize: 500,
        	            items: [{
	        	            	xtype : 'factorDataGrid',
	        	            	id : 'factorDataGrid',
	        	            	title : '因子数据区',
	        	            	split:true,
	            	            minSize: 100,
	            	            maxSize: 500,
	        	            	height : (document.body.clientHeight-69)/2,
	        	            	region: 'north'
	        	            },{
	        	            	xtype : 'relationDataGrid',
	        	            	id : 'relationDataGrid',
	        	            	title : '关系数据区',
	        	            	split:true,
	            	            minSize: 100,
	            	            maxSize: 500,
	        	            	height : (document.body.clientHeight-69)/2,
	        	            	region: 'center'
	        	            }]
    				}]
	       }, {
           	xtype     : 'textareafield',
        	id		  : 'message',
            region: 'south',
            split: true,
            height: 25,
            minSize: 100,
            maxSize: 200,
            collapsible: true,
            collapsed: true
        }],
	        renderTo: Ext.getBody()
	    });
		Ext.getCmp('cmpt-toolbar-titleToolbar_insertBtn').hide();
//		Ext.getCmp('cmpt-toolbar-titleToolbar_importBtn').hide();
		Ext.getCmp('cmpt-toolbar-titleToolbar_exportBtn').hide();
		/*截获键盘事件*/
		window.pressDel = function(){
			Ext.getCmp('titleToolbar').callback.remove();
//			alert('asdf');
		};
		new Ext.KeyMap(Ext.getBody(), [{
				key : Ext.EventObject.DELETE,
				ctrl : false,
				shift : false,
				fn :window.pressDel
		}]);
		
	}
});

});
Ext.define("Factor.controller.Base", {
	extend : "Ext.app.Controller",
	
    fnReturnFalse : function(){
    	return false;
    },

	/* store的record数据，提取出来放到数组中 */
	getDataFromRecord : function(records) {
		var data = [];
		for ( var i = 0; i < records.length; i++) {
			var record = records[i];
			data.push(record.data);
		}
		return data;
	},

	showMenu : function(e, items) {
		e.preventDefault();
		e.stopEvent();
		new Ext.menu.Menu({
			floating : true,
			items : items
		}).showAt(e.getXY());
	}
});
//左下角切换标签
function propertyGridActivity(){
	Ext.getCmp('formPanel').setActiveTab(0);
	Ext.getCmp('leftTreePanel').setWidth(250);
	Ext.getCmp('factorTree').setHeight((document.body.clientHeight-60)/2);
	Ext.getCmp('formPanel').setSize(250,(document.body.clientHeight-60)/2);
}
function relationUpload(){
	if(Ext.getCmp('saveButton')!=undefined)
		Ext.getCmp('saveButton').destroy( );
		if(AddfileForm!=undefined)
		AddfileForm.close();
		var FileRname = new Ext.form.TextField({
			name : 'FileRname',
			fieldLabel : '文件名',
			allowBlank : false,
			emptyText : '发布用于显示的文件名',
			anchor:'95%'
		});
		var AddfileForm=new Ext.FormPanel(
		{
			name : 'AddfileForm',
			id:'AddfileForm',
			frame : true,
			labelWidth : 90,
			url : '../../../work-platform/uploadRelation.do',
			fileUpload : true,
			width : 420,
			autoDestroy : true,
			bodyStyle : 'padding:0px 10px 0;',
			items : [{
						id:'fileName',
						xtype : 'filefield',
						emptyText : '选择上传文件',
						fieldLabel : '文件',
						name : 'upfile',
						buttonText : '',
						anchor : '95%',
						buttonText: 'Select excel...',
						listeners : {
							'change':function(fb,v){
								var allowfiletype='.xls';
								var temp = v.replace(
										/^.*(\.[^\.\?]*)\??.*$/, '$1');
								var temp1 = temp.toLocaleLowerCase();
								if (allowfiletype.indexOf(temp1) != -1) {
									FileRname.setValue(v.replace(/^.+?\\([^\\]+?)(\.[^\.\\]*?)?$/gi,"$1"));
									Ext.getCmp('saveButton').setDisabled(false);
								} else {
									Ext.getCmp('saveButton').setDisabled(true);
									Ext.getCmp('fileName').setValue("");
									FileRname.setValue("");
									Ext.Msg.alert("错误","不允许选择该类型文件，请重新选择！");
								}
							}
						}
					}]
		});
		var AddfileWin=new Ext.Window(
		{
			name : 'AddfileWin',
			width : '450',
			height : '180',
			layout : 'fit',
//			closeAction : 'close',
			closeable:false,
			title : '上传文件',
			buttonAlign : 'center',
			resizable : false,
			modal : true,
			autoDestroy : true,
			items : AddfileForm,
			buttons :[{
						text : '保存',
						id:'saveButton',
						disabled:true,
						handler : function() {
							if (AddfileForm.getForm().isValid()) {
								Ext.MessageBox.show({
									title : '请稍等...',
									msg : '文件上传中...',
									progressText : '',
									width : 300,
									progress : true,
									closable : false,
									animEl : 'loding'
								});

								AddfileForm.getForm().submit(
										{
											params:{
												factorChildren:Ext.encode(factorChildren),
												relationChildren:Ext.encode(RelationChildren)
											},
											success : function(form, action) {
												var Result = action.result.flag;
												if (Result != 0) {
													var relations=action.result.message;
													for(var i=0;i<relations.length;i++){
														var r=action.result.message[i];
														console.log("因子1："+r["1"]+"因子2:"+r['2']);
														/*var isLast=false;
														if(i==relations.length-1){
															isLast=true;
														}
														onItemUpload(r["1"],r["2"],isLast);*/
													}
//													Ext.MessageBox.alert("提示",action.result.message);
													Ext.getCmp('saveButton').destroy( );
													AddfileForm.close();
													AddfileWin.close();
												} else if (Result == 0) {
//													Ext.MessageBox.alert("提示",action.result.message);
//													ds.load({
//														params : {
//															start : start,
//															limit : limit
//														}
//													});
													AddfileForm.getForm().reset();
												}
											},
											failure : function(form, action) {
												var Result = action.result.flag;
												Ext.MessageBox.alert("提示",action.result.message);
											}
										});
							}
						}
					}, {
						text : '重置',
						handler : function() {
							AddfileForm.getForm().reset();
						}
					}, {
						text : '关闭',
						handler : function() {
							Ext.getCmp('saveButton').destroy( );
							AddfileForm.close();
							AddfileWin.close();
						}
					} ]
		});
		AddfileWin.show();

}
/**
 * 新建因子关系
 * @param factor1Value
 * @param factor2Value
 */
function onItemUpload(factor1Value,factor2Value,isLast){
	var store=Factor.App.getPanelFactorPropertyGridControllerController().getFactorProperty().getStore();
	var factor1Uuid='',factor2Uuid='';
	var factorStore=Factor.App.getPanelFactorControllerController().getFactorGrid().getStore();
	for(var i=0;i<factorStore.getCount();i++){
		var record=factorStore.getAt(i);
		if(factor1Value===record.get('uuid')||factor1Value===record.get('name')){
//		        							factor1Uuid=store.getAt(0).get('value');
			factor1Uuid=record.get('uuid');
		}
		if(factor2Value===record.get('uuid')||factor2Value===record.get('name')){
//		        							factor2Uuid=store.getAt(1).get('value'); 
			factor2Uuid=record.get('uuid'); 
		}
	}
	if(''!==factor1Uuid&&''!==factor2Uuid){
		var record={childs: RelationChildren,
				factor1Name: "",
				factor1Uuid: factor1Uuid,
				factor2Name: "",
				factor2Uuid: factor2Uuid,
				seq: "",
				type: 0,
				uuid: ""
		};
		Factor.App.getPanelRelationControllerController().saveRelation(store,record);
	}else if(''===factor1Uuid&&''!==factor2Uuid){
		var record={
				defineUuid:'', 
				measure:'', 
				width:8, 
				createLevel:1, 
				label:'', 
				relationUuid:'', 
				format:'85806344e6354482822f28ff055bcdd0', 
				prototype:0, 
				dataType:1, 
				decimalWidth:0, 
				valueLabelUuid:'', 
				name:factor1Value, 
				value:'', 
				seq:Factor.App.getPanelFactorControllerController().getFactorStoreStore().getCount()>0?(Factor.App.getPanelFactorControllerController().getFactorStoreStore().getAt(Factor.App.getPanelFactorControllerController().getFactorStoreStore().getCount()-1).get('seq')+1024):0, 
				role:'', 
				childs:factorChildren
		};
		Ext.Ajax.request({ 
			url: '../work-platform/importFactor.do',
			params: {
				record : Ext.encode(record),
			},
			success: function(response, options) {
				var result = Ext.JSON.decode(response.responseText); 
				var record2={childs: RelationChildren,
        				factor1Name: "",
        				factor1Uuid: result.uuid,
        				factor2Name: "",
        				factor2Uuid: factor2Uuid,
        				seq: "",
        				type: 0,
        				uuid: ""
				};
				if(isLast){
					Factor.App.getPanelRelationControllerController().saveRelation(store,record2);
					
					Factor.App.getPanelFactorControllerController().getFactorGrid().getStore().reload();
					factor1Store.reload();
					factor2Store.reload();
					Factor.App.getTreeFactorTreeControllerController().getFactorTreeStoreStore().load();
				}
			}
		});
	}else if(''!==factor1Uuid&&''===factor2Uuid){
		var record={
				defineUuid:'', 
				measure:'', 
				width:8, 
				createLevel:1, 
				label:'', 
				relationUuid:'', 
				format:'85806344e6354482822f28ff055bcdd0', 
				prototype:0, 
				dataType:1, 
				decimalWidth:0, 
				valueLabelUuid:'', 
				name:factor2Value, 
				value:'', 
				seq:Factor.App.getPanelFactorControllerController().getFactorStoreStore().getCount()>0?(Factor.App.getPanelFactorControllerController().getFactorStoreStore().getAt(Factor.App.getPanelFactorControllerController().getFactorStoreStore().getCount()-1).get('seq')+1024):0, 
				role:'', 
				childs:factorChildren
		};
		Ext.Ajax.request({ 
			url: '../work-platform/importFactor.do',
			params: {
				record : Ext.encode(record),
			},
			success: function(response, options) {
				var result = Ext.JSON.decode(response.responseText); 
				var record2={childs: RelationChildren,
        				factor1Name: "",
        				factor1Uuid: factor1Uuid,
        				factor2Name: "",
        				factor2Uuid: result.uuid,
        				seq: "",
        				type: 0,
        				uuid: ""
				};
				if(isLast){
					Factor.App.getPanelRelationControllerController().saveRelation(store,record2);
					
					Factor.App.getPanelFactorControllerController().getFactorGrid().getStore().reload();
					factor1Store.reload();
					factor2Store.reload();
					Factor.App.getTreeFactorTreeControllerController().getFactorTreeStoreStore().load();
				}
			}
		});
	}else if(''===factor1Uuid&&''===factor2Uuid){
		var record={
				defineUuid:'', 
				measure:'', 
				width:8, 
				createLevel:1, 
				label:'', 
				relationUuid:'', 
				format:'85806344e6354482822f28ff055bcdd0', 
				prototype:0, 
				dataType:1, 
				decimalWidth:0, 
				valueLabelUuid:'', 
				name:factor1Value, 
				value:'', 
				seq:Factor.App.getPanelFactorControllerController().getFactorStoreStore().getCount()>0?(Factor.App.getPanelFactorControllerController().getFactorStoreStore().getAt(Factor.App.getPanelFactorControllerController().getFactorStoreStore().getCount()-1).get('seq')+1024):0, 
				role:'', 
				childs:factorChildren
		};
		Ext.Ajax.request({ 
			url: '../work-platform/importFactor.do',
			params: {
				record : Ext.encode(record),
			},
			success: function(response, options) {
				var result = Ext.JSON.decode(response.responseText); 
				factor1Uuid=result.uuid;
				var record3={
						defineUuid:'', 
						measure:'', 
						width:8, 
						createLevel:1, 
						label:'', 
						relationUuid:'', 
						format:'85806344e6354482822f28ff055bcdd0', 
						prototype:0, 
						dataType:1, 
						decimalWidth:0, 
						valueLabelUuid:'', 
						name:factor2Value, 
						value:'', 
						seq:Factor.App.getPanelFactorControllerController().getFactorStoreStore().getCount()>0?(Factor.App.getPanelFactorControllerController().getFactorStoreStore().getAt(Factor.App.getPanelFactorControllerController().getFactorStoreStore().getCount()-1).get('seq')+1024):0, 
						role:'', 
						childs:factorChildren
				};
				Ext.Ajax.request({ 
					url: '../work-platform/importFactor.do',
					params: {
						record : Ext.encode(record3),
					},
					success: function(response, options) {
						var result = Ext.JSON.decode(response.responseText); 
						var record2={childs: RelationChildren,
		        				factor1Name: "",
		        				factor1Uuid: factor1Uuid,
		        				factor2Name: "",
		        				factor2Uuid: result.uuid,
		        				seq: "",
		        				type: 0,
		        				uuid: ""
						};
						if(isLast){
							Factor.App.getPanelRelationControllerController().saveRelation(store,record2);
							
							Factor.App.getPanelFactorControllerController().getFactorGrid().getStore().reload();
							factor1Store.reload();
							factor2Store.reload();
							Factor.App.getTreeFactorTreeControllerController().getFactorTreeStoreStore().load();
						}
					}
				});
			}
		});
	}
}
/**
 * 设置属性值
 * @param value
 */
function saveValue(value){
	var gridId=CurrentGridRecord,
	instUuid=CurrentRecordInstUuid,
	defineUuid=CurrentRecordDefineUuid;	
	Ext.Ajax.request({ 
		url: '../work-platform/updateValue.do',
		params: {
			factorUuid :instUuid,
			value : value
		},
		success: function(response, options) {
			if("Factor"===gridId){
				
			}else if("FactorProperty"===gridId){
				Factor.App.getPanelFactorPropertyControllerController().getFactorPropertyGrid().getSelectionModel().selectionStart.data['value']=value;
			}else if("Relation"===gridId){
				
			}else if("FactorRelationProperty"===gridId){
				
			}
		}
	});
}
function setFactorPropertyInputGrid(valueLabelUuid,value){
	if(''!==valueLabelUuid){
		reloadParams(valueLabelUuid);
		Ext.getCmp('triggerfield-triggerfield').setVisible(true);
		Ext.getCmp('triggerfield-numberfield').setVisible(false);
		Ext.getCmp('triggerfield-combo').setVisible(true);
		Ext.getCmp('triggerfield-textfield').setVisible(false);
		Ext.getCmp('triggerfield-datefield').setVisible(false);
		Ext.getCmp('triggerfield-combo').setValue(value);
	}else{
		var type=format2DataType(Ext.getCmp('factorProperty').getStore().getAt(1).get('value'));
		switch(type){
		case 1:
			Ext.getCmp('triggerfield-triggerfield').setVisible(true);
			Ext.getCmp('triggerfield-numberfield').setVisible(true);
			Ext.getCmp('triggerfield-combo').setVisible(false);
			Ext.getCmp('triggerfield-textfield').setVisible(false);
			Ext.getCmp('triggerfield-datefield').setVisible(false);
			Ext.getCmp('triggerfield-numberfield').setValue(value);
			break;
		case 2:
			Ext.getCmp('triggerfield-triggerfield').setVisible(true);
			Ext.getCmp('triggerfield-numberfield').setVisible(false);
			Ext.getCmp('triggerfield-combo').setVisible(false);
			Ext.getCmp('triggerfield-textfield').setVisible(true);
			Ext.getCmp('triggerfield-datefield').setVisible(false);
			Ext.getCmp('triggerfield-textfield').setValue(value);
			break;
		case 3:
			Ext.getCmp('triggerfield-triggerfield').setVisible(true);
			Ext.getCmp('triggerfield-numberfield').setVisible(false);
			Ext.getCmp('triggerfield-combo').setVisible(false);
			Ext.getCmp('triggerfield-textfield').setVisible(false);
			Ext.getCmp('triggerfield-datefield').setVisible(true);
			Ext.getCmp('triggerfield-datefield').setValue(value);
			break;
		}
	}
}
/**
 * 重新加载值标签对应的名值对
 * @param valueLabelUuid
 */
function reloadParams(valueLabelUuid){
	ValueLabel.App.getController('ValueLabelController').
	getValueLabel(valueLabelUuid, function(response){
		this.valueLableCache[valueLabelUuid] = Ext.decode(response.responseText);
		var labels = this.valueLableCache[valueLabelUuid];
		var data = [];
		
		Ext.Array.each(labels, function(item){
			data.push({
				value:item.value,
				label:item.label
			});
		});
		
		store = Ext.create('Ext.data.Store', {
			fields: ['value', 'label'],
		     data : data
		});
		
		Ext.getCmp('triggerfield-combo').bindStore(store);
	});
}
/**
 * 最大化窗口
 * @param CurrentMaxTable
 */
function MaxGrid(CurrentMaxTable){
	var widths=270;
	 if(Ext.getCmp('formPanel').getActiveTab().id==='dataFilterForm'){
		 widths=440;
	 }
	switch(CurrentMaxTable){
		case 1:
	    	Ext.getCmp('leftPanel').setWidth(document.body.clientWidth-widths);
	    	Ext.getCmp('centersPanel').setWidth(0);
	    	Ext.getCmp('rightPanel').setWidth(0);
	    	Factor.App.getPanelFactorControllerController().getFactorGrid().setHeight(document.body.clientHeight-69);
	    	Factor.App.getPanelFactorControllerController().getFactorGrid().setWidth('100%');
			break;
		case 2:
	    	Ext.getCmp('leftPanel').setWidth(0);
	    	Ext.getCmp('centersPanel').setWidth(document.body.clientWidth-widths);
	    	Ext.getCmp('rightPanel').setWidth(0);
	    	Factor.App.getPanelFactorPropertyControllerController().getFactorPropertyGrid().setHeight(document.body.clientHeight-69);
	    	Factor.App.getPanelFactorPropertyControllerController().getFactorPropertyGrid().setWidth('100%');
			break;
		case 3:
	    	Ext.getCmp('leftPanel').setWidth(0);
	    	Ext.getCmp('centersPanel').setWidth(0);
	    	Ext.getCmp('rightPanel').setWidth(document.body.clientWidth-widths);
	    	Factor.App.getPanelFactorDataControllerController().getFactorDataGrid().setHeight(document.body.clientHeight-69);
	    	Factor.App.getPanelFactorDataControllerController().getFactorDataGrid().setWidth('100%');
			break;
		case 4:
			Factor.App.getPanelFactorControllerController().getFactorGrid().setHeight(0);
	    	Ext.getCmp('leftPanel').setWidth(document.body.clientWidth-widths);
	    	Ext.getCmp('centersPanel').setWidth(0);
	    	Ext.getCmp('rightPanel').setWidth(0);
	    	Factor.App.getPanelRelationControllerController().getRelationGrid().setHeight(document.body.clientHeight-69);
	    	Factor.App.getPanelRelationControllerController().getRelationGrid().setWidth('100%');
			break;
		case 5:
			Factor.App.getPanelFactorPropertyControllerController().getFactorPropertyGrid().setHeight(0);
	    	Ext.getCmp('leftPanel').setWidth(0);
	    	Ext.getCmp('centersPanel').setWidth(document.body.clientWidth-widths);
	    	Ext.getCmp('rightPanel').setWidth(0);
	    	Factor.App.getPanelRelationPropertyControllerController().getRelationPropertyGrid().setHeight(document.body.clientHeight-69);
	    	Factor.App.getPanelRelationPropertyControllerController().getRelationPropertyGrid().setWidth('100%');
			break;
		case 6:
	    	Ext.getCmp('leftPanel').setWidth(0);
	    	Ext.getCmp('centersPanel').setWidth(0);
	    	Ext.getCmp('rightPanel').setWidth(document.body.clientWidth-widths);
	    	Factor.App.getPanelFactorDataControllerController().getFactorDataGrid().setHeight(0);
	    	Factor.App.getPanelRelationDataControllerController().getRelationDataGrid().setHeight(document.body.clientHeight-69);
	    	Factor.App.getPanelRelationDataControllerController().getRelationDataGrid().setWidth('100%');
			break;
	}
}

/**
 * 根据传进来的store和defineUuid来确认combo中是输入的值还是通过下拉选择的值
 * @param store
 * @param defineUuid
 * @param value 在store中存的名字
 */
function getDefineUuid(store,defineUuid,value){
	for(var i=0;i<store.getCount();i++){
		var record=store.getAt(i);
		if(defineUuid===record.get(value)){
			return defineUuid;
		}
	}
	var uuid=new UUID().id;
	addDefaultRelationFactor(uuid,defineUuid);
	return uuid;
}
/**
 * 当新建关系时，如果没有对应因子，则新建因子
 * @param defineUuid
 * @param factorName
 */
function addDefaultRelationFactor(defineUuid,factorName){
	
	var record={
			defineUuid:defineUuid, 
			measure:'', 
			width:8, 
			createLevel:1, 
			label:'', 
			relationUuid:'', 
			format:'85806344e6354482822f28ff055bcdd0', 
			prototype:0, 
			dataType:1, 
			decimalWidth:0, 
			valueLabelUuid:'', 
			name:factorName, 
			value:'', 
			seq:Factor.App.getPanelFactorControllerController().getFactorStoreStore().getCount()>0?(Factor.App.getPanelFactorControllerController().getFactorStoreStore().getAt(Factor.App.getPanelFactorControllerController().getFactorStoreStore().getCount()-1).get('seq')+1024):0, 
			role:'', 
			childs:factorChildren
	};
	
	// http request 保存
	Ext.Ajax.request({ 
		url: '../work-platform/importFactor.do',
		params: {
			record : Ext.encode(record),
		},
		success: function(response, options) {
			var result = Ext.JSON.decode(response.responseText); 
			if(result.duplicate){
				Ext.Msg.alert('','名称重复');
				return;
			}
			Factor.App.getPanelFactorControllerController().getFactorGrid().getStore().reload();
			factor1Store.reload();
			factor2Store.reload();
			Factor.App.getTreeFactorTreeControllerController().getFactorTreeStoreStore().load();
		}
	});
}


/**
 * 格式转化成数据类型
 * @param format
 * @returns {Number}
 * 
 */
function format2DataType(format){
	var dateType = 1;
	if(COLUMNTYPE_DECIMAL===format
			||COLUMNTYPE_POINT===format
			||COLUMNTYPE_COMMA ===format
			||COLUMNTYPE_CURRENCY ===format
			||COLUMNTYPE_DOLLAR ===format
			||COLUMNTYPE_SCIENTIFIC  ===format
			||COLUMNTYPE_LIMIT  ===format
			){
		dateType=1;
	}else if(COLUMNTYPE_DATE_1 ===format
			||COLUMNTYPE_DATE_2 ===format
			||COLUMNTYPE_DATE_3  ===format
			||COLUMNTYPE_DATE_4  ===format
			||COLUMNTYPE_DATE_5   ===format){
		dateType=3;
	}else{
		dateType=2;
	}
	return dateType;
}
/**
 * 生成随机数
 * @param l
 * @returns {String}
 */
function randomChar(l) {
	 var x="123456789poiuytrewqasdfghjklmnbvcxzQWERTYUIPLKJHGFDSAZXCVBNM";
	 var tmp="";
	 for(var i=0;i< l;i++) {
		 tmp += x.charAt(Math.ceil(Math.random()*100000000)%x.length);
	 }
	 return tmp;
}
function setGlobleVariate(GridId,Uuid,defineUuid){
	CurrentGridRecord=GridId;
	CurrentRecordInstUuid=Uuid;
	CurrentRecordDefineUuid=defineUuid;
}
