Ext.define('Layout.event.EditLayout',{
	extend: 'Layout.event.BaseEvent',
	
	eventName : 'editLayout',
	
	declareCallbacks : [
	                   'serverCallback',
	                   'drawCallback'
	                   ],

    serverCallback : function(positions, fn, context){
		Layout.DataServer.updateLayout(positions);
	},
	
	drawCallback : function(uuid , defineUuid, newValue, oldValue, fn, context){
	}                   
	                   
});
