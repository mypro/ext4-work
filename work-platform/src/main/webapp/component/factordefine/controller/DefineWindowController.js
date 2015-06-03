Ext.define('FDW.controller.DefineWindowController', 
{
    extend: 'Ext.app.Controller',
    stores: [
//             "FactorStore",
//             "FactorPropertyStore",
//             "RelationPropertyStore",
//             "FactorTreeStore"
    ],
    models: [
    ],
    views: [
    ],

    init: function() {
    	this.control({
        	'factorDefineWindow button[action="save"]' : {
        		click: this.clickSave
            },
            'factorDefineWindow button[action="cancel"]' : {
        		click: function(){arguments[0].up('factorDefineWindow').hide();}
            }
        });
    	
    	this.isEditProperty = false;
    },
    
    clear : function(win){
    	var prefix = this.getPrefix(win);
    	
    	Ext.getCmp(prefix+'factor-uuid').setValue('');
    	Ext.getCmp(prefix+'factor-defineUuid').setValue('');
    	Ext.getCmp(prefix+'factor-name').setValue('');
    	Ext.getCmp(prefix+'factor-dataType').setValue(1);
    	Ext.getCmp(prefix+'factor-typeShow').setValue(this.formate2DateShow(1));
    	Ext.getCmp(prefix+'factor-format').setValue(1);
    	Ext.getCmp(prefix+'factor-width').setValue(8);
    	Ext.getCmp(prefix+'factor-decimalWidth').setValue(0);
    	
    	//TODO
    	//Factor.App.getController('panel.ValueLabelController').initGrid();
    },
    
    clickSave : function(btn){
    	var me = FDW.App.getController("DefineWindowController");
    	var prefix = me.getPrefix(btn);
    	var win = btn.up('factorDefineWindow');
    	var form = btn.up('form').getForm();
    	if(!form.isValid()){
    		console.log('invalid!');
        	return;
        }
    	
		// 因子定义
    	var factorDefineRecord = {};
		var fields = Ext.getCmp(prefix+'factorInfoForm').items.items;
		for(var i=0;i<fields.length;i++){
			var field = fields[i];
			var key = field.getId().substring(prefix.length+7,field.getId().length);
			var value = field.getValue();
			factorDefineRecord[key]=value;
		}
		if(win.isEditProperty){
			factorDefineRecord.createLevel = 2;
		}else{
			factorDefineRecord.createLevel = 1;
		}
		
		if(win.callback && win.callback.save){
			win.callback.save.call(win, factorDefineRecord, win.parentUuid, win.parentType);
		}
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
    },
    
    emptyFn : function(){
    	
    }
    
});