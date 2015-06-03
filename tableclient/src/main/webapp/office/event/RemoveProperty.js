Ext.define('Layout.event.RemoveProperty',{
	extend: 'Layout.event.BaseEvent',
	
	eventName : 'removeProperty',
	
	declareCallbacks : [
	                    'serverCallback',
		                'editGridCallback',
		                'drawCallback',
		                'updateFactorCombo'
	                   ],
	
    serverCallback : function(record){
		Layout.DataServer.deleteFactor(record.get('uuid'), record.get('defineUuid'));
	},
	
	editGridCallback : function(record, fn, context){
		var grid = context.get('grid');
		
		grid && grid.getStore().remove(record);
	},
	
	drawCallback : function(record){
		// do nothing 
	}
	
});