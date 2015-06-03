Ext.define('Layout.event.LoadFactor',{
	extend: 'Layout.event.AddFactor',
	
	eventName : 'loadFactor',
	
	declareCallbacks : [
		                'editGridCallback',
		                'drawCallback',
		                'updateFactorCombo'
	                   ]
	                   
});