Ext.define('Layout.event.LoadRelation',{
	extend: 'Layout.event.AddRelation',
	
	eventName : 'loadRelation',
	
	declareCallbacks : [
		                'editGridCallback',
		                'drawCallback'
	                   ],
});