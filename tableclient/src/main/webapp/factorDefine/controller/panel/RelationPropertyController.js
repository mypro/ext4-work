Ext.define('Factor.controller.panel.RelationPropertyController', {
    extend: 'Factor.controller.Base',
    stores: [
             "RelationPropertyStore",
             "RelationDataStore"
    ],
    models: [
             "RelationPropertyModel"   
    ],
    views: [
//            'window.FactorWindow'
    ],
    controllers:[
               'window.FactorWindowController'
    ],
    
    refs : [{  
        selector: '#factorWindow',  
        ref: 'factorWindow'  
    },{
    	selector: '#relationGrid',  
        ref: 'relationGrid'
    },{
    	selector: '#relationPropertyGrid',  
        ref: 'relationPropertyGrid'
    },{
    	selector: '#factorProperty',  
        ref: 'factorProperty'
    }],

    init: function() {
    	this.control({
        	'#relationPropertyGrid' : {
        		afterrender: this.onPanelRendered,
        		select : this.selectRow,
        		beforeitemclick : this.rowClick,
        		containerdblclick:this.containerdblclick,
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
    	document.getElementById('relationGrid_header').style.removeProperty('background-color');
    	document.getElementById('relationGrid_header').style.removeProperty('background-image');
    	
    	document.getElementById('relationPropertyGrid_header').style.setProperty('background-image','none');
    	document.getElementById('relationPropertyGrid_header').style.setProperty('background-color','rgb(117, 177, 218)');

    	document.getElementById('relationDataGrid_header').style.removeProperty('background-color');
    	document.getElementById('relationDataGrid_header').style.removeProperty('background-image');
    },
    
    onPanelRendered : function(){
    	this.getRelationPropertyGrid().columns[7].hide();
		this.getRelationPropertyGrid().columns[8].hide();
    },
    rowClick : function(row, record, item, index, e){
    	this.containerclick();
    	var valueLabelUuid= record.get('valueLabelUuid');
    	setFactorPropertyInputGrid(valueLabelUuid,record.get('value'));
    	propertyGridActivity();
    	setGlobleVariate('FactorRelationProperty',record.get('uuid'),record.get('defineUuid'));
    	this.getFactorProperty().setSource({
//    		"defineUuid":e.selected.getAt(0).get('uuid'),
            "name": record.get('name'),
            "format": record.get('format'),
            "width": record.get('width'),
            "decimalWidth": record.get('decimalWidth'),
            "valueLabelUuid": record.get('valueLabelUuid')
            /*"missing": '',
            "showWidth":'',
            "showAlign": '',
            "measure": record.get('measure'),
            "role": record.get('role'),
            "dataSourceUuid":record.get('dataSourceUuid'),*/
    		/*"dataBaseUuid":record.get('dataBaseUuid'),
    		"dataTableUuid":record.get('dataTableUuid'),
    		"dataColumnUuid":record.get('dataColumnUuid')*/
        });
    	Factor.App.getPanelFactorPropertyGridControllerController().getFactorProperty().plugins[0].startEdit(0, 2);
    	Factor.App.getPanelFactorPropertyGridControllerController().getFactorProperty().setTitle('正在编辑【关系属性表】');
    },
    selectRow : function(e, obj ,row){
    	this.containerclick();
    	if(0 == e.selected.length){
    		return;
    	}
    	this.getFactorProperty().setSource({
//    		"defineUuid":e.selected.getAt(0).get('uuid'),
            "name": e.selected.getAt(0).get('name'),
            "format": e.selected.getAt(0).get('format'),
            "width": e.selected.getAt(0).get('width'),
            "decimalWidth": e.selected.getAt(0).get('decimalWidth'),
            "valueLabelUuid": e.selected.getAt(0).get('valueLabelUuid')
            /*"missing": '',
            "showWidth":'',
            "showAlign": '',
            "measure": e.selected.getAt(0).get('measure'),
            "role": e.selected.getAt(0).get('role'),
            "dataSourceUuid":e.selected.getAt(0).get('dataSourceUuid'),*/
    		/*"dataBaseUuid":e.selected.getAt(0).get('dataBaseUuid'),
    		"dataTableUuid":e.selected.getAt(0).get('dataTableUuid'),
    		"dataColumnUuid":e.selected.getAt(0).get('dataColumnUuid')*/
        });
    	setGlobleVariate('FactorRelationProperty',e.selected.getAt(0).get('uuid'),e.selected.getAt(0).get('defineUuid'));
    	if(''===e.selected.getAt(0).get('queryUuid')||null==e.selected.getAt(0).get('queryUuid')){
    		Ext.getCmp('dataFilterForm').down('#queryUuid').setValue("");
    		Ext.getCmp('dataFilterForm').down('#dsKeyword').setValue("");
			Ext.getCmp('dataFilterForm').down('#dbKeyword').setValue("");
			Ext.getCmp('dataFilterForm').down('#tableKeyword').setValue("");
			Ext.getCmp('dataFilterForm').down('#valueKeyword').setValue("");
			Ext.getCmp('dataFilterForm').down('#resultField').setValue("");
    		var columns = [Ext.create('Ext.grid.RowNumberer'),{header : 'uuid',hideable : false,hidden : true,dataIndex : 'uuid',width : 60,editor : {xtype : 'textfield'}},
    		           {header : 'defineUuid',hideable : false,hidden : true,dataIndex : 'defineUuid',width : 60,editor : {xtype : 'textfield'}},
    		           {header : 'defineName',hideable : false,hidden : true,dataIndex : 'defineName',width : 60,editor : {xtype : 'textfield'}},
    		           {header : 'type',hideable : false,hidden : true,dataIndex : 'type',width : 60,editor : {xtype : 'textfield'}},
    		           { header: '值',dataIndex: 'value',width: 120,align:'center'},
    		           { header: '标签',dataIndex: 'label',width: 120,align:'center'}
    		 ];
	    	this.getRelationDataStoreStore().load({
				params:{
					tblUuid : T_PARAM_TABLE,
					defineUuid:e.selected.getAt(0).get('valueLabelUuid')
				}
			});
	    	Factor.App.getPanelRelationDataControllerController().getRelationDataGrid().reconfigure( this.getRelationDataStoreStore(), columns);
    	}else{
    		Factor.App.getPanelRelationDataControllerController().setFactorData(e.selected.getAt(0).get('queryUuid'),e.selected.getAt(0).get('valueKeyword'));
    	}
    	this.getRelationDataStoreStore().sort({
            property: 'seq',
            direction: 'ASC'
        });
    	// 设置editor
    	var dataType = e.selected.getAt(0).get('dataType');
    	switch(dataType){
    	case 2:
    		this.getRelationPropertyGrid().columns[6].hide();
    		this.getRelationPropertyGrid().columns[7].show();
    		this.getRelationPropertyGrid().columns[8].hide();
    		break;
    	case 3:
    		this.getRelationPropertyGrid().columns[6].hide();
    		this.getRelationPropertyGrid().columns[7].hide();
    		this.getRelationPropertyGrid().columns[8].show();
    		break;
    	default :
    		this.getRelationPropertyGrid().columns[6].show();
			this.getRelationPropertyGrid().columns[7].hide();
			this.getRelationPropertyGrid().columns[8].hide();
    		break;
    	}
    },
    
	
	beforeEdit : function(){
		var me = Factor.App.getController("panel.RelationPropertyController");
		var selectModel = me.getRelationPropertyGrid().selModel;
		var row = selectModel.selectionStart.index;
		me.selectRow = row;
	},
	
	editFinish : function(component){
		var me = Factor.App.getController("panel.RelationPropertyController");
		var record = me.getRelationPropertyGrid().getStore().getAt(me.selectRow);
		var factorUuid = record.get('factor2Uuid');
		
		Ext.Ajax.request({ 
			url: '../work-platform/updateValue.do',
			params: {
				factorUuid : factorUuid,
				value : component.lastValue
			},
			success: function(response, options) {
			}
		});
	},
	containerdblclick:function(){
		var NAME_PROPERTY='新建关系属性';
		var relationProDefineName='';
		relationProDefineName= SEQ.seq(NAME_PROPERTY, function(newName){
				var s=Factor.App.getPanelFactorPropertyControllerController().getFactorPropertyGrid().getStore().findExact('name', newName);
    			return s!=-1?true:false;
    		});
		var factorDefineRecord={
								dataType:1, 
								decimalWidth:0, 
								defineUuid:'', 
								typeShow:"数值(N)", 
								valueLabelUuid:'', 
								name:relationProDefineName, 
								width:8, 
								createLevel:2, 
								uuid:'', 
								format:COLUMNTYPE_DECIMAL};
		// parent信息
		var parentUuid;
		var selectModel = this.getRelationGrid().selModel;
		if(0 < selectModel.selected.length){
			parentUuid = selectModel.selected.items[0].get('uuid');
	    
			Ext.Ajax.request({ 
				url: '../work-platform/saveFactor.do',
				params: {
					addRecord : Ext.encode(factorDefineRecord),
					parentUuid : parentUuid,
					parentType : 2
				},
				success: function(response, options) {
					var result = Ext.JSON.decode(response.responseText); 
					if(result.duplicate){
						Ext.Msg.alert('','名称重复');
						return;
					}
					
					Factor.App.getPanelRelationPropertyControllerController().getRelationPropertyGrid().getStore().load({
						params:{
							condition : Ext.encode({
								parentUuid : parentUuid,
								parentType :2
							})
						}
					});
					Factor.App.getTreeFactorTreeControllerController().getFactorTreeStoreStore().load();
					
					var sm=Factor.App.getPanelFactorPropertyControllerController().getFactorPropertyGrid().getSelectionModel( );
					sm.select(Factor.App.getPanelFactorPropertyControllerController().getFactorPropertyGrid().getStore().getCount()-1);
				}
			});
		}
	},
	deleteRelationProperty:function(){
		var me = Factor.App.getController('panel.RelationPropertyController');
    	var selectModel = me.getRelationPropertyGrid().selModel;
		if(0 == selectModel.selected.length){
			return ;
	    }
		/*var row = selectModel.selectionStart.index;
		var record = me.getRelationPropertyGrid().getStore().getAt(row);*/
		var deleteJson=[];
		var Store= me.getRelationPropertyGrid().getStore();
		var sm =me.getRelationPropertyGrid().getSelectionModel();
		for(var i=0;i<sm.getSelection().length;i++){
			if("2"===(sm.getSelection()[i].get('prototype')+"")){
				 Ext.MessageBox.alert('提示', '您选中的属性包含固有属性，关系固有属性不能删除！');
				 return;
			}
		}
		
		
		Ext.MessageBox.confirm('确认', '确定要删除选中关系属性?', function(btn){
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
					url: '../work-platform/deleteFactorInstances.do',
					params: {
						deleteFactorInstances:Ext.encode(deleteJson)
					},
					success: function(response, options) {
						var selectModel = me.getRelationGrid().selModel;
						if(0 < selectModel.selected.length){
							parentUuid = selectModel.selected.items[0].get('uuid');
					    }
						
						me.getRelationPropertyStoreStore().load({
							params:{
								condition : Ext.encode({
									parentUuid : parentUuid,
									parentType :2
								})
							}
						});
					}
				});
			}
		});
	}
	
});