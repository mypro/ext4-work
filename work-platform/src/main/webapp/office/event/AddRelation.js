Ext.define('Layout.event.AddRelation',{
	extend: 'Layout.event.BaseEvent',
	
	eventName : 'addRelation',
	
	declareCallbacks : [
	                    'serverCallback',
		                'editGridCallback',
		                'drawCallback'
	                   ],
	
    serverCallback : function(records){
		Ext.Array.each(records, function(record){
			Layout.DataServer.importRelation(record.data, function(response){
				var relation = Ext.decode(response.responseText);
				
				record.set('uuid', relation.uuid);
				record.set('childs', relation.childs);
			},null, true);
		});
	},
	
	editGridCallback : function(records){
		var grid = Ext.getCmp('editRelationGrid');
		
		Ext.Array.each(records, function(record){
			grid.getStore().add(record);
		});
	},
	
	drawCallback : function(records, fn, context){
		context.eachPaper(function(paper){
			Ext.Array.each(records, function(record){
				Layout.Draw.createRelation(paper, record);
			});
		});
	}
	                   
});