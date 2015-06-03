Ext.define('Layout.event.EditValue',{
	extend: 'Layout.event.BaseEvent',
	
	eventName : 'editValue',
	
	declareCallbacks : [
	                   'serverCallback',
	                   'editGridCallback',
	                   'drawCallback'
	                   ],

    serverCallback : function(uuid, defineUuid, newValue, oldValue, fn, context){
		Layout.DataServer.updateValue(uuid, newValue);
	},
	
	editGridCallback : function(){
		// do nothing
	},
	
	drawCallback : function(uuid , defineUuid, newValue, oldValue, fn, context){
		var parent = context.get('parent'),
            draw = Layout.Draw;
		
		context.eachPaper(
			function(paper){
				if(parent instanceof Layout.model.RelationModel){
					var link = paper.model.getCell(parent.get('uuid'));
		                isHighlight = /\b(highlighted)\b/.exec(
		                        paper.findViewByModel(link).$el.attr('class'));
		
		            link.remove();
					draw.createRelation(paper,parent);
		
		            // it`s supposed to highlight, if it was highlight before.
		            if(isHighlight){
		                paper.findViewByModel(link).highlight();
		            }
				}else if(parent instanceof Layout.model.CommonFactorModel){
					if(!context.get('noDraw')){
						draw.changeElementProp(paper, parent, defineUuid, newValue);
					}
				}
			}
		);
	}                   
	                   
});
