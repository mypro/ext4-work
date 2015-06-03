Ext.define('Factor.view.window.FactorWindow',{
    extend: 'Ext.Window',
    alias : 'widget.factorWindow',
    
    initComponent : function(){

    	this.title = '编辑因子属性';
     	this.width = 470;
     	this.height = 370;
     	this.plain = true;
     	this.modal = true;
     	this.closeAction = 'hide';
     	this.layout = 'column';
        this.defaults = {
            anchor: '100%'
        };
     	this.listeners = {
     			'close':function(){
         			this.hide();
     			}
     	};
     	this.items = [{
	        xtype: 'form',
	        id: 'factorForm',
	        bodyStyle:'padding:5px 5px 5px 5px;',  
            labelWidth :60, 
            width :450,
	        height: 350,
            border:false,  
            defaults: {anchor : "100%"},  
	        items : [{
	        	xtype : 'tabpanel',
	        	id : 'tabpanel',
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
	            	id:'factorInfoForm',
	                defaults: {
	                    anchor: '100%'
	                },
	                border:false,  
	                height : 250,
	                items:[{
	                    name: 'factor-uuid',
	                    id : 'factor-uuid',
	                    value : '',
	                    hidden: true
	                },{
	                    name: 'factor-defineUuid',
	                    id : 'factor-defineUuid',
	                    value : '',
	                    hidden: true
	                },{
					    fieldLabel: '名称',
					    id :  'factor-name',
					    name: 'factor-name',
					    allowBlank: false,
					    value: ''
					},{
	                    id :  'factor-dataType',
	                    name: 'factor-dataType',
	                    xtype : 'numberfield',
	                    hidden: true
					},{
	                    id :  'factor-format',
	                    name: 'factor-format',
	                    xtype : 'numberfield',
	                    hidden: true
					},{
						fieldLabel: '数据类型',
						xtype : 'triggerfield',
						triggerCls : 'x-form-my-trigger',
						id : 'factor-typeShow',
						name: 'factor-typeShow',
						editable : false,
						value : '数值',
						onTriggerClick : Factor.App.getController('window.FactorWindowController')
										.clickDataType
					},{
					    fieldLabel: '宽度',
					    xtype : 'numberfield',
					    id :  'factor-width',
					    name: 'factor-width',
					    allowBlank: true,
					    value: ''
        			},{
					    fieldLabel: '小数宽度',
					    xtype : 'numberfield',
					    id :  'factor-decimalWidth',
					    name: 'factor-decimalWidth',
					    allowBlank: true,
					    value: ''
					},{
					    fieldLabel: '值标签',
					    id :  'factor-valueLabelUuid',
					    name: 'factor-valueLabelUuid',
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
			            id : 'factorSaveButton',
			            height : 23
					},{
			            text: '取消',
			            id : 'factorCancelButton',
			            height : 23
					}]
	            },{
	            	title:'变量类型',
	            	id:'dataType-panel',
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
		        		id:'datatypeRadio',
		                columns: 1,
		                x:5,
		                y:10,
		                items:[
								 {boxLabel: '数值(N)', 				name: this.idPrefix+'type',inputValue: COLUMNTYPE_DECIMAL, checked: true},
			                    {boxLabel: '逗号(C)',					name: this.idPrefix+'type',inputValue: COLUMNTYPE_COMMA},
			                    {boxLabel: '点(D)',					name: this.idPrefix+'type',inputValue: COLUMNTYPE_POINT},
			                    {boxLabel: '科学计数法(S)',				name: this.idPrefix+'type',inputValue: COLUMNTYPE_SCIENTIFIC},
			                    {boxLabel: '日期(A)', 				name: this.idPrefix+'type',inputValue: COLUMNTYPE_DATE_1},
			                    {boxLabel: '美元(L)',					name: this.idPrefix+'type',inputValue: COLUMNTYPE_DOLLAR},
			                    {boxLabel: '设定货币(U)', 				name: this.idPrefix+'type',inputValue: COLUMNTYPE_CURRENCY},
			                    {boxLabel: '字符串(R)',				name: this.idPrefix+'type',inputValue: COLUMNTYPE_CHAR},
			                    {boxLabel: '受限数值(具有前导零的整数)(E)',	name: this.idPrefix+'type',inputValue: COLUMNTYPE_LIMIT}  
		                ]
	            	},{fieldLabel: '长度',fieldWidth: 10,xtype: 'numberfield',x: 185,y: 65,value:8,id:'datatype-width',labelWidth:35},
			          {fieldLabel: '小数', fieldWidth: 10,xtype: 'numberfield',x: 185,y: 95,value:0,id:'datatype-decimals',labelWidth:35},
			          {
			        	  	fieldLabel: '日期格式',
			            	xtype: 'combo',
			            	id:'datatype-date',
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
			            handler: Factor.App.getController('window.FactorWindowController')
								.clickTypeSave
					}]
	            },{
	            	title:'值标签',
	            	layout: 'absolute',
	            	id : 'valueLabel-panel',
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
			            id : "labelValue-number",
			            x: 5,
			            y: 25
			        },{
			            fieldLabel: '值',
			            fieldWidth: 30,
			            labelWidth:60,
			            width:150,
			            hidden:true,
			            xtype: "textfield",
			            id : "labelValue-char",
			            x: 5,
			            y: 25
			        },{
			            fieldLabel: '值',
			            fieldWidth: 30,
			            labelWidth:60,
			            width:150,
			            hidden:true,
			            xtype: "datefield",
			            id : "labelValue-date",
			            x: 5,
			            y: 25
			        },{
			            fieldLabel: '标签',
			            fieldWidth: 30,
			            labelWidth:60,
			            xtype: "textfield",
			            id : "labelValue-label",
			            width:200,
			            x: 5,
			            y: 55
			        },{
			            x:5,
			            y:85,
			            width:60,
			            xtype: 'button',
			            id : 'labelValue-add',
			            hideLabel: true,
			            text:'添加',
			            disabled:false,
			            handler: null
			        },{
			            x:5,
			            y:115,
			            width:60,
			            xtype: 'button',
			            id : 'labelValue-edit',
			            hideLabel: true,
			            text:'修改',
			            disabled:true,
			            handler: null
			        },{
			            x:5,
			            y:145,
			            width:60,
			            xtype: 'button',
			            id : 'labelValue-delete',
			            hideLabel: true,
			            text:'删除',
			            disabled:false,
			            handler: null
			        }
			        /*,{
		            	xtype : 'valueLabelGrid',
		            	id : 'valueLabelGrid',
		            	x:70,
		                y:85,
		                width:300,
		                height:130
		            }*/
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