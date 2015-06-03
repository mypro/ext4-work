Ext.define('Factor.controller.window.FactorWindowController', 
{
    extend: 'Factor.controller.Base',
    stores: [
             "FactorStore",
             "FactorPropertyStore",
             "RelationPropertyStore",
             "FactorTreeStore"
    ],
    models: [
    ],
    views: [
    ],
    refs: [{  
        selector: '#factorInfoForm',  
        ref: 'factorInfoForm'  
    },{  
        selector: '#factorWindow',  
        ref: 'factorWindow'  
    },{
    	selector: '#factorGrid',  
        ref: 'factorGrid'
    },{
    	selector: '#relationGrid',  
        ref: 'relationGrid'
    },{
    	selector: '#factor-uuid',  
        ref: 'factorUuid'
    },{
    	selector: '#factor-defineUuid',  
        ref: 'factorDefineUuid'
    },{
    	selector: '#factor-name',  
        ref: 'factorName'
    },{
    	selector: '#factor-dataType',  
        ref: 'factorDataType'
    },{
    	selector: '#factor-width',  
        ref: 'factorWidth'
    },{
    	selector: '#factor-decimalWidth',  
        ref: 'factorDecimalWidth'
    },{
    	selector: '#factor-format',  
        ref: 'factorFormat'
    }],

    init: function() {
    	this.control({
        	'#factorSaveButton' : {
        		click: this.clickSave
            },
            '#factorCancelButton' : {
            	click : function(){this.getFactorWindow().hide()}
            },
            '#datatypeRadio' : {
            	change: this.clickDataTypeRadio
            },
            '#datatype-width' : {
            	change : function(field,newValue,oldValue,eOpts){
    				Ext.getCmp('factor-width').setValue(newValue);
    			}
            },
            '#datatype-decimals' : {
            	change : function(field,newValue,oldValue,eOpts){
    				Ext.getCmp('factor-decimalWidth').setValue(newValue);
    			}
            },
            '#tabpanel' : {
            	tabchange : this.changeTab
            }
          
        });
    	
    	// 是否在编辑属性
    	this.isEditProperty = false;
    },
    
    changeTab : function(tab, activePanel){
    	if(activePanel.id === 'dataType-panel'){
    		this.clickDataType();
    	}else if(activePanel.id === 'valueLabel-panel'){
    		Factor.App.getController('panel.ValueLabelController')
    								.clickValueLable();
    	}else if(activePanel.id === 'factorInfoForm'){
    		this.clickTypeSave();
    	}
    },
    
    clear : function(){
    	this.getFactorUuid().setValue('');
    	this.getFactorDefineUuid().setValue('');
    	this.getFactorName().setValue('');
    	this.getFactorDataType().setValue(1);
    	this.setDataTypeShow(1);
    	this.getFactorWidth().setValue(8);
    	this.getFactorDecimalWidth().setValue(0);
    	this.getFactorFormat().setValue(1);
    	Factor.App.getController('panel.ValueLabelController').initGrid();
    },
    
    initForm : function(record){
    	this.getFactorUuid().setValue(record.get('uuid'));
    	this.getFactorDefineUuid().setValue(record.get('defineUuid'));
    	this.getFactorName().setValue(record.get('name'));
    	this.getFactorDataType().setValue(record.get('dataType'));
    	this.getFactorFormat().setValue(record.get('format'));
    	this.setDataTypeShow(record.get('format'));
    	this.getFactorWidth().setValue(record.get('width'));
    	this.getFactorDecimalWidth().setValue(record.get('decimalWidth'));
    	Factor.App.getController('panel.ValueLabelController').initGrid();
    },
    
    /**
     * 格式转化成数据类型
     * @param format
     * @returns {Number}
     */
    format2DataType : function(format){
    	var dateType = 1;
    	switch(format){
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
		case 6:
		case 8: //number
			dateType = 1;
			break;
		case 9:	// date
			dateType = 3;
			break;
		case 7: // char
			dateType = 2;
			break;
		}
    	return dateType;
    },
    
    formate2DateShow : function(format){
    	var showText = "未知";
    	switch(format){
    	case 1:
    		showText = "数值(N)";
    		break;
    	case 2:
    		showText = "逗号(C)";
    		break;
    	case 3:
    		showText = "点(D)";
    		break;
    	case 4:
    		showText = "科学计数法(S)";
    		break;
    	case 9:
    		showText = "日期(A)";
    		break;
    	case 5:
    		showText = "美元(L)";
    		break;
    	case 6:
    		showText = "设定货币(U)";
    		break;
    	case 7:
    		showText = "字符串(R)";
    		break;
    	case 8:
    		showText = "受限数值(具有前导零的整数)(E)";
    		break;
    	default :
    		showText = "其他";
    	}
    	return showText;
    },
    
    setDataTypeShow : function(format){
    	var showText = this.formate2DateShow(format);
    	switch(format){
    	case 1:
    		showText = "数值(N)";
    		break;
    	case 2:
    		showText = "逗号(C)";
    		break;
    	case 3:
    		showText = "点(D)";
    		break;
    	case 4:
    		showText = "科学计数法(S)";
    		break;
    	case 9:
    		showText = "日期(A)";
    		break;
    	case 5:
    		showText = "美元(L)";
    		break;
    	case 6:
    		showText = "设定货币(U)";
    		break;
    	case 7:
    		showText = "字符串(R)";
    		break;
    	case 8:
    		showText = "受限数值(具有前导零的整数)(E)";
    		break;
    	default :
    		showText = "其他";
    	}
    	Ext.getCmp('factor-typeShow').setValue(showText);
    },
    
    clickDataType : function(){
    	var format = Ext.getCmp('factor-format').getValue();
    	format = format>9?9:format;
		Ext.getCmp('factorForm').form.findField('dataTypeRadio').setValue(format);
		
		var width = Ext.getCmp('factor-width').getValue();
		Ext.getCmp('datatype-width').setValue(width);
		
		var decimalWidth = Ext.getCmp('factor-decimalWidth').getValue();
		Ext.getCmp('datatype-decimals').setValue(decimalWidth);
		
		Ext.getCmp('tabpanel').setActiveTab(1);
    },
    
    clickDataTypeRadio : function(field,newValue,oldValue,eOpts){
    	switch(newValue.dataTypeRadio){
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
		case 6:
		case 8: //number
			Ext.getCmp('datatype-width').show();
			Ext.getCmp('datatype-decimals').show();
			Ext.getCmp('datatype-date').hide();
			break;
		case 9:	// date
			Ext.getCmp('datatype-width').hide();
			Ext.getCmp('datatype-decimals').hide();
			Ext.getCmp('datatype-date').show();
			break;
		case 7: // char
			Ext.getCmp('datatype-width').show();
			Ext.getCmp('datatype-decimals').hide();
			Ext.getCmp('datatype-date').hide();
			break;
		}
    },
    
    clickTypeSave : function(){
    	var me = Factor.App.getController('window.FactorWindowController');
    	
    	var formatType = Ext.getCmp('factorForm').form.findField('dataTypeRadio').getGroupValue();
    	Ext.getCmp('factor-format').setValue(formatType);
    	me.setDataTypeShow(formatType);
    	
    	var dataType = me.format2DataType(formatType);
    	Ext.getCmp('factor-dataType').setValue(dataType);
    	
    	Ext.getCmp('tabpanel').setActiveTab(0);
    },
    
    clickSave : function(btn){
    	if(!btn.up('form').getForm().isValid()){
        	return;
        }
    	var me = Factor.App.getController("window.FactorWindowController");
    	
		// 因子定义
    	var factorDefineRecord = {};
		var fields = this.getFactorInfoForm().items.items;
		for(var i=0;i<fields.length;i++){
			var field = fields[i];
			var key = field.getId().substring(7,field.getId().length);
			var value = field.getValue();
			factorDefineRecord[key]=value;
		}
		if(me.isEditProperty){
			factorDefineRecord.createLevel = 2;
		}else{
			factorDefineRecord.createLevel = 1;
		}
		
		// parent信息
		var parentUuid;
		if(2==me.parentType){
			var selectModel = this.getRelationGrid().selModel;
			if(0 < selectModel.selected.length){
				parentUuid = selectModel.selected.items[0].get('uuid');
		    }
		}else{
			var factorSelectModel = this.getFactorGrid().selModel;
			if(me.isEditProperty && 0 < factorSelectModel.selected.length){
				parentUuid = factorSelectModel.selected.items[0].get('uuid');
		    }
		}
		// http request 保存
		Ext.Ajax.request({ 
			url: '../work-platform/saveFactor.do',
			params: {
				addRecord : Ext.encode(factorDefineRecord),
				parentUuid : parentUuid,
				parentType : me.parentType
			},
			success: function(response, options) {
				var result = Ext.JSON.decode(response.responseText); 
				if(result.duplicate){
					Ext.Msg.alert('','名称重复');
					return;
				}
				
				me.getFactorWindow().hide();
				if(2==me.parentType){
					me.getRelationPropertyStoreStore().load({
						params:{
							condition : Ext.encode({
								parentUuid : parentUuid
							})
						}
					});
				}else{
					if(me.isEditProperty){
						me.getFactorPropertyStoreStore().load({
							params:{
								condition : Ext.encode({
									parentUuid : parentUuid
								})
							}
						});
					}else{
						me.getFactorStoreStore().load();
					}
				}
				
				
				// 保存值标签信息，若数据类型发生变化，则清空所有值标签
				var valueLabelController = Factor.App.getController('panel.ValueLabelController');
				var dataType = Ext.getCmp('factor-dataType').getValue();
				if(valueLabelController.dataType != dataType){
					valueLabelController.getValueLabelStoreStore().removeAll();
		    	}
				var defineUuid = result.defineUuid;
				valueLabelController.save(defineUuid);
				
				// 刷新左侧预定义因子树
				me.getFactorTreeStoreStore().load();
			}
		});
    }
    
});