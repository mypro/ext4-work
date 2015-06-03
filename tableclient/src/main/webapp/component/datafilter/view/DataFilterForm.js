var OPERATOR=0;
var LEFTBRACKET=1;
var RIGHTBRACKET=2;
var LOGICAL=3;
var conditionStoreMap = {};
Ext.define('conditionParamList',{
    extend: 'Ext.data.Model',
    fields: [
       {name: 'uuid'},
       {name: 'conditionKeyword'},
       {name: 'conditionName'},
       {name: 'conditionType'}
    ],
    idProperty: 'uuid'
});
var createConditionStore = function(conditionType){
	conditionStoreMap[conditionType] = new Ext.data.Store(
			{
				id : 'conditionStore'+conditionType,
				xtype : 'store',
				model : 'conditionParamList',
				autoLoad : true,
				proxy : {
					type : 'ajax',
					url : '../../../work-platform/conditionList.do?base=true&&conditionType='+conditionType,
					actionMethods : {
						read : 'POST'
					}
				}
			});
};
var getConditionStore = function(conditionType){
	return conditionStoreMap[conditionType];
};

var getConditionNameByUuid = function(conditionType, conditionKeyword){
	var store = getConditionStore(conditionType);
	if(!store){
		return "";
	}
	
	for ( var i = 0; i < store.totalCount; i++) {
		var data = store.getAt(i).data;
		if (data.conditionKeyword === conditionKeyword) {
			return data.conditionName;
		}
	}
};
createConditionStore(OPERATOR);
createConditionStore(LEFTBRACKET);
createConditionStore(RIGHTBRACKET);
createConditionStore(LOGICAL);
var columnStore=Ext.create('DataFilter.store.ColumnStore',{
	id:'columnStore'
});
var columnStore2=Ext.create('DataFilter.store.ColumnStore',{
	id:'columnStore2'
});
Ext.define('DataFilter.view.DataFilterForm',{
    extend: 'Ext.form.Panel',
    alias : 'widget.dataFilterForm',
    
    initComponent : function(){
    	FORM_ID=this.id;
    	var idPrefix = 'cmpt-missing-datafilter_';
    	var conditionValue={
        		id:'ConditionValue',
	            xtype:"textfield",
	            width:100
        	};
    	this.items = Ext.create('Ext.form.Panel',{
    		id:         idPrefix+'form',
    		layout: 	'absolute',
	        defaultType:'textfield',
	        border: 	false,
	        width: 		413,
	        padding:'0 0 5 0',
//	        height:		200,
	        margin:2,
	        items: [{xtype:'textfield',
	        		 id:'queryUuid',
	        		 hidden:true},{
	        	 x:0,
	        	 y:2,
	        	 id:'dsKeyword',
	        	 xtype: 'combo',
	        	 labelWidth:58,
	        	 width:200,
	             fieldLabel: '数据源',
	        },{
	        	 x:210,
	        	 y:2,
	        	 id:'dbKeyword',
	        	 xtype: 'combo',
	        	 labelWidth:58,
	        	 width:200,
	             fieldLabel: '数据库',
	        },{
	        	 x:0,
	        	 y:29,
	        	 id:'tableKeyword',
	        	 xtype: 'combo',
	        	 labelWidth:58,
	        	 width:200,
	             fieldLabel: '表名',
	             editable: false,
                valueField : "uuid",
				displayField : "name",
				editable : false,
                store: Ext.create('DataFilter.store.TableStore'),
                listeners:{
					'change':function(combotbl, newvar, oldvar){
						Ext.getCmp('valueKeyword').setValue('');
						Ext.getCmp('resultField').setValue('');
						Ext.getCmp('conditionGrid').getStore().removeAll();
						var r=Ext.create('DataFilter.model.ConditionModel',{
					    	'uuid':'',
					        'seq':0,
					        'leftbracket':'',
					        'columnKeyword':'',
					        'operator':'',
					        'columnValue':'',
					        'rightbracket':'',
					        'logical':''
					    	});
						Ext.getCmp('conditionGrid').getStore().insert(0, r);
						columnStore.load({
			        			params:{
			        					uuid : combotbl.value
			        			}
			            	});
						columnStore2.load({
							params:{
								uuid : combotbl.value
							}
						});
					}
                }
	        }, {
	        	xtype:'combo',
	        	 x:210,
	        	 y:29,
	        	 id:'valueKeyword',
	        	 labelWidth:58,
	        	 width:200,
	             fieldLabel: '值字段',
	             store : columnStore,
 				valueField : "keyword",
 				displayField : "name",
 				renderer:function(value,metadata,record){  
 					return 'qwe';
 					},
 				mode : 'remote',
 				triggerAction : 'all',
 				queryMode: 'local',
 				allowBlank : false
	        },{
	        	id:'resultField',
	        	 x:0,
	        	 y:55,
	        	 xtype: 'combo',
	        	 labelWidth:58,
	        	 width:410,
	             fieldLabel: '显示字段',
	             store : columnStore2,
 				valueField : "keyword",
 				displayField : "name",
 				mode : 'remote',
 				triggerAction : 'all',
 				allowBlank : false,
 				multiSelect:true,
 			 	editable : false
	        },Ext.create('DataFilter.view.ConditionView',{
	        	x:0,
	        	y:83,
	        	height:180,
            	id:'conditionGrid',
            	store:Ext.create('DataFilter.store.ConditionGridStore', {
            		id : 'cmpt-conditionGrid-conditionGridStore'
                })
            }),/*{
	        	x:10,
	        	y:95,
	            xtype: 'fieldset',
	            title: '选择要添加的关系',
	            defaultType: 'textfield',
	            defaults: {
	                width:355
	            },
	            items: [{
	    	        	x:   	10,
	    	            y: 		95,
	    	            xtype:	"radio",
	    	            id:'RelationAnd',
	    	           name:	"relation",
	    	           checked: true,
	    	           boxLabel:"和关系",
	            	},{
	    	        	x: 10,
	    	            y: 125,
	    	            xtype:"radio",
	    	            id:'RelationOr',
	    	           name:"relation",
	    	           boxLabel:"或关系",
	            	},{
	    	        	xtype: 'fieldcontainer',
	    	            combineErrors: true,
	    	            x: 10,
	    	            y: 155,
//	    	            disabled:true,
	    	            layout: 'hbox',
	    	            items: [{
	    	            	id:'RelationMoreover',
		    	            xtype:"radio",
		    	           name:"relation",
		    	           padding:'0 3 0 0'
		            	},{
		            		id:'ConditionColumn',
		            		emptyText:'字段名',
		    	            xtype:"combo",
		    	            width:100,
		    	            store : columnStore,
		    				valueField : "keyword",
		    				displayField : "keyword",
		    				mode : 'remote',
		    				triggerAction : 'all',
		    				allowBlank : false,
		    				editable : false,
		                    listeners:{
		    					'change':function(combotbl, newvar, oldvar){
		    						var type=combotbl.displayTplData[0].type;
		    						if(COLUMNTYPE_DATE_1===type||COLUMNTYPE_DATE_2===type||COLUMNTYPE_DATE_3===type){
		    							Ext.getCmp('ConditionValue').hide();
		    							Ext.getCmp('ConditionValue2').show();
		    						}else{
		    							Ext.getCmp('ConditionValue').show();
		    							Ext.getCmp('ConditionValue2').hide();
		    						}
		    					}
		                    }
		            	},{
		            		id:'Condition',
		            		emptyText:'条件',
		    	            xtype:"combo",
		    	            width:100,
		    	            store : Ext.create('DataFilter.store.ConditionStore'),
		    				valueField : "abbr",
		    				displayField : "name",
		    				mode : 'remote',
		    				triggerAction : 'all',
		    				allowBlank : false,
		    				editable : false
		            	},{
		            		id:'ConditionValue',
		    	            xtype:"textfield",
		    	            width:100
		            	},{
			        		id:'ConditionValue2',
				            xtype:"datefield",
				            width:100,
				            hidden:true
			        	}]
	            	}
	            ]
	        },*//*{
	        	x:10,
	        	y:200,
	            xtype: 'button',
	            text : '增加条件',
	            action:'addCondition'
	        },{
	        	x:80,
	        	y:200,
	            xtype: 'button',
	            text : '删除条件',
	            action:'deleteCondition'
	        },{
	        	x:10,
	        	y:230,
	        	width:390,
	        	height:300,
	        	id:'conditionTree',
	        	autoRender:true,
	        	xtype:'treepanel',
	        	store:Ext.create('DataFilter.store.ConditionTreeStore')
	        },*/{
	        	x:243,
	        	y:267,
	            xtype: 'button',
	            text : '保存查询条件',
	            action:'saveCondition'
	            
	        },{
	        	x:343,
	        	y:267,
	            xtype: 'button',
	            text : '执行查询',
	            action:'execCondition'
	        }]
    	});
    	
    	this.title = "数据查询";
//    	this.layout = 'fit';
//    	this.plain = true;
    	/*this.buttons = [{
    		action:    'save',
    		id:			idPrefix+'saveBtn',
            text: 		'保存查询条件'
        },{
            text: '执行查询',
//            handler: function(){ Ext.getCmp(winId).close();}
        }];*/
    	
    	this.callParent(arguments);
    }
});