Ext.define('FDW.controller.DefineGridController', 
{
    extend: 'Ext.app.Controller',

    init: function() {
    	this.isEditProperty = false;
    },
    
    
    initForm : function(record, parentUuid, parentType, isStartEdit){
    	this.parentUuid = parentUuid;
    	this.parentType = parentType;
    	
    	this.uuid = record.get('uuid');
    	this.defineUuid = record.get('defineUuid');
//    	this.dataType = record.get('dataType');
    	
    	this.setSource({
            "name": record.get('name'),
            "format": record.get('format'),
            "width": record.get('width'),
            "decimalWidth": record.get('decimalWidth'),
            "valueLabelUuid": record.get('valueLabelUuid'),
            "missing": '',
            "showWidth":'',
            "showAlign": '',
            "measure": record.get('measure'),
            "role": record.get('role')
        });
    	
    	if(isStartEdit){
    		this.getPlugin().startEdit(0,1);
    	}
    },
    
    clickSave : function(){
    	var me = FDW.App.getController("DefineGridController");
    	var panel = this;
    	var store = panel.getStore();
    	
    	if(!store.getAt(0).get('value')){
    		return;
    	}
    	
    	var factorDefineRecord = {
    		uuid:		panel.uuid, 			
    		defineUuid:	panel.defineUuid, 
    		name:		store.getAt(0).get('value'),
    		format:		store.getAt(1).get('value'),
			dataType:	me.format2DataType(store.getAt(1).get('value')), 
			valueLabelUuid:store.getAt(4).get('value'),//值标签索引 
			width:		store.getAt(2).get('value'),
			decimalWidth:store.getAt(3).get('value'), 
		};
    	
		if(panel.isEditProperty){
			factorDefineRecord.createLevel = 2;
		}else{
			factorDefineRecord.createLevel = 1;
		}
    	
		if(panel.callback && panel.callback.save){
			panel.callback.save.call(panel, factorDefineRecord, panel.parentUuid, panel.parentType);
		}
    },
    
    format2DataType : function(format){
    	var dateType = 1;
    	if(COLUMNTYPE_DECIMAL===format
    			||COLUMNTYPE_POINT===format
    			||COLUMNTYPE_COMMA ===format
    			||COLUMNTYPE_CURRENCY ===format
    			||COLUMNTYPE_DOLLAR ===format
    			||COLUMNTYPE_SCIENTIFIC ===format
    			||COLUMNTYPE_LIMIT ===format
    			){
    		dateType=1;
    	}else if(COLUMNTYPE_DATE_1 ===format
    			||COLUMNTYPE_DATE_2 ===format
    			||COLUMNTYPE_DATE_3  ===format
    			||COLUMNTYPE_DATE_4  ===format
    			||COLUMNTYPE_DATE_5   ===format){
    		dateType=3;
    	}else if(COLUMNTYPE_CHAR === format){
    		dateType=2;
    	}
    	return dateType;
    },
    
    formate2DateShow : function(format){
    	var showText = "未知";
    	switch(format){
    	case COLUMNTYPE_DECIMAL:
    		showText = "数值(N)";
    		break;
    	case COLUMNTYPE_COMMA:
    		showText = "逗号(C)";
    		break;
    	case COLUMNTYPE_POINT:
    		showText = "点(D)";
    		break;
    	case COLUMNTYPE_SCIENTIFIC:
    		showText = "科学计数法(S)";
    		break;
    	case COLUMNTYPE_DATE_1:
    	case COLUMNTYPE_DATE_2:
    	case COLUMNTYPE_DATE_3:
    	case COLUMNTYPE_DATE_4:
    	case COLUMNTYPE_DATE_5:
    		showText = "日期(A)";
    		break;
    	case COLUMNTYPE_DOLLAR:
    		showText = "美元(L)";
    		break;
    	case COLUMNTYPE_CURRENCY:
    		showText = "设定货币(U)";
    		break;
    	case COLUMNTYPE_CHAR:
    		showText = "字符串(R)";
    		break;
    	case COLUMNTYPE_LIMIT:
    		showText = "受限数值(具有前导零的整数)(E)";
    		break;
    	default :
    		showText = "其他";
    	}
    	return showText;
    },
    
    openDataTypeWin:function(){
    	var me = FDW.App.getController("DefineGridController");
    	var panel = this;
    	
    	var dataTypewin = Ext.create('DataType.view.DataTypeWindow',{
			id : 'datatypeWindow',
			// 初始化数据
			data : {
				dataType : COLUMNTYPE_DECIMAL,
				width : 8,
				decimalWidth : 2
			},
			callback : {
				// 点击保存
				save : function(win, dataTypeValue, widthValue, decimalValue){
					var store = panel.getStore();
					var dataType = me.format2DataType(dataTypeValue);
					
					store.getAt(1).set('value',dataTypeValue);
					
					switch(dataType){
						case 1:
							store.getAt(2).set('value',widthValue);
							store.getAt(3).set('value',decimalValue);
							break;
						case 2:
							store.getAt(2).set('value',widthValue);
							store.getAt(3).set('value',0);
							break;
						case 3:
							store.getAt(2).set('value',0);
							store.getAt(3).set('value',0);
							break;
					}
					dataTypewin.close();
				},
				changeRadio : function(win, field, newValue){
				}
			}
		}).show();
    },
    
    
    openValueLabelWin:function(){
    	var panel = this;
    	var store = panel.getStore();
    	var defineName=store.getAt(0).get('value');
    	
    	var valueLabelwin = Ext.create('ValueLabel.view.ValueLabelWindow',{
			id : 'valueLabelWindow',
			data : {
				xtype:"textfield",
				defineName:defineName
			},
			 callback : {
				save : function(win, defineUuid,defineName,isNew, head, newsJson,updatesJson){
					console.log(win+' '+defineUuid+' '+head+' '+newsJson+' '+updatesJson);
					store.getAt(4).set('value',defineUuid);
					if(isNew){
						Ext.Ajax.request({
						    url: '../../../work-platform/updateSj.do',
						    params: {
						    	head: Ext.encode(head),
						    	sjnewsJson:Ext.encode(newsJson),
						    	sjupdatesJson:Ext.encode(updatesJson)
						    },
						    success: function(response){
						    	valueLabelwin.close();
						    },
						    failure : function(response) {
						    	Ext.MessageBox.alert("提示","参数保存失败，请从新输入");
							}
						});	
					}
				},
				onPanelRendered:function( win,eOpts){
				}
			} 
		}).show();
    },
    
    /** 获取ext所属父组件的前缀ID
     * @param parentId   
     * @returns
     */
    getPrefix : function(parentId){
    	if(typeof parentId === "object"){
    		parentId = parentId.id;
    	}
    	var prefix = parentId.substring(0,parentId.indexOf('_')+1);
    	if(!prefix){
    		prefix = 'cmpt-factordefine-'+parentId+'_';
    	}
    	return prefix;
    }
    
});