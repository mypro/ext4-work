Ext.define('Factor.controller.RelationPropertyParamController', {
    extend: 'Factor.controller.Base',
    stores: [
             "RelationPropertyParamStore"
    ],
    models: [
             "RelationPropertyParamModel"   
    ],

    init: function() {
    	this.control({
        	'#relationPropertyParamGrid' : {
        		containercontextmenu: this.rightClickPanel,
        		itemcontextmenu : this.rightClickItem,
        		select : this.selectRow
            }
        });
    	
    	this.selectedRowIndex = 0;
    },
    
    selectRow : function(e, obj, row){
    	if(e.selected.length > 0){
    		this.selectedRowIndex = row;
    		
    		var relationPropertyController = Factor.App.getController("RelationPropertyController");
    		if(-1 === relationPropertyController.selectedRowIndex){
    			// 表明该属性已经删除了
    			return;
    		}
    		
    		//  设置选择参数值的文本
    		relationPropertyController.setGridShowText( 
    				relationPropertyController.selectedRowIndex, 4, obj.get('name'));
    		
    		//  设置选择参数值的paramValueUuid
    		var relationPropertyParamStore = Ext.getCmp('relationPropertyParamGrid').getStore();
    		this.selectedParamValueUuid = relationPropertyParamStore.data
										.items[this.selectedRowIndex].data.uuid;
    		relationPropertyController.setParamValueUuid(
    				relationPropertyController.selectedRowIndex, this.selectedParamValueUuid);
    	}
    },
    
    rightClickPanel : function(menu, e){
    	// 对于因子和外部表，这里不能维护
    	var relationPropertyController = Factor.App.getController("RelationPropertyController");
    	var selectedParamDefineUuid = relationPropertyController
								.getParamDefineUuid(relationPropertyController.selectedRowIndex);
    	if(PROP_TYPE_UUID_PARAM != relationPropertyController.selectedPropertyType
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
    	var relationPropertyController = Factor.App.getController("RelationPropertyController");
    	var selectedParamDefineUuid = relationPropertyController
							.getParamDefineUuid(relationPropertyController.selectedRowIndex);
    	if(PROP_TYPE_UUID_PARAM != relationPropertyController.selectedPropertyType
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
    
    editDisable : function(isDisable){
    	var grid = Ext.getCmp('relationPropertyParamGrid'); 
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
            	var relationPropertyController = Factor.App.getController("RelationPropertyController");
            	var me = Factor.App.getController("RelationPropertyParamController");
            	me.save();
            	var deleteParamDefineUuid = relationPropertyController
											.getSelectDefineUuid();
            	var deleteParamValueUuid = me.selectedParamValueUuid;
            	Ext.Ajax.request({
        		    url: '../../../work-platform/deleteRelationParamValue.do',
        		    params: {
        		    	deleteParamDefineUuid : deleteParamDefineUuid,
        		    	deleteParamValueUuid : deleteParamValueUuid
        		    },
        		    success: function(response){
        		    	var relationPropertyParamStore = Ext.getCmp('relationPropertyParamGrid').getStore();
        		    	relationPropertyParamStore.load({
        		    		params:{
            					defineUuid : relationPropertyController
            									.getSelectDefineUuid()
        		    		}
        		    	});
        		    	me.selectedRowIndex = -1;
        		    	
        		    	var relationPropertyStore = Ext.getCmp('relationPropertyGrid').getStore();
        		    	relationPropertyStore.load({
        		    		params:{
        	    				condition : Ext.encode({
        	    					relationUuid : Factor.App.getController(
												"RelationController").selectedUuid
        	    				})
        	    			}
        		    	});
        		    	relationPropertyController.selectedRowIndex = -1;
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
            	var relationPropertyParamStore = Ext.getCmp('relationPropertyParamGrid').getStore();
            	var relationPropertyParamSize = relationPropertyParamStore.getCount();
            	var newRecord = Ext.create('Factor.model.RelationPropertyParamModel', {
            		uuid : "",
            		defineUuid : Factor.App.getController("RelationPropertyController")
            					.getSelectDefineUuid(),
            		name : "",
            		seq : relationPropertyParamSize
                });
            	relationPropertyParamStore.insert(relationPropertyParamSize, newRecord);
            }
        };
    },
    
    editFinish : function(combo){
    	var relationPropertyController = Factor.App.getController("RelationPropertyController");
		if(-1 === relationPropertyController.selectedRowIndex){
			// 表明该属性已经删除了
			return;
		} 
		
		//  设置选择参数值的文本
		relationPropertyController.setGridShowText( 
				relationPropertyController.selectedRowIndex, 4, combo.lastValue);
    },
    
    save : function(){
    	console.log('save relation property param grid!');
		
		var relationPropertyParamStore = Ext.getCmp('relationPropertyParamGrid').getStore();
		addRelationPropertyParamData = this.getDataFromRecord(relationPropertyParamStore.getNewRecords());
		updateRelationPropertyParamData = this.getDataFromRecord(relationPropertyParamStore.getUpdatedRecords());
		
		var me = Factor.App.getController("RelationPropertyParamController");
		
		if(0 == addRelationPropertyParamData.length 
				&& 0 == updateRelationPropertyParamData.length){
			if(relationPropertyParamStore.getCount()>0){
				me.selectedParamValueUuid = relationPropertyParamStore.data
						.items[me.selectedRowIndex].data.uuid;
				Factor.App.getController("RelationPropertyController").save();
			}
			return ;
		}
		
		
    	Ext.Ajax.request({
		    url: '../../../work-platform/saveParamValue.do',
		    params: {
		    	addParamValues	:	Ext.encode(addRelationPropertyParamData),
		    	updateParamValues:	Ext.encode(updateRelationPropertyParamData)
		    },
		    success: function(response){
		    	relationPropertyParamStore.load({
		    		params:{
    					defineUuid : Factor.App.getController("RelationPropertyController")
    									.getSelectDefineUuid()
		    		},
		    		callback : function(records, options, sucess) { 
		    			me.selectedParamValueUuid = records[me.selectedRowIndex].get('uuid');
		    			Factor.App.getController("RelationPropertyController").save();
		    		}
		    	});
		    	
		    },
		    failure : function(response) {
		    	alert("保存失败");
			}
		});
    }
    
});