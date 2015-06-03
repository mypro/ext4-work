Ext.define('Layout.event.AddFactor',{
	extend: 'Layout.event.BaseEvent',
	
	eventName : 'addFactor',
	
	declareCallbacks : [
	                    'serverCallback',
		                'editGridCallback',
		                'drawCallback',
		                'updateFactorCombo',
	                   ],
	                   
	serverCallback : function(records, fn){
		Ext.Array.each(records, function(record){
			Layout.DataServer.importFactor(record.data, function(response){
				var factor = Ext.decode(response.responseText);
				
				if(!factor.uuid){
					throw new Error('save factor failed'); 
				}
				
				record.set('uuid', factor.uuid);
				record.set('defineUuid', factor.defineUuid);
				record.set('childs', factor.childs);
				
				
				//===================add layout===================
				var layouts = [],
					ES = Layout.EventSchedule;
				
				Layout.DrawController.eachPanel(function(panel){
					var xy = record.getXY(panel.paperUuid),
						layout = {
							defineUuid : panel.paperUuid,
							factorUuid : factor.uuid,
							x : xy.x,
							y : xy.y
						};
					
					layouts.push(layout);
				});
				
				ES.fireEvent(ES.factorStore, 'addLayout', layouts);
			}, null, true);
		});
	},

	editGridCallback : function(records, fn, context){
		var grid = Ext.getCmp('editFactorGrid');
		Ext.Array.each(records, function(record){
			var editFactorStore = grid.getStore();
			
			editFactorStore.add(record);
			
			context.get('afterRefreshGrid') && 
					context.get('afterRefreshGrid').call(context, record.get('uuid'));
		});
		grid.loadEditor.call(grid, records);
	},
	
	drawCallback : function(records, fn, context){
		context.eachPaper(function(paper){
			if(!paper){
				return;
			}
			Ext.Array.each(records, function(record){
				Layout.Draw.createFactor(paper, record);
			});
		});
	}
	
});