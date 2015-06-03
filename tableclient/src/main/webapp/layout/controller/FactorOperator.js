Ext.define('Layout.controller.FactorOperator', {
    extend: 'Ext.app.Controller',
    
    init: function() {
    },
    
    readFactor : function(uuid, callback, base, sync){
		Ext.Ajax.request({ 
			async : !sync,
			url: '../work-platform/loadFactor.do'+(base?'?base=true':''),
			params: {
				condition : Ext.encode({
					uuid : uuid
				})
			},
			success: callback
		});
	},
	
	readRelation : function(uuid, callback, base, sync){
		Ext.Ajax.request({ 
			async : !sync,
			url: '../work-platform/loadRelation.do?'+(base?'?base=true':''),
			params: {
				condition : Ext.encode({
					uuid : uuid
				})
			},
			success: callback
		});
	},
	
	deleteFactor : function(uuid, defineUuid, callback, base, sync){
		Ext.Ajax.request({ 
			async : !sync,
			url: '../work-platform/deleteFactorInstance.do'+(base?'?base=true':''),
			params: {
				factorUuid : uuid,
				defineUuid : defineUuid
			},
			success: callback
		});
	},
	
	deleteRelation : function(uuid, callback, base, sync){
		Ext.Ajax.request({ 
			async : !sync,
			url: '../work-platform/deleteRelation.do'+(base?'?base=true':''),
			params: {
				relationUuid : uuid
			},
			success: callback
		});
	},
	
	addProperty : function(parentUuid, parentType, propertyRec, callback, base, sync){
		Ext.Ajax.request({ 
			async : !sync,
			url: '../work-platform/saveFactor.do'+(base?'?base=true':''),
			params: {
				addRecord : Ext.encode(propertyRec.data),
				parentUuid : parentUuid,
				parentType : parentType
			},
			success: callback
		});
	}
});

