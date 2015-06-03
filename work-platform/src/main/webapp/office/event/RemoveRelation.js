Ext.define('Layout.event.RemoveRelation',{
	extend: 'Layout.event.BaseEvent',
	
	eventName : 'removeRelation',
	
	declareCallbacks : [
	                    'serverCallback',
		                'editGridCallback',
		                'drawCallback'
	                   ],
	                   
    serverCallback : function(record){
		Layout.DataServer.deleteRelation(record.get('uuid'));
	},
	
	editGridCallback : function(record){
		var uuid = record.get('uuid'),
			editGridStore = Ext.getCmp('editRelationGrid').getStore(),
			deleteRecord = editGridStore.findRecordByKey('uuid', uuid);
		
		if(deleteRecord){
			editGridStore.remove(deleteRecord);
		}
	},
	
	drawCallback : function(record, fn, context){
		var uuid = record.get('uuid');
		
		context.eachPaper(function(paper){
			paper.model.getCell(uuid).remove();
		});
	}
	
});