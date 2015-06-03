Ext.define('Factor.controller.tree.FactorTreeController', {
    extend: 'Factor.controller.Base',
    stores: [
             "FactorTreeStore",
             "FactorPropertyStore",
             "RelationPropertyStore"
    ],
    models: [
//             "FactorModel"   
    ],
    views: [
//            'window.FactorWindow'
    ],
    
    refs : [{  
        selector: '#factorGrid',  
        ref: 'factorGrid'  
    },{  
        selector: '#relationGrid',  
        ref: 'relationGrid'  
    },{  
        selector: '#factorTree',  
        ref: 'factorTree'  
    }],

    init: function() {
    	this.control({
        	'#factorTree' : {
            }
        });
    },
    
    addFactorInstance : function(factorDefineUuid, parentType){
    	var me = Factor.App.getController("tree.FactorTreeController");
    	var selectItems=Factor.App.getTreeFactorTreeControllerController().getFactorTree().selModel.selected.items;
    	var parentUuid;
    	if(2 == parentType){
    		var selectModel = me.getRelationGrid().selModel;
    		if(0 == selectModel.selected.length){
    			return;
    	    }
    		parentUuid = selectModel.selected.items[0].get('uuid');
    	}else{
    		var factorSelectModel = me.getFactorGrid().selModel;
    		if(0 == factorSelectModel.selected.length){
    			return;
    	    }
    		parentUuid = factorSelectModel.selected.items[0].get('uuid');
    	}
    	var factorDefineRecord={
    			createLevel: selectItems[0].raw['createLevel'],
				dataType: selectItems[0].raw['dataType'],
				decimalWidth:selectItems[0].raw['decimalWidth'],
				defineUuid:selectItems[0].raw['defineUuid'],
				format: selectItems[0].raw['format'],
				label: selectItems[0].raw['label'],
				leaf: selectItems[0].raw['leaf'],
				measure: selectItems[0].raw['measure'],
				missing: selectItems[0].raw['missing'],
				name: selectItems[0].raw['name'],
				prototype:selectItems[0].raw['prototype'],
				role: selectItems[0].raw['role'],
				seq: selectItems[0].raw['seq'],
				showAlign: selectItems[0].raw['showAlign'],
				showWidth: selectItems[0].raw['showWidth'],
				text: selectItems[0].raw['text'],
				uuid: selectItems[0].raw['uuid'],
				valueLabelUuid: selectItems[0].raw['valueLabelUuid'],
				width: selectItems[0].raw['width'],
				value:''
    	};
    	
		// parent信息
	
		// http request 保存
		Ext.Ajax.request({ 
		url: '../work-platform/saveFactor.do',
		params: {
			addRecord : Ext.encode(factorDefineRecord),
			parentUuid : parentUuid,
			parentType :parentType
		},
		success: function(response, options) {
			var result = Ext.JSON.decode(response.responseText); 
			if(result.duplicate){
				Ext.Msg.alert('','名称重复');
				return;
			}
			if(2 == parentType){
				Factor.App.getPanelRelationPropertyControllerController().getRelationPropertyGrid().getStore().load({
					params:{
						condition : Ext.encode({
							parentUuid : parentUuid,
							parentType : parentType
						})
					}
				});
			}else{
				Factor.App.getPanelFactorPropertyControllerController().getFactorPropertyGrid().getStore().load({
						params:{
							condition : Ext.encode({
								parentUuid : parentUuid,
								parentType : parentType
							})
						}
					});
			}
			Factor.App.getTreeFactorTreeControllerController().getFactorTreeStoreStore().load();
		}
		});
    	
    	/*Ext.Ajax.request({ 
			url: '../work-platform/saveFactorInstance.do',
			params: {
				factorDefineUuid : factorDefineUuid,
				parentUuid : parentUuid,
				parentType : parentType
			},
			success: function(response, options) {
				var result = Ext.JSON.decode(response.responseText); 
				if(result.duplicate){
					Ext.Msg.alert('','属性重复');
					return;
				}
				
				if(2==parentType){
					me.getRelationPropertyStoreStore().load({
						params:{
							condition : Ext.encode({
								parentUuid : parentUuid
							})
						}
					});
				}else{
					me.getFactorPropertyStoreStore().load({
						params:{
							condition : Ext.encode({
								parentUuid : parentUuid
							})
						}
					});
				}
			}
		});*/
    }
});