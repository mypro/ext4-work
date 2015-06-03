Ext.define('Layout.func.FactorValue',{
	
	PREFIX_UUID : 'value_',
	
	init : function(){
		var me = this;
		
		Ext.getBody().on('mousewheel',function(e, target){
			me.gc();
		});
	},
	
	createFactorProperty : function(paper, factor){
		var props = factor.getProperties();
		
		Ext.Array.each(props, function(prop){
			var factor = new Layout.model.CommonFactorModel();
			
			Ext.apply(factor.data, prop);
			Layout.FactorValue.createFactorValue(paper, factor);
		});
	},
	
	deleteFactorProperty : function(paper, factor){
		var props = factor.getProperties();
		
		Ext.Array.each(props, function(prop){
			var factor = new Layout.model.CommonFactorModel();
			
			Ext.apply(factor.data, prop);
			Layout.FactorValue.deleteFactorValue(paper, factor);
		});
	},
	
	createFactorValue : function(paper, factor){
		var uuid = factor.get('uuid'),
			view = paper.findViewByModel(uuid),
			bbox,
			valueCell,
			value,
			valueByteNumber,
			paperScale,
			paperPosition = Layout.Draw.position(paper);
		
		if(!view){
			return;
		}
		
		/*if value has exist, return*/
		if(paper.model.getCell(this.PREFIX_UUID+uuid)){
			return;
		}
		
		/* figure out position */
		paperScale = Layout.Draw.getScale(paper);
		bbox = view.getBBox();
		posX = (bbox.x+bbox.width- paperPosition.x)/paperScale+3 ;
		posY = (bbox.y- paperPosition.y)/paperScale ;
		
		/* render value*/
		value = Layout.FactorValue.getRenderValue(factor, factor.get('value'));
		valueByteNumber = Str.lengthOf(value+'');
		
		/* add cell*/
		valueCell = new joint.shapes.basic.Rect({
			id : this.PREFIX_UUID+uuid,
			position : {
				x : posX,
				y : posY
			},
			size: {
				width : valueByteNumber?valueByteNumber:40,
				height : 30
			},
			attrs: { 
				text: { 
						text: value,
						fill: '#000000'
				},
				rect : { 
						stroke: '#FFFFFF',
						fill: '#FFFFFF'
				}
			}
		});
		paper.model.addCell(valueCell);
		valueCell.toFront();
		
		/* event */ 
		paper.findViewByModel(valueCell).on('cell:pointerdown', function(e, x, y){
			
			// u can`t move this node
			delete paper.sourceView;
			e.preventDefault();
			
			// gc
			Layout.FactorValue.gc();
			
			var me = this;
			
			var bbox = this.getBBox();
			
			var panel = Layout.DrawTabController.getPanel(paper);
			
			var field = Layout.FactorValue.getValueField(factor);
			
			field.render(panel.id);
			field.setPosition(bbox.x-paper.$el.scrollLeft(), bbox.y-paper.$el.scrollTop());
			field.setWidth(80);
			field.setHeight(22);
			field.setValue(factor.get('value'));
			field.addListener('keydown', function(f,e){
				if(12 == e.button){
					f.blur();
				}
			});
			
			// focus field in some millsecond
			new Ext.util.DelayedTask(function(){
				field.focus();
			}).delay(500);
			
			// the event of save factor value 
			field.addListener('blur', function(field){
				Layout.FactorValue.setFactorValue(factor, field.getValue());
				
				var value = Layout.FactorValue.getRenderValue(factor, field.getValue());
				me.model.resize(Str.lengthOf(value+'')*8, 10);
				me.model.attr({text:{
					text:value
				}});
				field.destroy();
				
				// refresh edit grid
				var factorPropGrid = Ext.getCmp('editFactorPropGrid');
				if(factorPropGrid.parentUuid){
					Ext.getCmp('editFactorGrid').fireEvent('clickProperty',
							factorPropGrid.parentUuid, factorPropGrid);
				}
			});
		});
		
	},
	
	deleteFactorValue : function(paper, factor){
		var uuid = factor.get('uuid'),
			model = paper.model.getCell(this.PREFIX_UUID+uuid);
		
		model && model.remove();
	},
	
	gc : function(){
		var valueField = Ext.getCmp('factorValueField');
		
		valueField && valueField.destroy();
	},
	
	setFactorValue : function(factor, newValue){
		var factorStore = Layout.EventSchedule.factorStore;
		
		factorStore.fireEvent('editValue', factor.get('uuid'), factor.get('defineUuid'), newValue, factor.get('value'), 
    			function(uuid, defineUuid, newValue){
					this.get('factor').set('value', newValue);
				},
				Ext.create('Layout.event.EventContext',{factor:factor})
    	);
	},
	
	getRenderValue : function(factor, value){
		return Layout.FactorValue.getRenderByDatatype(factor).call(factor, value);
	},
	
	getValueField : function(record){
		if(record.get('valueLabelUuid')){
    		
			var combo = new Ext.form.field.ComboBox({
                displayField :'label',
                valueField :'value',
                id : 'factorValueField',
                floating : true,
                enableKeyEvents : true,
                queryMode: 'local'
            });
			
			ValueLabel.App.getController('ValueLabelController').
				getValueLabel(record.get('valueLabelUuid'), function(response){
					this.valueLableCache[record.get('valueLabelUuid')] = Ext.decode(response.responseText);
					var labels = this.valueLableCache[record.get('valueLabelUuid')];
					var data = [];
					
					Ext.Array.each(labels, function(item){
						data.push({
							value:item.value,
							label:item.label
						});
					});
					
					store = Ext.create('Ext.data.Store', {
						fields: ['value', 'label'],
		    		     data : data
		    		});
					
					combo.bindStore(store);
				});
			
			return combo;
    	}
    	
    	var datatype = record.get("dataType");
    	
    	switch(parseInt(datatype)){
    	case 2:
    		return new Ext.form.field.Text({floating : true, enableKeyEvents : true, id : 'factorValueField'});
    	case 3:
    		return new Ext.form.field.Date({floating : true, enableKeyEvents : true, id : 'factorValueField', format: 'Y-m-d'});
    	default:
    		return new Ext.form.field.Number({floating : true, enableKeyEvents : true, id : 'factorValueField'});
    	}
	},
	
	getRenderByDatatype : function(record){
    	if(record.get('valueLabelUuid')){
    		var labels = ValueLabel.App.getController('ValueLabelController').
    					getValueLabel(record.get('valueLabelUuid'));
    		
    		return function(val){
    			var i = Ext.Array.each(labels, function(item){
    				if(item.value == val){
    					return false;
    				}
    			});
    			if(Ext.isNumber(i)){
    				return labels[i].label;
    			}
    			return val;
    		};
    	}
    	
    	switch(parseInt(record.get('dataType'))){
    	case 2:
    		return function(val){return null==val?'':val;};
    	case 3:
    		return function(val){
	        	if(typeof val === 'string'){
	        		return val;
	        	}
	        	return Ext.Date.format(val,'Y-m-d');
	        };
    	default:
    		return function(val){return null==val?0:val;};
    	}
    }
    
});

