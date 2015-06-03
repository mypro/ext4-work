Ext.define('Layout.func.DataServer', {
	
    readFactor : function(uuid, callback, base, sync){
		Ext.Ajax.request({ 
			async : !sync,
			url: '../work-platform/loadFactor.do'+(base?'?base=true':''),
			params: {
				condition : Ext.encode({
					uuid : uuid
				})
			},
			success: callback || Ext.emptyFn
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
			success: callback || Ext.emptyFn
		});
	},
	
	readLayout : function(callback, base, sync){
		Ext.Ajax.request({ 
			async : !sync,
			url: '../work-platform/loadLayout.do'+(base?'?base=true':''),
			params: {
			},
			success: callback || Ext.emptyFn
		});
	},
	
	readLayoutDefine : function(callback, base, sync){
		Ext.Ajax.request({ 
			async : !sync,
			url: '../work-platform/loadLayoutDefine.do'+(base?'?base=true':''),
			params: {
			},
			success: callback || Ext.emptyFn
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
			success: callback || Ext.emptyFn
		});
	},
	
	deleteRelation : function(uuid, callback, base, sync){
		Ext.Ajax.request({ 
			async : !sync,
			url: '../work-platform/deleteRelation.do'+(base?'?base=true':''),
			params: {
				relationUuid : uuid
			},
			success: callback || Ext.emptyFn
		});
	},
	
	saveRelation : function(relationData, callback, base, sync){
		Ext.Ajax.request({ 
			async : !sync,
			url: '../work-platform/saveRelation.do'+(base?'?base=true':''),
			params: {
				addRecord : Ext.encode(relationData)
			},
			success: callback || Ext.emptyFn
		});
	},
	
	saveFactor : function(factor, parentUuid, parentType, callback, base, sync){
		Ext.Ajax.request({ 
			async : !sync,
			url: '../work-platform/saveFactor.do'+(base?'?base=true':''),
			params: {
				addRecord : Ext.encode(factor),
				parentUuid : parentUuid,
				parentType : parentType
			},
			success: callback || Ext.emptyFn
		});
	},
	
	importFactor : function(factor, callback, base, sync){
		Ext.Ajax.request({ 
			async : !sync,
			url: '../work-platform/importFactor.do'+(base?'?base=true':''),
			params: {
				record : Ext.encode(factor)
			},
			success: callback || Ext.emptyFn
		});
	},
	
	importRelation : function(relation, callback, base, sync){
		Ext.Ajax.request({ 
			async : !sync,
			url: '../work-platform/importRelation.do'+(base?'?base=true':''),
			params: {
				record : Ext.encode(relation)
			},
			success: callback || Ext.emptyFn
		});
	},
	
	updateValue : function(factorUuid, value, callback, base, sync){
		Ext.Ajax.request({ 
			async : !sync,
			url: '../work-platform/updateValue.do'+(base?'?base=true':''),
			params: {
				factorUuid : factorUuid,
				value : value
			},
			success: callback || Ext.emptyFn
		});
	},
	
	updateValues : function(records, callback, base, sync){
		Ext.Ajax.request({ 
			async : !sync,
			url: '../work-platform/updateValues.do'+(base?'?base=true':''),
			params: {
				records : Ext.encode(records)
			},
			success: callback || Ext.emptyFn
		});
	},
	
	addLayoutDefine : function(record, callback, base, sync){
		Ext.Ajax.request({ 
			async : !sync,
			url: '../work-platform/addLayoutDefine.do'+(base?'?base=true':''),
			params: {
				record : Ext.encode(record)
			},
			success: callback || Ext.emptyFn
		});
	},
	
	addLayout : function(positions, callback, base, sync){
		Ext.Ajax.request({ 
			async : !sync,
			url: '../work-platform/addLayout.do'+(base?'?base=true':''),
			params: {
				records : Ext.encode(positions)
			},
			success: callback || Ext.emptyFn
		});
	},
	
	updateLayout : function(positions, callback, base, sync){
		Ext.Ajax.request({ 
			async : !sync,
			url: '../work-platform/updateLayout.do'+(base?'?base=true':''),
			params: {
				records : Ext.encode(positions)
			},
			success: callback || Ext.emptyFn
		});
	},
	
	deleteLayoutDefine : function(define, callback, base, sync){
		Ext.Ajax.request({ 
			async : !sync,
			url: '../work-platform/deleteLayoutDefine.do'+(base?'?base=true':''),
			params: {
				record : Ext.encode(define)
			},
			success: callback || Ext.emptyFn
		});
	},
	
	layoutAlgorithm : function(type, factors, relations, callback, base, sync){
		Ext.Ajax.request({ 
			async : !sync,
			url: '../work-platform/layoutAlgorithm.do'+(base?'?base=true':''),
			params: {
				type : type,
				factors : Ext.encode(factors),
				relations : Ext.encode(relations)
			},
			success: callback || Ext.emptyFn
		});
	}
	
});

