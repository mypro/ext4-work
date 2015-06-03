Ext.define('Layout.event.AddLayout',{
	extend: 'Layout.event.BaseEvent',
	
	eventName : 'addLayout',
	
	declareCallbacks : [
	                   'serverCallback',
	                   'drawCallback'
	                   ],

    serverCallback : function(positions, fn, context){
		Layout.DataServer.addLayout(positions, function(response){
			var layouts = Ext.decode(response.responseText);
			
			Layout.Layout.setFactorLayout(Layout.EventSchedule.factorStore.data.items, layouts);
		});
	},
	
	drawCallback : function(positions, fn, context){
	}                   
	                   
});
