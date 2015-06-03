Ext.define('Factor.controller.RelationController', {
    extend: 'Factor.controller.Base',
    stores: [
             "RelationStore"
    ],
    models: [
             "RelationModel"   
    ],

    init: function() {
        this.control({
        	'#relationGrid' : {
        		containercontextmenu: this.rightClickPanel,
        		itemcontextmenu : this.rightClickItem,
        		select : this.selectRow
            }
        });
    },
    
    setSelectedUuid : function(uuid){
    	this.selectedUuid = uuid;
    },
    
    selectRow : function(e, obj ,row){
    	if(e.selected.length > 0){
    		this.selectedRowIndex = row;
    		var relationUuid = e.selected.getAt(0).data.uuid;
    		if(!relationUuid){
    			this.selectedUuid = "";
    			this.selectedName = e.selected.getAt(0).data.factor1Name +
									'-' + e.selected.getAt(0).data.factor2Name;
    			Ext.getCmp('relationPropertyGrid').getStore().removeAll();
    			console.log('invalid relationUuid');
    			return;
    		}
    		
    		this.setSelectedUuid(relationUuid);
    		this.selectedName = e.selected.getAt(0).data.factor1Name +
    						'-' + e.selected.getAt(0).data.factor2Name;
    		
    		// 更新关系属性表
    		Ext.getCmp('relationPropertyGrid').getStore().load({
    			params:{
    				condition : Ext.encode({
    					relationUuid : relationUuid
    				})
    			}
    		});
    		
    		// 更新因子表
    		var factor1Uuid = e.selected.getAt(0).data.factor1Uuid;
    		var factor2Uuid = e.selected.getAt(0).data.factor2Uuid;
    		Ext.getCmp('factorGrid').getStore().load({
    			params:{
    				condition : Ext.encode({
    					factor1Uuid : factor1Uuid,
    					factor2Uuid : factor2Uuid
    				})
    			}
    		});
    	}
    },
    
	rightClickPanel : function(menu, e){
		this.showMenu(e, [this.getInsertMenuItem(),
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
	
	// 设置界面的文本显示
    setGridShowText : function(row, column, text){
    	Ext.select('#relationGrid tbody tr[data-recordindex='+row+'] td')
			.elements[column].childNodes[0].innerHTML = text;
    },
    
	selectFactor: function(combo, record){
		var me = Factor.App.getController("RelationController");
		var factorName = record[0].get("name");
		var relationStore = Ext.getCmp('relationGrid').getStore();
		if('factor1Editor' === combo.id){
			me.setGridShowText(me.selectedRowIndex, 1, factorName);
			relationStore.getAt(me.selectedRowIndex).set("factor1Name", factorName);
		}else if('factor2Editor' === combo.id){
			me.setGridShowText(me.selectedRowIndex, 2, factorName);
			relationStore.getAt(me.selectedRowIndex).set("factor2Name", factorName);
		}
		me.selectedName = relationStore.getAt(me.selectedRowIndex).get("factor1Name") +
						'-' + relationStore.getAt(me.selectedRowIndex).get("factor2Name");
	},
	
	save : function(){
		console.log('save relation grid!');
		
		var relationStore = Ext.getCmp('relationGrid').getStore();
		var addRelationData = this.getDataFromRecord(relationStore.getNewRecords());
		var updateRelationData = this.getDataFromRecord(relationStore.getUpdatedRecords());
	
		if(0 == addRelationData.length 
				&& 0 == updateRelationData.length){
			return ;
		}
		
    	Ext.Ajax.request({
		    url: '../../../work-platform/saveRelation.do',
		    params: {
		    	addRelationData	:	Ext.encode(addRelationData),
		    	updateRelationData:	Ext.encode(updateRelationData)
		    },
		    success: function(response){
		    	relationStore.load();
		    },
		    failure : function(response) {
		    	alert("保存失败");
			}
		});
	},
	
	getShowAllMenuItem : function(){
		return {
       	 	text : "显示所有",  
            handler : function() { 
            	var relationStore = Ext.getCmp('relationGrid').getStore();
            	relationStore.load();
            }
        };
	},
	
	getDeleteMenuItem : function(){
		return {
       	 	text : "删除因子关系",  
            handler : function() { 
            	var me = Factor.App.getController("RelationController");
            	Ext.Ajax.request({
        		    url: '../../../work-platform/deleteRelation.do',
        		    params: {
        		    	deleteUuid : me.selectedUuid
        		    },
        		    success: function(response){
        		    	var relationPropertyStore = Ext.getCmp('relationPropertyGrid').getStore();
        		    	relationPropertyStore.removeAll();
        		    	Factor.App.getController("RelationPropertyController").selectedRowIndex = -1;
        		    	
        		    	// 刷新关系列表
        		    	var params;
        		    	if(me.filterByFactor){
        		    		params = {
        	    				condition : Ext.encode({
        	    					factorUuid : Factor.App.getController("FactorController")
        	    								.selectedUuid
        	    				})
        	    			};
        		    	}
        		    	Ext.getCmp('relationGrid').getStore().load(params);
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
       	 	text : "新增因子关系",  
            handler : function() { 
            	var relationStore = Ext.getCmp('relationGrid').getStore();
            	var relationSize = relationStore.getCount();
            	var newRecord = Ext.create('Factor.model.RelationModel', {
            		uuid : "",
            		seq : relationSize+1
                });
            	relationStore.insert(relationSize, newRecord);
            	
            	// 联动因子属性表
        		Ext.getCmp('relationPropertyGrid').getStore().removeAll();
        		
        		// 设置选中行
        		Ext.getCmp('relationGrid').getSelectionModel().selectByPosition(
        				{row: relationSize});  
            }
        };
	}
});

