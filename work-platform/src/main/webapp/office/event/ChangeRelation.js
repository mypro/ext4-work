Ext.define('Layout.event.ChangeRelation',{
	extend: 'Layout.event.BaseEvent',
	
	eventName : 'changeRelation',
	
	declareCallbacks : [
	                    'serverCallback',
		                'editGridCallback',
		                'drawCallback'
	                   ],
	                  
	serverCallback : function(relation, fn, context){
		Layout.DataServer.saveRelation(relation.data, function(response){
				var result = Ext.decode(response.responseText);
				
				if(result.duplicate){
					context.stopCallback();
					throw new Error('relation duplicated!');
				}
				
		}, false, true);
	},             
	editGridCallback : function(relation){
		var editRelationGrid = Ext.getCmp('editRelationGrid');
		
		var gridRec = editRelationGrid.getStore().findRecordByKey('uuid', relation.get('uuid'));
		
		Ext.Array.each(Layout.model.RelationModel.getFields(), function(field){
			gridRec.set(field.name, relation.get(field.name));
		});
	},
	drawCallback : function(relation){
		// do nothing
	},
});