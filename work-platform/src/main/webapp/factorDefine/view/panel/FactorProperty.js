var factor1Store=Ext.create('Factor.store.FactorStore',{
	id:'factor1Store'
});
var factor2Store=Ext.create('Factor.store.FactorStore',{
	id:'factor2Store'
});
factor1Store.load();
factor2Store.load();
Ext.define('Factor.view.panel.FactorProperty',{
    extend: 'Ext.grid.property.Grid',
    alias : 'widget.factorProperty',
    
    
//    store : "FactorStore",
//    width: 300,
    initComponent : function(){
    	var me=this;
    	this.hideHeaders =true;
    	this.sortPropertyColumn=false;
    	this.sortableColumns=false;
    	this.source={
//    		"defineUuid":'',
            "name": "",
            "format": '',
            "width": 32,
            "decimalWidth": 2,
            "valueLabelUuid": ""/*,
            "missing": '',
            "showWidth": 80,
            "showAlign": '',
            "measure": "",
            "role": ""*/
        };
    	this.propertyNames= {    //该参数可以更改属性显示的名称
//    		defineUuid:'索引',
    		name: '名称',
    		format:'数据类型',
    		width:'宽度',
    		decimalWidth:'小数宽度',
    		valueLabelUuid:'值',
    		/*missing:'缺失',
    		showWidth:'列宽',
    		showAlign:'对齐方式',
    		measure:'度量标准',
    		role:'角色',*/
    		factor1Uuid:'因子1',
    		factor2Uuid:'因子2',
//    		dataSourceUuid:'数据源',
    		dataBaseUuid:'数据库',
    		dataTableUuid:'数据表',
    		dataColumnUuid:'字段'
        };
    	this.customEditors= {    //用于自定义编辑组件，左边名称与source中的名称对应
    		name:new Ext.grid.CellEditor({ field: 
		    			new Ext.form.field.Text({
							allowBlank : false,
							listeners: {
						        'blur': function(editor, newvar, oldvar){ 
						        		var record=Factor.App.getPanelFactorPropertyGridControllerController().getFactorProperty().getStore().getAt(0);
						        		if(editor.getValue()!==editor.originalValue){
						        			Factor.App.getPanelFactorPropertyGridControllerController().getFactorProperty().getStore().getAt(0).set('value',editor.value);
						            		Ext.getCmp('titleToolbar').callback.save();
						        		}	
						            },
		    					'focus':function(editor, index, s ){
		    						editor.originalValue = editor.getValue();
		    					}
							}
		    			})
    		}),
    		width:new Ext.grid.CellEditor({ field: 
    			new Ext.form.field.Number({
					allowBlank : false,
					listeners: {
						'blur': function(editor, newvar, oldvar){ 
//			        		var record=Factor.App.getPanelFactorPropertyGridControllerController().getFactorProperty().getStore().getAt(0);
			        		if(editor.getValue()!==editor.originalValue){
			        			Factor.App.getPanelFactorPropertyGridControllerController().getFactorProperty().getStore().getAt(2).set('value',editor.value);
			            		Ext.getCmp('titleToolbar').callback.save();
			        		}	
			            },
						'focus':function(editor, index, s ){
							editor.originalValue = editor.getValue();
						}
					}
    			})
    		}),
    		decimalWidth:new Ext.grid.CellEditor({ field: 
    			new Ext.form.field.Number({
					allowBlank : false,
					listeners: {
						'blur': function(editor, newvar, oldvar){ 
//			        		var record=Factor.App.getPanelFactorPropertyGridControllerController().getFactorProperty().getStore().getAt(0);
			        		if(editor.getValue()!==editor.originalValue){
			        			Factor.App.getPanelFactorPropertyGridControllerController().getFactorProperty().getStore().getAt(3).set('value',editor.value);
			            		Ext.getCmp('titleToolbar').callback.save();
			        		}	
			            },
						'focus':function(editor, index, s ){
							editor.originalValue = editor.getValue();
						}
					}
    			})
    		}),
    		format: new Ext.grid.CellEditor({ field: 
    			new Ext.form.field.Trigger({
				triggerCls : 'x-form-my-trigger',
				id : 'type',
				editable : false,
				onTriggerClick : Factor.App.getController("panel.FactorPropertyGridController").openDataTypeWin,
				listeners: {
					'focus':function(editor, index, s ){
						editor.originalValue = editor.getValue();
						editor.setValue(getTypeNameByUuid(editor.originalValue));
					},
					'blur': function(editor, newvar, oldvar){ 
						editor.setValue(editor.originalValue);
					}
				}
			})}),
			valueLabelUuid: new Ext.grid.CellEditor({ field: 
    			new Ext.form.field.Trigger({
//					xtype : 'triggerfield',
					triggerCls : 'x-form-my-trigger',
					id : 'valueLabelTriggerfield',
					width:50,
					editable : false,
					onTriggerClick : Factor.App.getController("panel.FactorPropertyGridController").openValueLabelWin,
					listeners: {
						'focus':function( ){
							var type=format2DataType(Ext.getCmp('factorProperty').getStore().getAt(1).get('value'));
//							if(true){
								Ext.getCmp('triggerfield-combo').setVisible(true);
//							}else{
//								switch(type){
//									case 1:
//										Ext.getCmp('triggerfield-numberfield').setVisible(true);
//										break;
//									case 2:
//										Ext.getCmp('triggerfield-textfield').setVisible(true);
//										break;
//									case 3:
//										Ext.getCmp('triggerfield-datefield').setVisible(true);
//										break;
//									default:
//										Ext.getCmp('triggerfield-combo').setVisible(true);
//								}
//							}
						},
						'blur': function(editor, newvar, oldvar){ 
//							Ext.getCmp('triggerfield-numberfield').setVisible(false);
//							Ext.getCmp('triggerfield-textfield').setVisible(false);
//							Ext.getCmp('triggerfield-datefield').setVisible(false);
//							Ext.getCmp('triggerfield-combo').setVisible(false);
						}
					}
			})}),
			factor1Uuid: {
				xtype : 'combo',
				store : factor1Store,
				valueField : "uuid",
				displayField : "name",
				mode : 'remote',
				triggerAction : 'all',
				allowBlank : false,
				queryMode: 'local',
				width : 180,
				listeners: {
					'focus':function(editor, index, s ){
						if("1"===editor.getValue()){
							editor.setValue('');
						}
						me.originaFactor1=editor.getValue();
//						editor.originalValue = editor.getValue();
//						editor.setValue(getTypeNameByUuid(editor.originalValue));
					},
					'blur': function(editor, newvar, oldvar){ 
						if(me.originaFactor1===editor.getValue()) return;
//						editor.setValue(editor.originalValue);
						var store=Factor.App.getPanelFactorPropertyGridControllerController().getFactorProperty().getStore();
						store.getAt(0).set('value',editor.getValue());
						if(!('1'=== store.getAt(0).get('value')||'2'===store.getAt(1).get('value')||''===store.getAt(0).get('value')||''===store.getAt(1).get('value'))){
							Ext.getCmp('titleToolbar').callback.save();
						}
					}
				}
			},
			factor2Uuid: {
				xtype : 'combo',
				store :factor2Store,
				valueField : "uuid",
				displayField : "name",
				mode : 'remote',
				triggerAction : 'all',
				listeners : {
					'focus':function(editor, index, s ){
//						editor.originalValue = editor.getValue();
//						editor.setValue(getTypeNameByUuid(editor.originalValue));
						if("2"===editor.getValue()){
							editor.setValue('');
						}
						me.originaFactor2=editor.getValue();
					},
					'blur': function(editor, newvar, oldvar){ 
						if(me.originaFactor1===editor.getValue()) return;
//						editor.setValue(editor.originalValue);
						var store=Factor.App.getPanelFactorPropertyGridControllerController().getFactorProperty().getStore();
						store.getAt(1).set('value',editor.getValue());
						if(!('1'=== store.getAt(0).get('value')||'2'===store.getAt(1).get('value')||''===store.getAt(0).get('value')||''===store.getAt(1).get('value'))){
							Ext.getCmp('titleToolbar').callback.save();
						}
					}
				},
				allowBlank : false,
				queryMode: 'local',
				width : 180
			},
			/*dataSourceUuid: {
				xtype : 'combo',
				store : Factor.App.getPanelFactorControllerController().getFactorStoreStore(),
				valueField : "uuid",
				displayField : "name",
				mode : 'remote',
				triggerAction : 'all',
				listeners : {
				},
				allowBlank : false,
				editable : false,
				width : 180
			},*/
			dataBaseUuid: {
				xtype : 'combo',
				store : Factor.App.getPanelFactorControllerController().getFactorStoreStore(),
				valueField : "uuid",
				displayField : "name",
				mode : 'remote',
				triggerAction : 'all',
				listeners : {
				},
				allowBlank : false,
				editable : false,
				width : 180
			},
			dataTableUuid: new Ext.grid.CellEditor({ field: 
	    			new Ext.form.field.ComboBox({
		                editable: false,
		                valueField : "uuid",
						displayField : "name",
						id:'dataTableUuid',
						editable : false,
						width : 180,
		                store: Factor.App.getPanelFactorPropertyGridControllerController().getTableStoreStore(),
		                listeners:{
	    					'change':function(combotbl, newvar, oldvar){
	    						Factor.App.getPanelFactorPropertyGridControllerController().getFactorProperty().getStore().getAt(7).set('value','')
	    						Factor.App.getPanelFactorPropertyGridControllerController().getColumnStoreStore().load({
				        			params:{
				        					uuid : combotbl.value
				        			}
				            	});
	    					}
		                }
	    			})
	    		}),
			dataColumnUuid: {
				xtype : 'combo',
				id:'abc',
				store : Factor.App.getPanelFactorPropertyGridControllerController().getColumnStoreStore(),
				valueField : "keyword",
				displayField : "keyword",
				mode : 'remote',
				triggerAction : 'all',
				allowBlank : false,
				editable : false,
				width : 180
			}
        };
    	this.customRenderers= {  //用于value(function的参数v)显示之前的格式化
    		format : function(dataIndex) {
    				return getTypeNameByUuid(dataIndex);
    			},
			factor1Uuid : function(dataIndex) {
				return getPropertyTextByValue('factorUuid', dataIndex);
			},
			factor2Uuid : function(dataIndex) {
				return getPropertyTextByValue('factorUuid', dataIndex);
			},
			/*dataSource : function(dataIndex) {
				return getPropertyTextByValue('factorUuid', dataIndex);
			},*/
			dataBaseUuid : function(dataIndex) {
				return getPropertyTextByValue('factorUuid', dataIndex);
			},
			dataTableUuid : function(dataIndex) {
				return getPropertyTextByValue('dataTable', dataIndex);
			}/*,
			dataColumnUuid : function(dataIndex) {
				return getPropertyTextByValue('factorUuid', dataIndex);
			}*/
        };
        this.callParent(arguments);
    }
});
function getPropertyTextByValue(paramName, value) {
    switch(paramName) {
    case 'factorUuid' :
    	if(value==1){
    		return '';
    	}else if(value==2){
    		return '';
    	}
    	Factor.App.getPanelFactorControllerController().getFactorStoreStore().reload();
        var combo1Value = Factor.App.getPanelFactorControllerController().getFactorGrid().getStore().getById(value);
        return combo1Value ? combo1Value.get('name') : value;
    case 'dataTable':
    	var combo1Value = Factor.App.getPanelFactorPropertyGridControllerController().getTableStoreStore().getById(value);
        return combo1Value ? combo1Value.get('keyword') : '';
    default :
        return value;
    }
}
Ext.define('Ext.ux.PropertyCombo', {        //当PropertyGrid中需要用到多个不同Store的Combo时，集中相同的配置参数重定义一个Combo可以大量减少重复代码
	 
    extend:'Ext.form.field.ComboBox',

    config: {
        valueField: 'name',        //Combo选项的值对应的Field
        displayField: 'uuid',       //Combo选项的显示文字对应的Field
        editable: false,
        queryMode: 'local',
        selectOnFocus: false
    },

    constructor: function(config) {
        this.initConfig(config);
        this.callParent([config]);
    }

});