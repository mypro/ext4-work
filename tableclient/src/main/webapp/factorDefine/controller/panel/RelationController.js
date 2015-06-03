Ext.define('Factor.controller.panel.RelationController', {
    extend: 'Factor.controller.Base',
    stores: [
             "RelationStore",
             "RelationPropertyStore"
    ],
    models: [
             "RelationModel"   
    ],
    
    refs : [{  
        selector: '#relationWindow',  
        ref: 'relationWindow'  
    },{
    	selector: '#relationGrid',  
        ref: 'relationGrid'
    },{
    	selector: '#factorProperty',  
        ref: 'factorProperty'
    }],

    init: function() {
        this.control({
        	'#relationGrid' : {
        		select : this.selectRow,
        		beforeitemclick : this.rowClick,
        		itemdblclick : this.itemdblclick,
        		containerdblclick:this.containerdblclick,
        		cellclick:this.cellclick,
        		containerclick:this.containerclick
            }
        });
    },
    containerclick:function(){
//    	alert('containerclick');
    	document.getElementById('factorGrid_header').style.removeProperty('background-color');
    	document.getElementById('factorGrid_header').style.removeProperty('background-image');
    	document.getElementById('factorPropertyGrid_header').style.removeProperty('background-color');
    	document.getElementById('factorPropertyGrid_header').style.removeProperty('background-image');
    	document.getElementById('factorDataGrid_header').style.removeProperty('background-color');
    	document.getElementById('factorDataGrid_header').style.removeProperty('background-image');
    	
    	document.getElementById('relationGrid_header').style.setProperty('background-image','none');
    	document.getElementById('relationGrid_header').style.setProperty('background-color','rgb(117, 177, 218)');

    	document.getElementById('relationPropertyGrid_header').style.removeProperty('background-color');
    	document.getElementById('relationPropertyGrid_header').style.removeProperty('background-image');
    	document.getElementById('relationDataGrid_header').style.removeProperty('background-color');
    	document.getElementById('relationDataGrid_header').style.removeProperty('background-image');
    },
    cellclick:function(tree, dom, column, cell) {
		var selectFactorName=dom.textContent;
		//遍历因子，加样式
		var factorStore=Factor.App.getPanelFactorControllerController().getFactorGrid().getStore();
		var sm=Factor.App.getPanelFactorControllerController().getFactorGrid().getSelectionModel( );
		for(var i=0;i<factorStore.getCount();i++){
    		var recordFactor=factorStore.getAt(i);
    		if(selectFactorName===recordFactor.get('name')){
    			console.log(recordFactor.get('name'));
//    			sm.select(recordFactor);
    			Factor.App.getPanelFactorControllerController().getFactorGrid().getView( ).focusRow(recordFactor.index);
    		}
    	}
	},
/*    itemdblclick:function(view,record,item,index,e,eOpts ){
    	var factorStore=Factor.App.getPanelFactorControllerController().getFactorGrid().getStore();
    	var relationFactor=[];
    	for(var i=0;i<factorStore.getCount();i++){
    		var recordFactor=factorStore.getAt(i);
    		if(record.get('factor1Uuid')===recordFactor.get('uuid')||record.get('factor2Uuid')===recordFactor.get('uuid')){
    			relationFactor.push(recordFactor);
    		}
    	}
    	factorStore.removeAll();
    	factorStore.add(relationFactor);
    	
    },*/
    rowClick:function(row, record, item, index, e){
    	this.containerclick();
    	Ext.getCmp('triggerfield-numberfield').setVisible(false);
    	Ext.getCmp('triggerfield-combo').setVisible(false);
    	Ext.getCmp('triggerfield-textfield').setVisible(false);
    	Ext.getCmp('triggerfield-datefield').setVisible(false);
    	Ext.getCmp('triggerfield-triggerfield').setVisible(false);
    	propertyGridActivity();
    	setGlobleVariate('Relation',record.get('uuid'),0);
    	this.getFactorProperty().setSource({
            "factor1Uuid": record.get('factor1Uuid'),
            "factor2Uuid": record.get('factor2Uuid')
        });
    	Factor.App.getPanelFactorPropertyGridControllerController().getFactorProperty().plugins[0].startEdit(0, 2);
    	Factor.App.getPanelFactorPropertyGridControllerController().getFactorProperty().setTitle('正在编辑【关系表】');
    },
    selectRow : function(e, obj ,row){
    	if(0 == e.selected.length){
    		return;
    	}
    	this.getFactorProperty().setSource({
            "factor1Uuid": e.selected.getAt(0).get('factor1Uuid'),
            "factor2Uuid": e.selected.getAt(0).get('factor2Uuid')
        });
    	setGlobleVariate('Relation',e.selected.getAt(0).get('uuid'),0);
    	var relationUuid = e.selected.getAt(0).get('uuid');
    	
    	// 联动关系属性表
    	this.getRelationPropertyStoreStore().load({
			params:{
				condition : Ext.encode({
					parentUuid : relationUuid,
					parentType : 2
				})
			}
		});
    	
    },
	containerdblclick:function(){
		var relationRecord = {
				uuid:'', 
				factor1Uuid:'', 
				type:0, 
				factor2Uuid:''
				};
		 var r = Ext.create('Factor.model.RelationModel', {
	            'uuid':'',
	            'factor1Uuid':'1',
	            'factor2Uuid':'2',
	            'factor1Name':'新建因子1',
	            'factor2Name':'新建因子2',
	            'type': 2,
	            'seq':''
		 });
		 var store =Factor.App.getPanelRelationControllerController().getRelationGrid().getStore();
		 store.insert(store.getCount(),r);
		 var sm=Factor.App.getPanelRelationControllerController().getRelationGrid().getSelectionModel( );
			sm.select(0);
			sm.select(Factor.App.getPanelRelationControllerController().getRelationGrid().getStore().getCount()-1);
			Ext.getCmp('triggerfield-numberfield').setVisible(false);
	    	Ext.getCmp('triggerfield-combo').setVisible(false);
	    	Ext.getCmp('triggerfield-textfield').setVisible(false);
	    	Ext.getCmp('triggerfield-datefield').setVisible(false);
	    	Ext.getCmp('triggerfield-triggerfield').setVisible(false);
	    	Factor.App.getPanelFactorPropertyGridControllerController().getFactorProperty().plugins[0].startEdit(0, 2);
	    	Factor.App.getPanelFactorPropertyGridControllerController().getFactorProperty().setTitle('正在编辑【关系表】');
	},
	deleteRelation:function(){
		var me = Factor.App.getController('panel.RelationController');
    	var factorSelectModel = me.getRelationGrid().selModel;
		if(0 == factorSelectModel.selected.length){
			return ;
	    }
		/*var row = factorSelectModel.selectionStart.index;
		var record = me.getRelationGrid().getStore().getAt(row);*/
		
		var deleteJson=[];
		var Store=  me.getRelationGrid().getStore();
		var sm = me.getRelationGrid().getSelectionModel();
		Ext.MessageBox.confirm('确认', '确定要删除选中关系?', function(btn){
			if('yes'===btn){
				Store.remove(sm.getSelection());
		        if (Store.getCount() > 0) {
		            sm.select(0);
		        }
		        var delstores= Store.getRemovedRecords();
		        if(delstores.length>0){
			    	for(var i=0;i<delstores.length;i++){
			    		var record = delstores[i];
			    		deleteJson.push(record.data);
			    	}
		    	}
				
				Ext.Ajax.request({ 
					url: '../work-platform/deleteRelations.do',
					params: {
						deleteRelations:Ext.encode(deleteJson)
					},
					success: function(response, options) {
		//				me.getRelationStoreStore().load();
					}
				});
			}
		});
	},
	saveRelation:function(store,record){
		if(''===record.uuid){
			Ext.Ajax.request({ 
				url: '../work-platform/importRelation.do',
				params: {
					record : Ext.encode(record)
				},
				success: function(response, options) {
					var result = Ext.JSON.decode(response.responseText); 
					if(result.duplicate){
						Ext.Msg.alert('','关系重复');
						return;
					}
					
					Factor.App.getPanelRelationControllerController().getRelationGrid().getStore().load({
						params:{
							condition : Ext.encode({
								factorUuid : store.getAt(0).get('value')
							})
						}
					});
				}
			});
		}else{
			Ext.Ajax.request({ 
				url: '../work-platform/saveRelation.do',
				params: {
					addRecord : Ext.encode(record)
				},
				success: function(response, options) {
					var result = Ext.JSON.decode(response.responseText); 
					if(result.duplicate){
						Ext.Msg.alert('','关系重复');
						return;
					}
					
					Factor.App.getPanelRelationControllerController().getRelationGrid().getStore().sync();/*load({
						params:{
							condition : Ext.encode({
								factorUuid : store.getAt(0).get('value')
							})
						}
					});*/
				}
			});
		}
	}
});

