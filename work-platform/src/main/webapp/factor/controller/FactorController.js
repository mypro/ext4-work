Ext.define('Factor.controller.FactorController', {
    extend: 'Factor.controller.Base',
    stores: [
             "FactorStore"
    ],
    models: [
             "FactorModel"   
    ],

    init: function() {
        this.control({
        	'#factorGrid' : {
        		containercontextmenu: this.rightClickPanel,
        		itemcontextmenu : this.rightClickItem,
        		select : this.selectRow
            }
        });
        this.selectedRowIndex = -1;
    },
    
    setSelectedUuid : function(uuid){
    	this.selectedUuid = uuid;
    },
    
    selectRow : function(e, obj ,row){
    	if(e.selected.length > 0){
    		this.selectedRowIndex = row;
    		var factorUuid = e.selected.getAt(0).data.uuid;
    		if(!factorUuid){
    			this.selectedUuid = "";
    			this.selectedName = e.selected.getAt(0).get("name");
    			Ext.getCmp('factorPropertyGrid').getStore().removeAll();
    			console.log('invalid factorUuid');
    			return;
    		}
    		
    		this.setSelectedUuid(factorUuid);
    		this.selectedName = e.selected.getAt(0).get("name");
    		
    		// 联动因子属性表
    		Ext.getCmp('factorPropertyGrid').getStore().load({
    			params:{
    				condition : Ext.encode({
    					factorUuid : factorUuid
    				})
    			}
    		});
    		
    		// 联动因子关系表
    		Factor.App.getController("RelationController").filterByFactor = true;
    		Ext.getCmp('relationGrid').getStore().load({
    			params:{
    				condition : Ext.encode({
    					factorUuid : factorUuid
    				})
    			}
    		});
    	}
    },
    
    editFinish : function(combo){
    	var me = Factor.App.getController("FactorController");
    	me.selectedName = combo.lastValue;
    	var record = Ext.getCmp('factorGrid').getStore().getAt(me.selectedRowIndex);
    	record.set("name", combo.lastValue);
    },
    
	rightClickPanel : function(menu, e){
		this.showMenu(e, [
		                  this.getInsertMenuItem(),
		                  this.getShowAllMenuItem()
		                  ]);
	},
	
	rightClickItem : function(view, record, dom, row, e){
    	this.showMenu(e, [
		                  this.getInsertMenuItem(),
		                  this.getShowAllMenuItem(),
		                  this.getDeleteMenuItem()
		                  ]);
    },
    
	save : function(){
		console.log('save factor grid!');
		
		var factorStore = Ext.getCmp('factorGrid').getStore();
		addFactorData = this.getDataFromRecord(factorStore.getNewRecords());
		updateFactorData = this.getDataFromRecord(factorStore.getUpdatedRecords());
		
		if(0 == addFactorData.length 
				&& 0 == updateFactorData.length){
			return ;
		}
		
    	Ext.Ajax.request({
		    url: '../../../work-platform/saveFactor.do',
		    params: {
		    	addFactorData	:	Ext.encode(addFactorData),
		    	updateFactorData:	Ext.encode(updateFactorData)
		    },
		    success: function(response){
		    	factorStore.load();
		    },
		    failure : function(response) {
		    	alert("保存失败");
			}
		});
	},
	
	getDeleteMenuItem : function(){
		return {
       	 	text : "删除因子",  
            handler : function() { 
            	var me = Factor.App.getController("FactorController");
            	Ext.Ajax.request({
        		    url: '../../../work-platform/deleteFactor.do',
        		    params: {
        		    	deleteUuid : me.selectedUuid
        		    },
        		    success: function(response){
        		    	var factorPropertyStore = Ext.getCmp('factorPropertyGrid').getStore();
        		    	factorPropertyStore.removeAll();
        		    	Factor.App.getController("FactorPropertyController").selectedRowIndex = -1;
        		    	
        		    	var relationPropertyStore = Ext.getCmp('relationPropertyGrid').getStore();
        		    	relationPropertyStore.removeAll();
        		    	Factor.App.getController("RelationPropertyController").selectedRowIndex = -1;
        		    	
        		    	// 刷新因子列表
        		    	Ext.getCmp('factorGrid').getStore().load();
        		    	
        		    	// 刷新关系列表
        		    	Ext.getCmp('relationGrid').getStore().load();
        		    },
        		    failure : function(response) {
        		    	alert("删除失败");
        			}
        		});
            }
        };
	},
	
	getShowAllMenuItem : function(){
		return {
       	 	text : "显示所有",  
            handler : function() { 
            	var relationStore = Ext.getCmp('factorGrid').getStore();
            	relationStore.load();
            	Factor.App.getController("RelationController")
            								.filterByFactor = false;
            }
        };
	},
	
	getInsertMenuItem : function(){
		return {
       	 	text : "新增因子",  
            handler : function() { 
            	var factorStore = Ext.getCmp('factorGrid').getStore();
            	var factorSize = factorStore.getCount();
            	var newRecord = Ext.create('Factor.model.FactorModel', {
            		uuid : "",
            		name : "因子"+(factorSize+1),
            		seq : factorSize+1
                });
            	factorStore.insert(factorSize, newRecord);
            	
            	// 联动因子属性表
        		Ext.getCmp('factorPropertyGrid').getStore().removeAll();
        		
        		// 设置选中行
        		Ext.getCmp('factorGrid').getSelectionModel().selectByPosition(
        				{row: factorSize});  
            }
        };
	}
});

