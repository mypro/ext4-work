Ext.define('Layout.controller.FactorController', {
	extend: 'Ext.app.Controller',
    
	init: function() {
		this.control({
//			'#editFactorPropGrid' : {
//    			afterLoadProperty : this.initFactorPanel
//            },
            '#factorPanel' : {
            	init : this.initFactorPanel,
            	editorBlur : this.blurEditor,
            	editorFocus : this.focusEditor
            }
        });
	},
	
	initFactorPanel: function(factor, parentUuid, parentType){
		var factorPanel = Ext.getCmp('factorPanel');
		
		factorPanel.isEditProperty = false;
		factorPanel.fireEvent('initForm', factor, parentUuid, parentType, false);
	},
	
	focusEditor : function(panel, index, editor){
		editor.originalValue = editor.getValue();
		
		panel.isEditing = true;
	},
	
	blurEditor : function(panel, index, editor){
		panel.isEditing = false;
		
		if(0 != index){
			return;
		}
		if(editor.getValue()!==editor.originalValue){
			panel.fireEvent('clickSave');
		}
	},
	
	saveFactor : function(factorDefineRecord, parentUuid, parentType){
		var ES = Layout.EventSchedule,
			fn;
		
		if(!(factorDefineRecord.defineUuid && factorDefineRecord.uuid)){
			throw new Error('factorUuid or factorDefine is null!');
		}
		
		if(RELATIONTYPE_RELATION_PROP == parentType){
			fn = function(factorDefineRecord, parentUuid){
				var records = ES.relationStore.findRecordsContainProp(factorDefineRecord.defineUuid);
				
				Ext.Array.each(records, function(record){
					record.setPropertyDefine(factorDefineRecord);
				});
			};
		}else if(RELATIONTYPE_FACTOR_PROP == parentType){
			fn = function(factorDefineRecord, parentUuid){
				var records = ES.factorStore.findRecordsContainProp(factorDefineRecord.defineUuid);
				
				Ext.Array.each(records, function(record){
					record.setPropertyDefine(factorDefineRecord);
				});
			};
		}else{
			fn = function(factorDefineRecord){
				factor = ES.factorStore.findRecordByKey('uuid', factorDefineRecord.uuid);
				Ext.apply(factor.data, factorDefineRecord);
			};
		}
		ES.fireEvent(ES.factorStore, 'editDefine', factorDefineRecord, parentUuid, parentType, fn);
	}
});