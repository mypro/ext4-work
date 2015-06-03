Ext.define('Factor.controller.panel.FactorController', {
    extend: 'Factor.controller.Base',
    stores: [
             "FactorStore",
             "FactorPropertyStore",
             "RelationStore"
    ],
    models: [
             "FactorModel",
             "CommonFactorModel"
    ],
    views: [
            'window.FactorWindow'
    ],
    
    refs : [{  
        selector: '#factorWindow',  
        ref: 'factorWindow'  
    },{
    	selector: '#factorGrid',  
        ref: 'factorGrid'
    },{
    	selector: '#factorProperty',  
        ref: 'factorProperty'
    }],

    init: function() {
    	this.control({
        	'#factorGrid' : {
        		select : this.selectRow,
        		afterrender: this.onPanelRendered,
        		beforeitemclick : this.rowClick,
        		containerdblclick:this.containerdblclick,
        		containerclick:this.containerclick
            }
        });
    	
    },
    containerclick:function(){
//    	alert('containerclick');
    	document.getElementById('factorGrid_header').style.setProperty('background-image','none');
    	document.getElementById('factorGrid_header').style.setProperty('background-color','rgb(117, 177, 218)');
    	
    	document.getElementById('factorPropertyGrid_header').style.removeProperty('background-color');
    	document.getElementById('factorPropertyGrid_header').style.removeProperty('background-image');
    	document.getElementById('factorDataGrid_header').style.removeProperty('background-color');
    	document.getElementById('factorDataGrid_header').style.removeProperty('background-image');
    	document.getElementById('relationGrid_header').style.removeProperty('background-color');
    	document.getElementById('relationGrid_header').style.removeProperty('background-image');
    	document.getElementById('relationPropertyGrid_header').style.removeProperty('background-color');
    	document.getElementById('relationPropertyGrid_header').style.removeProperty('background-image');
    	document.getElementById('relationDataGrid_header').style.removeProperty('background-color');
    	document.getElementById('relationDataGrid_header').style.removeProperty('background-image');
    	
    },
    afterStoreLoad : function(records){
    	var record = this.findRecord('uuid', defaultSelectUuid),
    		grid = Ext.getCmp('factorGrid');
		if(record){
			var selected = Ext.create('Ext.util.MixedCollection');
			
			selected.add(record);
			Ext.select('#'+grid.id+' tr[data-recordid='+defaultSelectUuid+']')
						.addCls('x-grid-row-selected');
			grid.fireEvent(
						'select', {
							selected : selected
						});
		}
    },
    
    onPanelRendered : function(){
//    	this.getFactorGrid().getStore().sort({
//            property: 'name',
//            direction: 'ASC'
//        });
    	this.getFactorGrid().columns[5].hide();
		this.getFactorGrid().columns[6].hide();
    },
    
    rowClick : function(row, record, item, index, e){
    	this.containerclick();
    	var valueLabelUuid= record.get('valueLabelUuid');
    	setFactorPropertyInputGrid(valueLabelUuid,record.get('value'));
    	propertyGridActivity();
    	setGlobleVariate('Factor',record.get('uuid'),record.get('defineUuid'));
    	this.getFactorProperty().setSource({
//    		"defineUuid":e.selected.getAt(0).get('uuid'),
            "name": record.get('name'),
            "format": record.get('format'),
            "width": record.get('width'),
            "decimalWidth": record.get('decimalWidth'),
            "valueLabelUuid": record.get('valueLabelUuid')/*,
            "missing": '',
            "showWidth":'',
            "showAlign": '',
            "measure": record.get('measure'),
            "role":record.get('role')*/
        });
    	Factor.App.getPanelFactorPropertyGridControllerController().getFactorProperty().plugins[0].startEdit(0, 2);
    	Factor.App.getPanelFactorPropertyGridControllerController().getFactorProperty().setTitle('正在编辑【因子表】');
    },
    
    selectRow : function(e, obj ,row){
    	if(0 == e.selected.length){
    		return;
    	}
    	var factorUuid = e.selected.getAt(0).get('uuid');
    	this.getFactorProperty().setSource({
//    		"defineUuid":e.selected.getAt(0).get('uuid'),
            "name": e.selected.getAt(0).get('name'),
            "format": e.selected.getAt(0).get('format'),
            "width": e.selected.getAt(0).get('width'),
            "decimalWidth": e.selected.getAt(0).get('decimalWidth'),
            "valueLabelUuid": e.selected.getAt(0).get('valueLabelUuid')/*,
            "missing": '',
            "showWidth":'',
            "showAlign": '',
            "measure": e.selected.getAt(0).get('measure'),
            "role": e.selected.getAt(0).get('role')*/
        });
    	setGlobleVariate('Factor',factorUuid,e.selected.getAt(0).get('defineUuid'));
    	//如果存在数据区查询，联动数据区
    	if(''===e.selected.getAt(0).get('queryUuid')||null==e.selected.getAt(0).get('queryUuid')){
    		Ext.getCmp('dataFilterForm').down('#queryUuid').setValue("");
    		Ext.getCmp('dataFilterForm').down('#dsKeyword').setValue("");
			Ext.getCmp('dataFilterForm').down('#dbKeyword').setValue("");
			Ext.getCmp('dataFilterForm').down('#tableKeyword').setValue("");
			Ext.getCmp('dataFilterForm').down('#valueKeyword').setValue("");
			Ext.getCmp('dataFilterForm').down('#resultField').setValue("");
    	}else{
    		Factor.App.getPanelFactorDataControllerController().setFactorData(e.selected.getAt(0).get('queryUuid'),e.selected.getAt(0).get('valueKeyword'));
    	}
    	// 联动因子属性表
    	Factor.App.getPanelFactorPropertyControllerController().getFactorPropertyGrid().getStore().load({
			params:{
				condition : Ext.encode({
					parentUuid : factorUuid,
					parentType : 1
				})
			}
		});
    	
    	// 联动因子关系表
    	Factor.App.getPanelRelationControllerController().getRelationGrid().getStore().load({
			params:{
				condition : Ext.encode({
					factorUuid : factorUuid
				})
			}
		});
    	Factor.App.getPanelFactorPropertyGridControllerController().getFactorProperty().plugins[0].startEdit(0, 2);
    	Factor.App.getPanelFactorPropertyGridControllerController().getFactorProperty().setTitle('正在编辑【因子表】');
    },
    
	beforeEdit : function(){
		var me = Factor.App.getController("panel.FactorController");
		var selectModel = me.getFactorGrid().selModel;
		var row = selectModel.selectionStart.index;
		me.selectRow = row;
	},
	
	editFinish : function(component){
		var me = Factor.App.getController("panel.FactorController");
		var record = me.getFactorGrid().getStore().getAt(me.selectRow);
		var factorUuid = record.get('uuid');
		
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
	containerdblclick:function(e , eOpts){
		var x = 10;
		var y = 10;
		var factor = Factor.DefaultDefine.createFactor(1, x, y);
		/*var NAME_FACTOR='新建因子',
		NAME_PROPERTY = '\u5c5e\u6027';
		var factorDefineName='';
		factorDefineName= SEQ.seq(NAME_FACTOR, function(newName){
				var s=Factor.App.getPanelFactorControllerController().getFactorGrid().getStore().findExact('name', newName);
    			return s!=-1?true:false;
    		});
		
		var record={
				defineUuid:new UUID().id, 
				measure:'', 
				width:8, 
				createLevel:1, 
				label:'', 
				relationUuid:'', 
				format:'85806344e6354482822f28ff055bcdd0', 
				prototype:0, 
				dataType:1, 
				decimalWidth:0, 
				valueLabelUuid:'', 
				name:factorDefineName, 
				value:'', 
				seq:Factor.App.getPanelFactorControllerController().getFactorStoreStore().getCount()>0?(Factor.App.getPanelFactorControllerController().getFactorStoreStore().getAt(Factor.App.getPanelFactorControllerController().getFactorStoreStore().getCount()-1).get('seq')+1024):0, 
				role:'', 
				childs:factorChildren
		};*/
		
		// http request 保存
		Ext.Ajax.request({ 
			url: '../work-platform/importFactor.do',
			params: {
				record : Ext.encode(factor.data),
			},
			success: function(response, options) {
				var result = Ext.JSON.decode(response.responseText); 
				if(result.duplicate){
					Ext.Msg.alert('','名称重复');
					return;
				}
				Factor.App.getPanelFactorControllerController().getFactorGrid().getStore().reload();
				factor1Store.reload();
				factor2Store.reload();
				var factorStore=Factor.App.getTreeFactorTreeControllerController().getFactorTreeStoreStore();
				factorStore.load();
				defaultSelectUuid=result.uuid;
//				var sm=Factor.App.getPanelFactorControllerController().getFactorGrid().getSelectionModel( );
//				sm.select(Factor.App.getPanelFactorControllerController().getFactorGrid().getStore().getCount()-1);
			}
		});						
	},
	/*createFactor : function(shape){
    	var factor = new Factor.model.CommonFactorModel();
    	
    	defaultFactorProp[1].value = shape;
    	defaultFactorProp[2].value = '30';
//    	defaultFactorProp[3].value = x;
//    	defaultFactorProp[4].value = y;
    	
    	this.defaultFactorDefine.name = SEQ.seq(NAME_FACTOR, function(newName){
			var s=Factor.App.getPanelFactorControllerController().getFactorGrid().getStore().findExact('name', newName);
			return s!=-1?true:false;
		});
    	
		Ext.apply(factor.data, this.defaultFactorDefine);
		Ext.Array.each(defaultFactorProp, function(prop){
			if(prop.notNull){
				factor.addProperty(prop);
			}
    	});
		return factor;
    },*/
	deleteFactor:function(){
		var me = Factor.App.getController('panel.FactorController');
    	var factorSelectModel = me.getFactorGrid().selModel;
		if(0 == factorSelectModel.selected.length){
			return ;
	    }
//		var row = factorSelectModel.selectionStart.index;
//		var record = me.getFactorGrid().getStore().getAt(row);
		
		var deleteJson=[];
		var Store= me.getFactorGrid().getStore();
		var sm =me.getFactorGrid().getSelectionModel();
		
		Ext.MessageBox.confirm('确认', '确定要删除选中因子?', function(btn){
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
//						Factor.App.getPanelFactorControllerController().getFactorGrid().getStore().reload();
						factor1Store.reload();
						factor2Store.reload();
						me.getRelationStoreStore().load();
					}
				});
			}
			
		});
		
	}
	
});