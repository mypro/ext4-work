Ext.define('Layout.event.EditDefine',{
	extend: 'Layout.event.BaseEvent',
	
	eventName : 'editDefine',
	
	declareCallbacks : [
	                   'serverCallback',
	                   'editGridCallback',
	                   'drawCallback',
	                   'updateFactorCombo'
	                   ],
	
	serverCallback : function(factorDefine, parentUuid, parentType, fn, context){
		Layout.DataServer.saveFactor(factorDefine, parentUuid, parentType, 
				function(response){
					var result = Ext.decode(response.responseText);
					
					// factor name duplicated!
					if(result.duplicate){
						context.stopCallback();
						throw new Error('factor name duplicated!');
					}else{
						console.log(result);
						Ext.apply(factorDefine, result);
					}
				}, 
		false,true);
	},
	
	editGridCallback : function(factorDefine, parentUuid, parentType){
		if(RELATIONTYPE_RELATION_PROP == parentType){
			var grid = Ext.getCmp('editRelationPropGrid'),
				poolStore = Layout.EventSchedule.relationStore,
				records = poolStore.getPropertyRecords(parentUuid);
			
			grid.selModel.selection = null;
			grid.getStore().removeAll();
	    	grid.getStore().add(records);
	    	grid.loadEditor.call(grid, records);
		}else if(RELATIONTYPE_FACTOR_PROP == parentType){
			var grid = Ext.getCmp('editFactorPropGrid'),
				poolStore = Layout.EventSchedule.factorStore,
				records = poolStore.getPropertyRecords(parentUuid);
			
			grid.selModel.selection = null;
			grid.getStore().removeAll();
	    	grid.getStore().add(records);
	    	grid.loadEditor.call(grid, records);
		}else{
			var grid = Ext.getCmp('editFactorGrid');
			
			grid.getStore().load({
				scope:grid,
				callback: function(){
					grid.loadEditor.apply(this, arguments);
	    		}
			});
		}
	},
	
	drawCallback : function(factorDefine, parentUuid, parentType, fn, context){
		if(RELATIONTYPE_RELATION_PROP == parentType){

		}else if(RELATIONTYPE_FACTOR_PROP == parentType){
			
		}else{
			var factor = Layout.EventSchedule.factorStore.findRecordByKey('uuid',factorDefine.uuid);
			
			context.eachPaper(function(paper){
				var cell = paper.model.getCell(factor.get('uuid')),
					links = paper.model.getConnectedLinks(cell);
				
				cell.remove();
				Layout.Draw.createFactor(paper, factor);
				paper.model.addCell(links);
			});
		}
		
	}
	
});