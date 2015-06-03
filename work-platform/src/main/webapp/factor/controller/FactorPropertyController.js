Ext.define('Factor.controller.FactorPropertyController', {
    extend: 'Factor.controller.Base',
    stores: [
             "FactorPropertyStore"
    ],
    models: [
             "FactorPropertyModel"   
    ],

    init: function() {
    	this.control({
        	'#factorPropertyGrid' : {
        		containercontextmenu: this.rightClickPanel,
        		itemcontextmenu : this.rightClickItem,
        		select : this.selectRow
            }
        });
    	
    	this.selectedRowIndex = -1;
    	this.selectedPropertyType = PROP_TYPE_UUID_PARAM; 
    },
    
    rightClickPanel : function(menu, e){
//    	if(!Factor.App.getController("FactorController").selectedUuid){
//    		e.preventDefault();
//    		e.stopEvent();
//    		return;
//    	}
		this.showMenu(e, [
		                  this.getInsertMenuItem()
		                  ]);
	},
	
	rightClickItem : function(view, record, dom, row, e){
//		if(!Factor.App.getController("FactorController").selectedUuid){
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
            	var me = Factor.App.getController("FactorPropertyController");
            	Ext.Ajax.request({
        		    url: '../../../work-platform/deleteFactorProperty.do',
        		    params: {
        		    	deletePropertyUuid : me.selectedUuid
        		    },
        		    success: function(response){
        		    	var factorPropertyParamStore = Ext.getCmp('factorPropertyParamGrid').getStore();
        		    	factorPropertyParamStore.clearData();
        		    	
        		    	var factorPropertyStore = Ext.getCmp('factorPropertyGrid').getStore();
        		    	factorPropertyStore.load({
        		    		params:{
        	    				condition : Ext.encode({
        	    					factorUuid : Factor.App.getController(
												"FactorController").selectedUuid
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
       	 	text : "新增因子属性",  
            handler : function() { 
            	var factorPropertyStore = Ext.getCmp('factorPropertyGrid').getStore();
            	var factorPropertySize = factorPropertyStore.getCount();
            	var newRecord = Ext.create('Factor.model.FactorPropertyModel', {
            		uuid : "",
            		name : "",
            		type : PROP_TYPE_UUID_PARAM,
            		factorUuid : Factor.App.getController(
										"FactorController").selectedUuid,
					factorName : Factor.App.getController(
										"FactorController").selectedName,
            		seq : factorPropertySize
                });
            	factorPropertyStore.insert(factorPropertySize, newRecord);
            }
        };
	},
	
	// 提供外界获取当前选中行的参数定义
	getSelectDefineUuid : function(){
		return Ext.getCmp('factorPropertyGrid').getStore().data.items[this.selectedRowIndex]
			.data.paramDefineUuid;
	},
    
	switchPropertyType : function(me, typeUuid){
		// 设置选择的是否为其他因子类型
		var factorPropertyParamController = Factor.App.getController("FactorPropertyParamController");
		var gridStore = Ext.getCmp('factorPropertyGrid').getStore();
		
		if(!typeUuid){
			typeUuid = gridStore.getAt(me.selectedRowIndex).get('type');
		}
		this.selectedPropertyType = typeUuid;
			
		if(PROP_TYPE_UUID_PARAM === this.selectedPropertyType){
			factorPropertyParamController.editDisable(false);
		}else{
			factorPropertyParamController.editDisable(true);
		}
	
		// active right panel
		var defineUuid = gridStore.getAt(me.selectedRowIndex).get('paramDefineUuid');
		var isFactor = (PROP_TYPE_UUID_FACTOR === this.selectedPropertyType);
		if(defineUuid || isFactor ){
			Ext.getCmp('factorPropertyParamGrid').getStore().load({
				params:{
						isFactor : isFactor,
						defineUuid : defineUuid
				}
			});
		}
		// 如果是外部数据，切换grid，隐藏显示一些数据表相关的列
		if(PROP_TYPE_UUID_OUTER == this.selectedPropertyType){
			Ext.getCmp('factorPropertyParamGrid').hide();
			Ext.getCmp('factorPropertyDataGrid').show();
			Ext.getCmp("factorPropertyGrid").columns[7].show();
			Ext.getCmp("factorPropertyGrid").columns[8].show();
			Ext.getCmp("factorPropertyGrid").columns[9].show();
			Ext.getCmp("factorPropertyGrid").columns[10].show();
			Ext.getCmp("factorPropertyGrid").columns[11].show();
		}else{
			Ext.getCmp('factorPropertyParamGrid').show();
			Ext.getCmp('factorPropertyDataGrid').hide();
			Ext.getCmp("factorPropertyGrid").columns[7].hide();
			Ext.getCmp("factorPropertyGrid").columns[8].hide();
			Ext.getCmp("factorPropertyGrid").columns[9].hide();
			Ext.getCmp("factorPropertyGrid").columns[10].hide();
			Ext.getCmp("factorPropertyGrid").columns[11].hide();
		}
	},
	
    selectRow : function(e, obj,row){
    	// save factor info
    	Factor.App.getController("FactorController").save();
    	
    	if(e.selected.length > 0){
    		this.selectedUuid = e.selected.getAt(0).data.uuid;
    		this.selectedRowIndex = row;
    		
    		this.switchPropertyType(this);
    	}
    },
    
    // 设置界面的文本显示
    setGridShowText : function(row, column, text){
    	Ext.select('#factorPropertyGrid tbody tr[data-recordindex='+row+'] td')
			.elements[column].childNodes[0].innerHTML = text;
    },
    
    // 获取指定行的参数定义义
    getParamDefineUuid : function(row){
    	var record = Ext.getCmp('factorPropertyGrid').getStore().data
					.items[row];
    	return record ? record.get('paramDefineUuid') : "";
    },
    
    // 设置某行的参数定义
    setParamDefineUuid : function(row, defineUuid){
    	Ext.getCmp('factorPropertyGrid').getStore().data
			.items[row].data.paramDefineUuid = defineUuid;
    },
    
    // 设置某行的参数值
    setParamValueUuid : function(row, paramValueUuid){
		if(paramValueUuid !== Ext.getCmp('factorPropertyGrid').getStore()
					.getAt(this.selectedRowIndex).data.paramValueUuid){
			Ext.getCmp('factorPropertyGrid').getStore().getAt(this.selectedRowIndex)
												.set("paramValueUuid", paramValueUuid);
		}
    },
    
    // 判断这个参数定义是否已经存在
    checkOldParamDefine : function(lastDefineName){
		var defineStore = getParamDefineStore(3);
		for(var i=0;i<defineStore.getCount();i++){
			if(lastDefineName.trim() == defineStore.getAt(i).data.name.trim()
					|| lastDefineName.trim() == defineStore.getAt(i).data.uuid.trim()){
				return defineStore.getAt(i).data.uuid;
			}
		}
		return false;
    },
    
    selectPropertDefine : function(combo, record){
    	var me = Factor.App.getController("FactorPropertyController");
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
		me = Factor.App.getController("FactorPropertyController");
		if(!Factor.App.preventShake("finishDefine", me)){
			return ;
		}
		
		if(this.isSelectEvent){
			console.log('load define param.');
			me.setParamDefineUuid(me.selectedRowIndex, this.selectedDefineUuid);
			me.setGridShowText(me.selectedRowIndex, 3, combo.lastSelection[0].data.name);
			
			// 刷新参数值grid
			var isFactor = (PROP_TYPE_UUID_FACTOR === me.selectedPropertyType );
			Ext.getCmp('factorPropertyParamGrid').getStore().load({
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
				Ext.getCmp('factorPropertyParamGrid').getStore().load({
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
			    	type : 3,
			    	paramDefineName	: lastDefineName
			    },
			    success: function(response){
			    	createParamDefineStore(3);
			    	this.selectedDefineUuid = response.responseText;
			    	
			    	Ext.getCmp('factorPropertyDefine').bindStore(
			    			getParamDefineStore(3), true);
			    	
			    	me.setGridShowText(me.selectedRowIndex, 3, lastDefineName);
			    	me.setParamDefineUuid(me.selectedRowIndex, this.selectedDefineUuid);
			    	
			    	// 刷新参数值grid
			    	var isFactor = (PROP_TYPE_UUID_FACTOR === me.selectedPropertyType );
			    	Ext.getCmp('factorPropertyParamGrid').getStore().load({
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
		console.log('save factorProperty grid!');
		
		// 对于参数类型的属性，需要设置选中行的paramvalueuuid
		if(PROP_TYPE_UUID_PARAM == this.selectedPropertyType){
			var selectedParamValueUuid = Factor.App.getController(
										"FactorPropertyParamController").selectedParamValueUuid;
			this.setParamValueUuid(this.selectedRowIndex, selectedParamValueUuid);
		}
		
		// 获取新增和修改的 
		var factorPropertyStore = Ext.getCmp('factorPropertyGrid').getStore();
		addFactorPropertyData = this.getDataFromRecord(factorPropertyStore.getNewRecords());
		updateFactorPropertyData = this.getDataFromRecord(factorPropertyStore.getUpdatedRecords());
		
		if(0 == addFactorPropertyData.length 
				&& 0 == updateFactorPropertyData.length){
			return ;
		}
		
		// 刷新一下所有recored的factorUuid
		var FactorController = Factor.App.getController("FactorController");
		var factorUuid = Ext.getCmp('factorGrid').getStore().getAt(FactorController.selectedRowIndex)
						.get('uuid');
		for(var i=0;i<addFactorPropertyData.length;i++){
			addFactorPropertyData[i].factorUuid=factorUuid;
		}
		for(var i=0;i<updateFactorPropertyData.length;i++){
			updateFactorPropertyData[i].factorUuid=factorUuid;
		}
		
		// 保存因子属性
    	Ext.Ajax.request({
		    url: '../../../work-platform/saveFactorProperty.do',
		    params: {
		    	addFactorPropertyData	:	Ext.encode(addFactorPropertyData),
		    	updateFactorPropertyData:	Ext.encode(updateFactorPropertyData)
		    },
		    success: function(response){
		    	factorPropertyStore.load({
	    			params:{
	    				condition : Ext.encode({
	    					factorUuid : Factor.App.getController(
											"FactorController").selectedUuid
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