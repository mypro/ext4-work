Ext.define('Layout.event.RemoveFactor',{
	extend: 'Layout.event.BaseEvent',
	
	eventName : 'removeFactor',
	
	declareCallbacks : [
	                    'serverCallback',
		                'editGridCallback',
		                'drawCallback',
		                'updateFactorCombo'
	                   ],
	                   
	serverCallback : function(record){
		Layout.DataServer.deleteFactor(record.get('uuid'), record.get('defineUuid'), 
				function(){},false);
	},
	
	editGridCallback : function(record){
		var uuid = record.get('uuid'),
			editGridStore = Ext.getCmp('editFactorGrid').getStore(),
			deleteRecord = editGridStore.findRecordByKey('uuid', uuid);
		
		if(deleteRecord){
			editGridStore.remove(deleteRecord);
		}
	},
	
	drawCallback : function(record, fn, context){
		var uuid = record.get('uuid'),
			ES = Layout.EventSchedule,
			links,
			papers = context.getPapers();
		
		// remove relation in store
		links = papers[0].model.getConnectedLinks(
				papers[0].model.getCell(uuid));
		
		papers = context.eachPaper(function(paper){
			paper.model.getCell(uuid).remove();
			
			var valueCell = paper.model.getCell('value_'+uuid);
			if(valueCell){
				valueCell.remove();
			}
		});
		
		Ext.Array.each(links, function(link){
			var deleteRelation = ES.relationStore.findRecordByKey('uuid', link.id);
			ES.relationStore.remove(deleteRelation);
		});
	}   
	
});