Ext.define('Layout.event.AddProperty',{
	extend: 'Layout.event.BaseEvent',
	
	eventName : 'addProperty',
	
	declareCallbacks : [
		                   'serverCallback',
		                   'editGridCallback',
		                   'drawCallback',
		                   'updateFactorCombo'
		                   ],

    serverCallback : function(parentUuid, parentType, propertyRec, grid, fn, context){
		Layout.DataServer.saveFactor(propertyRec.data, parentUuid, parentType, 
				function(response){
					var prop = Ext.decode(response.responseText);
					
					if(prop.duplicate){
						context.stopCallback();
						throw new Error('factor name duplicated!');
					}
					
					Ext.apply(propertyRec.data, prop);
				}, null, true
		);
	},
	
	editGridCallback : function(parentUuid, parentType, propertyRec, grid){
	    if(parentUuid !== grid.parentUuid){
            return;
        }    

	    if(-1 != grid.getStore().findExact('defineUuid', propertyRec.get('defineUuid'))){
	    	grid.loadEditor.call(grid, [propertyRec]);
	    	return;
	    }
	    
		grid.getStore().add(propertyRec);
		grid.getStore().group('prototype', 'ASC');
		grid.loadEditor.call(grid, [propertyRec]);

		grid.fireEvent('cellclick', null,null,
					0, propertyRec);
	},
	
	drawCallback : function(parentUuid, parentType, propertyRec, grid){
		// do nothing 
	}
});