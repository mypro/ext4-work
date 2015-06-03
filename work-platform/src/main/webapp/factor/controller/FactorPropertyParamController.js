Ext.define('Factor.controller.FactorPropertyParamController', {
    extend: 'Factor.controller.Base',
    stores: [
             "FactorPropertyParamStore"
    ],
    models: [
             "FactorPropertyParamModel"   
    ],

    init: function() {
    	this.control({
        	'#factorPropertyParamGrid' : {
        		containercontextmenu: this.rightClickPanel,
        		itemcontextmenu : this.rightClickItem,
        		select : this.selectRow
            }
        });
    	
    	this.selectedRowIndex = -1;
    },
    
    selectRow : function(e, obj, row){
    	if(e.selected.length > 0){
    		this.selectedRowIndex = row;
    		
    		var factorPropertyController = Factor.App.getController("FactorPropertyController");
    		if(-1 === factorPropertyController.selectedRowIndex){
    			// 表明该属性已经删除了
    			return;
    		} 
    		
    		//  设置选择参数值的文本
    		factorPropertyController.setGridShowText( 
    				factorPropertyController.selectedRowIndex, 4, obj.get('name'));
    		
    		//  设置选择参数值的paramValueUuid
    		var factorPropertyParamStore = Ext.getCmp('factorPropertyParamGrid').getStore();
    		this.selectedParamValueUuid = factorPropertyParamStore.data
										.items[this.selectedRowIndex].data.uuid;
    		factorPropertyController.setParamValueUuid(
    				factorPropertyController.selectedRowIndex, this.selectedParamValueUuid);
    	}
    },
    
    rightClickPanel : function(menu, e){
    	// 对于因子和外部表，这里不能维护
    	var factorPropertyController = Factor.App.getController("FactorPropertyController");
    	var selectedParamDefineUuid = factorPropertyController
    								.getParamDefineUuid(factorPropertyController.selectedRowIndex);
    	if(PROP_TYPE_UUID_PARAM != factorPropertyController.selectedPropertyType
    			|| !selectedParamDefineUuid){
    		e.preventDefault();
    		e.stopEvent();
    		return;
    	}
    	this.showMenu(e, [
		                  this.getInsertMenuItem()		                  
		                  ]);
    },
    
    rightClickItem : function(view, record, dom, row, e){
    	// 对于因子和外部表，这里不能维护； 对于无参数定义的，也不能维护
    	var factorPropertyController = Factor.App.getController("FactorPropertyController");
    	var selectedParamDefineUuid = factorPropertyController
								.getParamDefineUuid(factorPropertyController.selectedRowIndex);
    	if(PROP_TYPE_UUID_PARAM != factorPropertyController.selectedPropertyType
    			|| !selectedParamDefineUuid){
    		e.preventDefault();
    		e.stopEvent();
    		return;
    	}
    	this.showMenu(e, [
		                  this.getInsertMenuItem(),
		                  this.getDeleteMenuItem()
		                  ]);
    },
    
    fnReturnFalse : function(){return false},
    
    editDisable : function(isDisable){
    	var grid = Ext.getCmp('factorPropertyParamGrid'); 
    	if(isDisable){
    		grid.on('beforeedit', this.fnReturnFalse);
    	}else{
    		grid.un('beforeedit', this.fnReturnFalse);
    	}
    },
    
   getDeleteMenuItem : function(){
	   	
    	return {
    		text : "删除属性数据",  
            handler : function() { 
            	
            	var factorPropertyController = Factor.App.getController("FactorPropertyController");
            	var me = Factor.App.getController("FactorPropertyParamController");
            	me.save();
            	var deleteParamDefineUuid = factorPropertyController
											.getSelectDefineUuid();
            	var deleteParamValueUuid = me.selectedParamValueUuid;
            	Ext.Ajax.request({
        		    url: '../../../work-platform/deleteFactorParamValue.do',
        		    params: {
        		    	deleteParamDefineUuid : deleteParamDefineUuid,
        		    	deleteParamValueUuid : deleteParamValueUuid
        		    },
        		    success: function(response){
        		    	var factorPropertyParamStore = Ext.getCmp('factorPropertyParamGrid').getStore();
        		    	factorPropertyParamStore.load({
        		    		params:{
            					defineUuid : factorPropertyController
            									.getSelectDefineUuid()
        		    		}
        		    	});
        		    	me.selectedRowIndex = -1;
        		    	
        		    	var factorPropertyStore = Ext.getCmp('factorPropertyGrid').getStore();
        		    	factorPropertyStore.load({
        		    		params:{
        	    				condition : Ext.encode({
        	    					factorUuid : Factor.App.getController(
												"FactorController").selectedUuid
        	    				})
        	    			}
        		    	});
        		    	factorPropertyController.selectedRowIndex = -1;
        		    },
        		    failure : function(response) {
        		    	alert("删除失败");
        			}
        		});
            }
    	};
    },
    
    getInsertMenuItem : function(){
    	return {
       	 	text : "新增属性数据",  
            handler : function() { 
            	var factorPropertyParamStore = Ext.getCmp('factorPropertyParamGrid').getStore();
            	var factorPropertyParamSize = factorPropertyParamStore.getCount();
            	var newRecord = Ext.create('Factor.model.FactorPropertyParamModel', {
            		uuid : "",
            		defineUuid : Factor.App.getController("FactorPropertyController")
            					.getSelectDefineUuid(),
            		name : "",
            		seq : factorPropertyParamSize
                });
            	factorPropertyParamStore.insert(factorPropertyParamSize, newRecord);
            }
        };
    },
    
    editFinish : function(combo){
    	var factorPropertyController = Factor.App.getController("FactorPropertyController");
		if(-1 === factorPropertyController.selectedRowIndex){
			// 表明该属性已经删除了
			return;
		} 
		
		//  设置选择参数值的文本
		factorPropertyController.setGridShowText( 
				factorPropertyController.selectedRowIndex, 4, combo.lastValue);
    },
    
    save : function(){
    	console.log('save factor property param grid!');
    	// 若不是编辑参数属性，直接返回
    	var FactorPropertyController = Factor.App.getController("FactorPropertyController")
    	if(PROP_TYPE_UUID_PARAM != FactorPropertyController.selectedPropertyType){
    		return ;
    	}
		
		var factorPropertyParamStore = Ext.getCmp('factorPropertyParamGrid').getStore();
		addFactorPropertyParamData = this.getDataFromRecord(factorPropertyParamStore.getNewRecords());
		updateFactorPropertyParamData = this.getDataFromRecord(factorPropertyParamStore.getUpdatedRecords());
		
		var me = Factor.App.getController("FactorPropertyParamController");
		
		if(0 == addFactorPropertyParamData.length 
				&& 0 == updateFactorPropertyParamData.length){
			if(factorPropertyParamStore.getCount()>0){
				me.selectedParamValueUuid = factorPropertyParamStore.data
						.items[me.selectedRowIndex].data.uuid;
				FactorPropertyController.save();
			}
			return ;
		}
		
		
    	Ext.Ajax.request({
		    url: '../../../work-platform/saveParamValue.do',
		    params: {
		    	addParamValues	:	Ext.encode(addFactorPropertyParamData),
		    	updateParamValues:	Ext.encode(updateFactorPropertyParamData)
		    },
		    success: function(response){
		    	factorPropertyParamStore.load({
		    		params:{
    					defineUuid : FactorPropertyController.getSelectDefineUuid()
		    		},
		    		callback : function(records, options, sucess) { 
		    			me.selectedParamValueUuid = records[me.selectedRowIndex].get('uuid');
		    			FactorPropertyController.save();
		    		}
		    	});
		    	
		    },
		    failure : function(response) {
		    	alert("保存失败");
			}
		});
    }
    
});