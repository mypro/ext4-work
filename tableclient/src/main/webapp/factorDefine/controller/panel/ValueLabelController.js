Ext.define('Factor.controller.panel.ValueLabelController', {
    extend: 'Factor.controller.Base',
    stores: [
             "ValueLabelStore"
    ],
    models: [
             "ValueLabelModel"   
    ],
    
    refs : [{
    	selector: '#valueLabelGrid',  
        ref: 'valueLabelGrid'
    }],
    
    init: function() {
        this.control({
            '#labelValue-add' : {
            	'click' : this.clickAdd
            },
            '#labelValue-delete' : {
            	'click' : this.clickDelete
            }
        });
    },
    
    clear : function(){
    	Ext.getCmp('labelValue-number').setValue('');
    	Ext.getCmp('labelValue-label').setValue('');
    	Ext.getCmp('labelValue-date').setValue('');
    },
    
    getValue : function(){
    	switch(this.dataType){
    	case 1:
    		return Ext.getCmp('labelValue-number').getValue();
    	case 3:
    		return Ext.getCmp('labelValue-date').getValue().format('yyyy-MM-dd');
    	default:
    		return Ext.getCmp('labelValue-char').getValue();
    	}
    },
    
    clickDelete : function(){
    	var me = Factor.App.getController('panel.ValueLabelController');
    	var selectModel = me.getValueLabelGrid().selModel;
		if(0 == selectModel.selected.length){
			return ;
	    }
		var row = selectModel.selectionStart.index;
		me.getValueLabelGrid().getStore().removeAt(row);
    },
    
    clickAdd : function(){
    	var label = Ext.getCmp('labelValue-label').getValue();
    	var value = this.getValue();
    	if(!value||!label){
    		return
    	}
    	var valueLabelStore = this.getValueLabelStoreStore();
    	var valueLabelSize = valueLabelStore.getCount();
    	var newRecord = Ext.create('Factor.model.ValueLabelModel', {
    		uuid : "",
    		defineUuid : Ext.getCmp('factor-defineUuid').getValue(),
    		value : value,
    		label : label,
    		seq : valueLabelSize+1
        });
    	valueLabelStore.insert(valueLabelSize, newRecord);
    	this.clear();
    },
    
    clickValueLable : function(){
    	var me = Factor.App.getController('panel.ValueLabelController');
    	// 若数据类型切换，则清空数据
    	if(me.dataType != Ext.getCmp('factor-dataType').getValue()){
    		me.getValueLabelStoreStore().removeAll();
    	}
    	me.dataType = Ext.getCmp('factor-dataType').getValue();
    	switch(me.dataType){
    	case 1:
    		Ext.getCmp('labelValue-number').show();
    		Ext.getCmp('labelValue-char').hide();
    		Ext.getCmp('labelValue-date').hide();
    		break;
    	case 3:
    		Ext.getCmp('labelValue-number').hide();
    		Ext.getCmp('labelValue-char').hide();
    		Ext.getCmp('labelValue-date').show();
    		break;
    	default:
    		Ext.getCmp('labelValue-number').hide();
			Ext.getCmp('labelValue-char').show();
			Ext.getCmp('labelValue-date').hide();
    		break;
    	}
    	Ext.getCmp('tabpanel').setActiveTab(2);
    	
    	// load valuelabel grid
//    	me.getValueLabelStoreStore().load({params:{
//    		defineUuid : Ext.getCmp('factor-defineUuid').getValue()
//    	}});
    },
    
    initGrid : function(){
    	var me = Factor.App.getController('panel.ValueLabelController');
    	me.dataType = Ext.getCmp('factor-dataType').getValue();
    	me.getValueLabelStoreStore().load({params:{
    		defineUuid : Ext.getCmp('factor-defineUuid').getValue()
    	}});
    },
    
    save : function(defineUuid){
    	var valueLabelStore = this.getValueLabelStoreStore();
		addData = this.getDataFromRecord(valueLabelStore.data.items);
		
		for(var i=0;i<addData.length;i++){
			addData[i]['defineUuid'] = defineUuid;
		}
		
		Ext.Ajax.request({
		    url: '../../../work-platform/saveValueLabel.do',
		    params: {
		    	addData	:	Ext.encode(addData),
		    	defineUuid : defineUuid
		    },
		    success: function(response){
		    },
		    failure : function(response) {
		    	alert("保存值失败");
			}
		});
    }
    
});

