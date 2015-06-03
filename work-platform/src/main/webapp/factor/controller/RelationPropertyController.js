Ext.define('Factor.controller.RelationPropertyController', {
    extend: 'Factor.controller.Base',
    stores: [
             "RelationPropertyStore"
    ],
    models: [
             "RelationPropertyModel"   
    ],

    init: function() {
    	this.control({
        	'#relationPropertyGrid' : {
        		containercontextmenu: this.rightClickPanel,
        		itemcontextmenu : this.rightClickItem,
        		select : this.selectRow
            }
        });
    	
    	this.selectedRowIndex = -1;
    	this.selectedPropertyType = PROP_TYPE_UUID_PARAM; 
    },
    
    rightClickPanel : function(menu, e){
//    	if(!Factor.App.getController("RelationController").selectedUuid){
//    		e.preventDefault();
//    		e.stopEvent();
//    		return;
//    	}
		this.showMenu(e, [
		                  this.getInsertMenuItem()
		                  ]);
	},
	
	rightClickItem : function(view, record, dom, row, e){
//		if(!Factor.App.getController("RelationController").selectedUuid){
//    		e.preventDefault();
//    		e.stopEvent();
//    		return;
//    	}
		this.showMenu(e, [
		                  this.getInsertMenuItem(),
		                  this.getDeleteMenuItem()
		                  ]);
	},
	
	getDeleteMenuItem : function(){
    	return {
    		text : "删除属性",  
            handler : function() { 
            	var me = Factor.App.getController("RelationPropertyController");
            	Ext.Ajax.request({
        		    url: '../../../work-platform/deleteRelationProperty.do',
        		    params: {
        		    	deletePropertyUuid : me.selectedUuid
        		    },
        		    success: function(response){
        		    	var relationPropertyParamStore = Ext.getCmp('relationPropertyParamGrid').getStore();
        		    	relationPropertyParamStore.clearData();
        		    	
        		    	var relationPropertyStore = Ext.getCmp('relationPropertyGrid').getStore();
        		    	relationPropertyStore.load({
        		    		params:{
        	    				condition : Ext.encode({
        	    					relationUuid : Factor.App.getController(
												"RelationController").selectedUuid
        	    				})
        	    			}
        		    	});
        		    	me.selectedRowIndex = -1;
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
       	 	text : "新增关系属性",  
            handler : function() { 
            	var relationPropertyStore = Ext.getCmp('relationPropertyGrid').getStore();
            	var relationPropertySize = relationPropertyStore.getCount();
            	var newRecord = Ext.create('Factor.model.RelationPropertyModel', {
            		uuid : "",
            		name : "",
            		type : PROP_TYPE_UUID_PARAM,
            		relationUuid : Factor.App.getController(
										"RelationController").selectedUuid,
					relationName : Factor.App.getController(
										"RelationController").selectedName,
            		seq : relationPropertySize
                });
            	relationPropertyStore.insert(relationPropertySize, newRecord);
            }
        };
	},
	
	// 提供外界获取当前选中行的参数定义
	getSelectDefineUuid : function(){
		return Ext.getCmp('relationPropertyGrid').getStore().data.items[this.selectedRowIndex]
			.data.paramDefineUuid;
	},
    
	switchPropertyType : function(me, typeUuid){
		// 设置选择的是否为其他因子类型
		var relationPropertyParamController = Factor.App.getController("RelationPropertyParamController");
		var gridStore = Ext.getCmp('relationPropertyGrid').getStore();
		
		if(!typeUuid){
			typeUuid = gridStore.getAt(me.selectedRowIndex).get('type');
		}
		this.selectedPropertyType = typeUuid;
			
		if(PROP_TYPE_UUID_PARAM === this.selectedPropertyType){
			relationPropertyParamController.editDisable(false);
		}else{
			relationPropertyParamController.editDisable(true);
		}
	
		// active right panel
		var defineUuid = gridStore.getAt(me.selectedRowIndex).get('paramDefineUuid');
		var isFactor = (PROP_TYPE_UUID_FACTOR === this.selectedPropertyType);
		if(defineUuid || isFactor){
			Ext.getCmp('relationPropertyParamGrid').getStore().load({
				params:{
						isFactor : isFactor,
						defineUuid : defineUuid
				}
			});
		}
	},
	
    selectRow : function(e, obj,row){
    	// save factor info
    	Factor.App.getController("RelationController").save();
    	
    	if(e.selected.length > 0){
    		this.selectedUuid = e.selected.getAt(0).data.uuid;
    		this.selectedRowIndex = row;
    		
    		this.switchPropertyType(this);
    	}
    },
    
    // 设置界面的文本显示
    setGridShowText : function(row, column, text){
    	Ext.select('#relationPropertyGrid tbody tr[data-recordindex='+row+'] td')
			.elements[column].childNodes[0].innerHTML = text;
    },
    
    // 获取指定行的参数定义
    getParamDefineUuid : function(row){
    	var record = Ext.getCmp('relationPropertyGrid').getStore().data
					.items[row];
		return record ? record.get('paramDefineUuid') : "";
    },
    
    // 设置某行的参数定义
    setParamDefineUuid : function(row, defineUuid){
    	Ext.getCmp('relationPropertyGrid').getStore().data
			.items[row].data.paramDefineUuid = defineUuid;
    },
    
    // 设置某行的参数值
    setParamValueUuid : function(row, paramValueUuid){
    	var grid = Ext.getCmp('relationPropertyGrid');
		if(paramValueUuid !== grid.getStore().getAt(this.selectedRowIndex)
							.data.paramValueUuid){
			grid.getStore().getAt(this.selectedRowIndex)
									.set("paramValueUuid", paramValueUuid);
		}
    },
    
    // 判断这个参数定义是否已经存在
    checkOldParamDefine : function(lastDefineName){
		var defineStore = getParamDefineStore(4);
		for(var i=0;i<defineStore.getCount();i++){
			if(lastDefineName.trim() == defineStore.getAt(i).data.name.trim()
					|| lastDefineName.trim() == defineStore.getAt(i).data.uuid.trim()){
				return defineStore.getAt(i).data.uuid;
			}
		}
		return false;
    },
    
    selectPropertDefine : function(combo, record){
    	var me = Factor.App.getController("RelationPropertyController");
    	me.switchPropertyType(me, record[0].data.uuid);
    },
	
    beforeEditDefine : function(){
		this.isSelectEvent = false;
	},
	
	selectDefine : function(combo, record){
		this.isSelectEvent = true;
		this.selectedDefineUuid = record[0].data.uuid;
	},
	
	finishDefine : function(combo){
		me = Factor.App.getController("RelationPropertyController");
		if(!Factor.App.preventShake("finishDefine", me)){
			return ;
		}
		
		if(this.isSelectEvent){
			console.log('load define param.');
			me.setParamDefineUuid(me.selectedRowIndex, this.selectedDefineUuid);
			me.setGridShowText(me.selectedRowIndex, 3, combo.lastSelection[0].data.name);
			// 刷新参数值grid
			var isFactor = (PROP_TYPE_UUID_FACTOR === me.selectedPropertyType );
			Ext.getCmp('relationPropertyParamGrid').getStore().load({
    			params:{
    				isFactor : isFactor,
    				defineUuid : this.selectedDefineUuid
    			}
    		});
		}else{
			// 判断是否需要添加新的定义
			var lastDefineName = combo.lastValue;
			if(!lastDefineName){
				return;
			}
			// 已经存在的参数定义
			var defineUuid = me.checkOldParamDefine(lastDefineName);
			if(defineUuid){
				me.setParamDefineUuid(me.selectedRowIndex, defineUuid);
				
				// 刷新参数值grid
				var isFactor = (PROP_TYPE_UUID_FACTOR === me.selectedPropertyType );
				Ext.getCmp('relationPropertyParamGrid').getStore().load({
	    			params:{
	    				isFactor : isFactor ,
	    				defineUuid : defineUuid
	    			}
	    		});
				return ;
			}
			
			// 不存在参数定义的话，就增加一个
			console.log('prepare add new define param.');
			Ext.Ajax.request({
			    url: '../../../work-platform/addPropertyDefine.do',
			    params: {
			    	type : 4 ,
			    	paramDefineName	: lastDefineName
			    },
			    success: function(response){
			    	createParamDefineStore(4);
			    	this.selectedDefineUuid = response.responseText;
			    	
			    	Ext.getCmp('relationPropertyDefine').bindStore(
			    			getParamDefineStore(4), true);
			    	
			    	me.setGridShowText(me.selectedRowIndex, 3, lastDefineName);
			    	me.setParamDefineUuid(me.selectedRowIndex, this.selectedDefineUuid);
			    	
			    	// 刷新参数值grid
				var isFactor = (PROP_TYPE_UUID_FACTOR === me.selectedPropertyType );
			    	Ext.getCmp('relationPropertyParamGrid').getStore().load({
						params:{
							isFactor : isFactor ,
							defineUuid : response.responseText
						}
					});
			    },
			    failure : function(response) {
				}
			});
		}
		this.isSelectEvent = false;
	},
    
	
	save : function(){
		console.log('save relationProperty grid!');
		
		// 设置选中行的paramvalueuuid
		var selectedParamValueUuid = Factor.App.getController(
									"RelationPropertyParamController").selectedParamValueUuid;
		this.setParamValueUuid(this.selectedRowIndex, selectedParamValueUuid);
		
		// 获取新增和修改的 
		var relationPropertyStore = Ext.getCmp('relationPropertyGrid').getStore();
		var addRelationPropertyData = this.getDataFromRecord(relationPropertyStore.getNewRecords());
		var updateRelationPropertyData = this.getDataFromRecord(relationPropertyStore.getUpdatedRecords());
		
		if(0 == addRelationPropertyData.length 
				&& 0 == updateRelationPropertyData.length){
			return ;
		}
		
		// 刷新关系uuid
		var RelationController = Factor.App.getController("RelationController");
		var relationUuid = Ext.getCmp('relationGrid').getStore().getAt(RelationController.selectedRowIndex)
						.get('uuid');
		for(var i=0;i<addRelationPropertyData.length;i++){
			addRelationPropertyData[i].relationUuid=relationUuid;
		}
		for(var i=0;i<updateRelationPropertyData.length;i++){
			updateRelationPropertyData[i].factorUuid=relationUuid;
		}
		
    	Ext.Ajax.request({
		    url: '../../../work-platform/saveRelationProperty.do',
		    params: {
		    	addRelationPropertyData	:	Ext.encode(addRelationPropertyData),
		    	updateRelationPropertyData:	Ext.encode(updateRelationPropertyData)
		    },
		    success: function(response){
		    	relationPropertyStore.load({
	    			params:{
	    				condition : Ext.encode({
	    					relationUuid : Factor.App.getController(
											"RelationController").selectedUuid
	    				})
	    			}
	    		});
		    },
		    failure : function(response) {
		    	alert("保存失败");
			}
		});
	}
});