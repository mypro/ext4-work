Ext.define('FDW.view.DefineWindow',{
    extend: 'Ext.Window',
    alias : 'widget.factorDefineWindow',
    
    callback : {},
    
    initComponent : function(){
    	var me = this;
    	
    	var winId = me.id;
    	var idPrefix = 'cmpt-factordefine-'+winId+'_';

     	me.width = 470;
     	me.height = 370;
     	me.plain = true;
     	me.modal = true;
     	me.closeAction = 'hide';
     	me.layout = 'column';
     	me.defaults = {
            anchor: '100%'
        };
     	me.listeners = {
     			'close':function(){
     				me.hide();
     			}
     	};
     	me.items = [{
	        xtype: 'form',
	        id: idPrefix+'factorForm',
	        bodyStyle:'padding:5px 5px 5px 5px;',  
            labelWidth :60, 
            width :450,
	        height: 350,
            border:false,  
            defaults: {anchor : "100%"},  
	        items : [{
	        	xtype : 'tabpanel',
	        	id : idPrefix+'tabpanel',
	        	activeTab : 0,
	        	border:false,  
	        	defaults:{
	                bodyPadding: 10,
	                layout: 'anchor'
	            },
	            tabBar : {
        	    	height : 30,
        	    	defaults : {
        	    		height : 30
        	    	}
        	    },
	            items:[{
	            	title:'基本信息',
	            	defaultType: 'textfield',
	            	id: idPrefix+'factorInfoForm',
	                defaults: {
	                    anchor: '100%'
	                },
	                border:false,  
	                height : 250,
	                items:[{
	                    id : idPrefix+'factor-uuid',
	                    value : '',
	                    hidden: true
	                },{
	                    id : idPrefix+'factor-defineUuid',
	                    value : '',
	                    hidden: true
	                },{
					    fieldLabel: '名称',
					    id :  idPrefix+'factor-name',
					    allowBlank: false,
					    value: ''
					},{
	                    id :  idPrefix+'factor-dataType',
	                    xtype : 'numberfield',
	                    hidden: true
					},{
	                    id :  idPrefix+'factor-format',
	                    xtype : 'numberfield',
	                    hidden: true
					},{
						fieldLabel: '数据类型',
						xtype : 'triggerfield',
						triggerCls : 'x-form-my-trigger',
						id : idPrefix+'factor-typeShow',
						editable : false,
						value : '数值',
//						onTriggerClick : Factor.App.getController('window.FactorWindowController')
//										.clickDataType
					},{
					    fieldLabel: '宽度',
					    xtype : 'numberfield',
					    id :  idPrefix+'factor-width',
					    allowBlank: true,
					    value: ''
        			},{
					    fieldLabel: '小数宽度',
					    xtype : 'numberfield',
					    id :  idPrefix+'factor-decimalWidth',
					    allowBlank: true,
					    value: ''
					},{
					    fieldLabel: '值标签',
					    id :  idPrefix+'factor-valueLabelUuid',
					    xtype : 'triggerfield',
						triggerCls : 'x-form-my-trigger',
					    allowBlank: true,
					    value: '',
				    	editable : false,
//						onTriggerClick : Factor.App.getController('panel.ValueLabelController')
//										.clickValueLable
					}],
					buttons: [{
			            text: '保存',
			            action : 'save',
			            id : idPrefix+'factorSaveButton',
			            height : 23
					},{
			            text: '取消',
			            action : 'cancel',
			            id : idPrefix+'factorCancelButton',
			            height : 23
					}]
	            },{
	            	title:'变量类型',
	            	id:idPrefix+'dataType-panel',
	            	layout: 'absolute',
	            	defaults: {
	                    anchor: '100%'
	                },
	            	border:false,
	            	width:400,
	            	height: 250,
	            	defaultType: 'radio',
	            	items:[{
		        		xtype: 'radiogroup',
		        		id:idPrefix+'datatypeRadio',
		                columns: 1,
		                x:5,
		                y:10,
		                items:[
								{boxLabel: '数值(N)', name: idPrefix+'dataTypeRadio',inputValue: 1,checked: true}, 
								{boxLabel: '逗号(C)',name: idPrefix+'dataTypeRadio',inputValue: 2},
								{boxLabel: '点(D)',name: idPrefix+'dataTypeRadio',inputValue: 3 },
								{boxLabel: '科学计数法(S)',name: idPrefix+'dataTypeRadio',inputValue: 4},
								{boxLabel: '日期(A)', name: idPrefix+'dataTypeRadio',inputValue: 9},
								{boxLabel: '美元(L)',name: idPrefix+'dataTypeRadio',inputValue: 5},
								{boxLabel: '设定货币(U)', name: idPrefix+'dataTypeRadio',inputValue: 6},
								{boxLabel: '字符串(R)', name: idPrefix+'dataTypeRadio',inputValue: 7},
								{boxLabel: '受限数值(具有前导零的整数)(E)', name:idPrefix+'dataTypeRadio',inputValue: 8}   
		                ]
	            	},{fieldLabel: '长度',fieldWidth: 10,xtype: 'numberfield',x: 185,y: 65,value:8,id:idPrefix+'datatype-width',labelWidth:35},
			          {fieldLabel: '小数', fieldWidth: 10,xtype: 'numberfield',x: 185,y: 95,value:0,id:idPrefix+'datatype-decimals',labelWidth:35},
			          {
			        	  	fieldLabel: '日期格式',
			            	xtype: 'combo',
			            	id:idPrefix+'datatype-date',
			            	editable: false,
			                emptyText: "请选择...",
			                valueField: "abbr",
			                displayField: "name",
			                mode: 'local',
			                x: 185,y: 65,
			                labelWidth:60,
			                width : 200,
//			                store: aligns,
			                allowBlank: true,
			                hidden:true
			            }],
	            	buttons: [{
			            text: '确定',
//			            handler: Factor.App.getController('window.FactorWindowController')
//								.clickTypeSave
					}]
	            },{
	            	title:'值标签',
	            	layout: 'absolute',
	            	id : idPrefix+'valueLabel-panel',
	            	border:false,
	            	width:400,
	            	height: 250,
	            	items:[{
			            fieldLabel: '值',
			            fieldWidth: 30,
			            labelWidth:60,
			            width:150,
			            hidden:false,
			            xtype: "numberfield",
			            id : idPrefix+"labelValue-number",
			            x: 5,
			            y: 25
			        },{
			            fieldLabel: '值',
			            fieldWidth: 30,
			            labelWidth:60,
			            width:150,
			            hidden:true,
			            xtype: "textfield",
			            id : idPrefix+"labelValue-char",
			            x: 5,
			            y: 25
			        },{
			            fieldLabel: '值',
			            fieldWidth: 30,
			            labelWidth:60,
			            width:150,
			            hidden:true,
			            xtype: "datefield",
			            id : idPrefix+"labelValue-date",
			            x: 5,
			            y: 25
			        },{
			            fieldLabel: '标签',
			            fieldWidth: 30,
			            labelWidth:60,
			            xtype: "textfield",
			            id : idPrefix+"labelValue-label",
			            width:200,
			            x: 5,
			            y: 55
			        },{
			            x:5,
			            y:85,
			            width:60,
			            xtype: 'button',
			            id : idPrefix+'labelValue-add',
			            hideLabel: true,
			            text:'添加',
			            disabled:false,
			            handler: null
			        },{
			            x:5,
			            y:115,
			            width:60,
			            xtype: 'button',
			            id : idPrefix+'labelValue-edit',
			            hideLabel: true,
			            text:'修改',
			            disabled:true,
			            handler: null
			        },{
			            x:5,
			            y:145,
			            width:60,
			            xtype: 'button',
			            id : idPrefix+'labelValue-delete',
			            hideLabel: true,
			            text:'删除',
			            disabled:false,
			            handler: null
			        }
			        ,{
		            	//xtype : 'valueLabelGrid',
		            	id : idPrefix+'valueLabelGrid',
		            	x:70,
		                y:85,
		                width:300,
		                height:130
		            }
			        ],
	            	buttons: [{
			            text: '确定',
			            handler: function() {
			            	Ext.getCmp('tabpanel').setActiveTab(0);
			            }
					}]
	            }]
	        }]
	    }];
     		
        this.callParent(arguments);
    }
});