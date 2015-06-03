Ext.define('Layout.func.Layout',{
	
	/*
	 * three things:
	 * 1. move the node in svg
	 * 2. edit position info in store
	 * 3. transmit positions to server
	 */
    batchUpdatePosition : function(paper, positions){
    	var ES = Layout.EventSchedule,
    		layouts = [];
    	
    	Ext.Array.each(positions, function(position){
			var factor = ES.factorStore.findRecordByKey('uuid', position.uuid),
				cell = paper.model.getCell(position.uuid);
			
			// step1
			cell.position(position.posX, position.posY);
			
			if(factor.layout && factor.layout[paper.uuid]){
				layouts.push({
					uuid : factor.layout[paper.uuid].uuid,
	    			defineUuid : paper.uuid,
	    			factorUuid : position.uuid, 
	    			x:position.posX,
	    			y:position.posY
				});
			}
		});
		
    	// step3
    	ES.fireEvent(ES.factorStore, 'editLayout',layouts, function(layouts){
    		// step2
    		Ext.Array.each(layouts, function(layout){
    			ES.factorStore.findRecordByKey('uuid', layout.factorUuid)
    					.setXY(layout.defineUuid, layout.x, layout.y);
    		}); 
		});
    	
    },
    
    shift : function(paper, factors, shiftX, shiftY){
    	var positions = [];
    	
    	Ext.Array.each(factors, function(factor){
			var position = {
					uuid : factor.get('uuid'),
					posX : factor.getXY(paper).x+shiftX,
					posY : factor.getXY(paper).y+shiftY
				};
			
			positions.push(position);
		});
    	
    	this.batchUpdatePosition(paper, positions);
    },
    
    
    autoScale : function(paper, factors){
		var minX=9999999, maxX=-1, 
			minY=9999999, maxY=-1,
			screenX = paper.$el.width()*0.8||1,
			screenY = paper.$el.height()*0.8||1,
			scaleX,
			scaleY,
			scale,
			scaleField = Ext.getCmp('scale'),
			shiftX = 0,
			shiftY = 0;
		
		if(0 === factors.length){
			return;
		}
		
		// scale and shift
//		Ext.Array.each(factors, function(factor){
//			var x = factor.getXY(paper).x,
//				y = factor.getXY(paper).y;
//			
//			minX = (x<minX)?x:minX;
//			maxX = (x>maxX)?x:maxX;
//			minY = (y<minY)?y:minY;
//			maxY = (y>maxY)?y:maxY;
//		});
		Ext.Array.each(paper.model.getElements(), function(cell){
			var x = cell.get('position').x,
				y = cell.get('position').y;
			
			minX = (x<minX)?x:minX;
			maxX = (x>maxX)?x:maxX;
			minY = (y<minY)?y:minY;
			maxY = (y>maxY)?y:maxY;
		});
//		console.log(minX+' '+maxX+' '+minY+' '+maxY);
		centerX = (minX+maxX)/2;
		centerY = (minY+maxY)/2;
		scaleX = (maxX-minX)*1.3/screenX;
		scaleY = (maxY-minY)*1.3/screenY;
		
		scaleX = scaleX < 1 ? 1 : scaleX;
		scaleY = scaleY < 1 ? 1 : scaleY;
		
		scale = scaleX>scaleY?scaleX:scaleY;
		shiftX = screenX*scale/2 - (minX+maxX)/2;
		shiftY = screenY*scale/2 - (minY+maxY)/2;
		
		// scale 
		if(1 != scale){
			scale = scale<0.1?0.1:scale;
			scaleField.setValue(100/scale);
		}
		
		Layout.Draw.position(paper, shiftX/scale, shiftY/scale);
		return;
    },
    
    getFactorLayout : function(factors, paperUuid){
    	var layouts = [];
    	
    	Ext.Array.each(factors, function(factor){
    		var layout = {
    			factorUuid : factor.get('uuid'),
    			defineUuid : paperUuid,
    			x : factor.layout[paperUuid].x,
    			y : factor.layout[paperUuid].y
    		};
    		
    		layouts.push(layout);
    	});
    	
    	return layouts;
    },
    
    setFactorLayout : function(factors, layouts){
    	var layoutMap = {};
		
		Ext.Array.each(layouts, function(layout){
			layoutMap[layout.factorUuid] = 
				layoutMap[layout.factorUuid]||{};
			layoutMap[layout.factorUuid][layout.defineUuid] = 
				layoutMap[layout.factorUuid][layout.defineUuid] || {};
			layoutMap[layout.factorUuid][layout.defineUuid].x = parseFloat(layout.x);
			layoutMap[layout.factorUuid][layout.defineUuid].y = parseFloat(layout.y);
			layoutMap[layout.factorUuid][layout.defineUuid].uuid = layout.uuid;
			layoutMap[layout.factorUuid][layout.defineUuid].defineUuid = layout.defineUuid;
		});
		Ext.Array.each(factors, function(factor){
			var factorUuid = factor.get('uuid');
			
			factor.layout = factor.layout || {};
			Ext.apply(factor.layout, layoutMap[factorUuid]);
		});
    }
    
});