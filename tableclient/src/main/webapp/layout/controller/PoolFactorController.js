Ext.define('Layout.controller.PoolFactorController', {
    extend: 'Ext.app.Controller',
    
    refs : [{
    	selector : '#drawPanel',
    	ref: 'drawPanel'
    }],
    
    init: function() {
    	this.control({
    		'#drawPanel' : {
    			'afterlayout' : this.afterRenderPanel
    		}
    	});
    	
    	this.factorStore = new Layout.store.CommonFactorStore({
    		proxy: {
    	        type: 'ajax',
    	        url : '../../../work-platform/loadFactor.do',
    	        reader: {
    	            type: 'json'
    	        }
    	    }
    	});
    	this.factorStore.addEvents(
    			'addProperty',
                'editProperty',
                'deleteProperty',
                'editValue'
        );
    	
    	this.relationStore = new Layout.store.CommonRelationStore({
    		proxy: {
    	        type: 'ajax',
    	        url : '../../../work-platform/loadRelation.do',
    	        reader: {
    	            type: 'json'
    	        }
    	    }
    	});
    	this.relationStore.addEvents(
    			'editProperty'
    	);
    },

	afterRenderPanel : function(){
		Layout.App.getController('DrawController').initDrawPaper(arguments[0]);
		
		// register factor store event
		this.factorStore.on({
			add :  this.addFactor.serverCallback
		});
		this.factorStore.on({
			add : this.addFactor.drawCallback
		});
		this.factorStore.on({
			load :  this.addFactor.drawCallback
		});
		this.factorStore.on({
			load :  this.addFactor.editGridCallback
		});
		this.factorStore.on({
			remove : this.removeFactor.serverCallback
		});
		this.factorStore.on({
			remove : this.removeFactor.editGridCallback
		});
		this.factorStore.on({
			remove : this.removeFactor.drawCallback
		});
		this.factorStore.on({
			addProperty : this.addFactorProp.serverCallback
		});
		this.factorStore.on({
			addProperty : this.addFactorProp.drawCallback
		});
		this.factorStore.on({
			addProperty : this.addFactorProp.editGridCallback
		});
		this.factorStore.on({
			deleteProperty : this.deleteFactorProp.serverCallback
		});
		this.factorStore.on({
			deleteProperty : this.deleteFactorProp.drawCallback
		});
		this.factorStore.on({
			deleteProperty : this.deleteFactorProp.editGridCallback
		});
		this.factorStore.on({
			editProperty : this.editFactorProp.drawCallback
		});
		this.factorStore.on({
			editProperty : this.editFactorProp.serverCallback
		});
		this.factorStore.on({
			editValue : this.editFactorValue.serverCallback
		});
		
		// register relation event
		this.relationStore.on({
			add :  this.addRelation.serverCallback
		});
		this.relationStore.on({
			add :  this.addRelation.drawCallback
		});
		this.relationStore.on({
			add :  this.addRelation.editGridCallback
		});
		this.relationStore.on({
			remove : this.removeRelation.serverCallback
		});
		this.relationStore.on({
			remove : this.removeRelation.drawCallback
		});
		this.relationStore.on({
			remove : this.removeRelation.editGridCallback
		});
		this.relationStore.on({
			load :  this.addRelation.drawCallback
		});
		this.relationStore.on({
			editProperty :  this.editRelationProperty.serverCallback
		});
		this.relationStore.on({
			editProperty :  this.editRelationProperty.drawCallback
		});
		
		// clear edit grid
		Ext.getCmp('editFactorGrid').getStore().removeAll();
		Ext.getCmp('editRelationGrid').getStore().removeAll();
		
		// load factor
		this.factorStore.load({
			scope : this,
			callback : function(){
				// load relation
				this.relationStore.load();
			}
		});
		
	},
	
	deleteFactorProp:{
		serverCallback : function(factorUuid, uuid, grid){
			Layout.FactorOperator.deleteFactor(uuid, 
					null, function(){}, false);
		},
		editGridCallback : function(factorUuid, uuid, grid){
			var deleteProp = grid.getStore().findRecordByKey('uuid',uuid);
			grid.getStore().remove(deleteProp);
		},
		drawCallback : function(factorUuid, uuid, grid){
			// do nothing 
		}
	},
	
	addFactorProp:{
		serverCallback : function(parentUuid, propertyRec, grid){
			Layout.FactorOperator.addProperty(parentUuid, 
					RELATIONTYPE_FACTOR_PROP,propertyRec, function(){}, false);
		},
		editGridCallback : function(parentUuid, propertyRec, grid){
			grid.getStore().add(propertyRec);
			grid.loadEditor.call(grid, [propertyRec]);
		},
		drawCallback : function(parentUuid, propertyRec, grid){
			// do nothing 
		}
	},
	
	removeRelation: {
		serverCallback : function(store, record, index){
			Layout.FactorOperator.deleteRelation(record.get('uuid'),
													function(){},false);
		},
		drawCallback : function(store, record, index){
			var uuid = record.get('uuid');
			var drawController = Layout.App.getController('DrawController');
			var link = drawController.graph.getCell(uuid);
			if(link){
				link.remove();
			}
		},
		editGridCallback : function(store, record, index){
			var uuid = record.get('uuid');
			var editGridStore = Ext.getCmp('editRelationGrid').getStore();
			var deleteRecord = editGridStore.findRecordByKey('uuid', uuid);
			if(deleteRecord){
				editGridStore.remove(deleteRecord);
			}
		}
	},
	
	removeFactor : {
		serverCallback : function(store, record, index){
			Layout.FactorOperator.deleteFactor(record.get('uuid'), record.get('defineUuid'), 
					function(){},false);
		},
		editGridCallback : function(store, record, index){
			var uuid = record.get('uuid');
			var editGridStore = Ext.getCmp('editFactorGrid').getStore();
			var deleteRecord = editGridStore.findRecordByKey('uuid', uuid);
			if(deleteRecord){
				editGridStore.remove(deleteRecord);
			}
		},
		drawCallback : function(store, record, index){
			var uuid = record.get('uuid');
			var drawController = Layout.App.getController('DrawController');
			var me = Layout.App.getController('PoolFactorController');
			var cell = drawController.graph.getCell(uuid);
			var links = drawController.graph.getConnectedLinks (cell);
			Ext.Array.each(links, function(link){
				var deleteRelation = me.relationStore.findRecordByKey('uuid', link.id);
				me.relationStore.remove(deleteRelation);
			});
			cell.remove();
		}
	},
	
	editFactorValue : {
		serverCallback : function(factorUuid, newValue, oldValue){
			if("serverCallback" === arguments[arguments.length-2]){
				return ;
			}
			Ext.Ajax.request({ 
				url: '../work-platform/updateValue.do',
				params: {
					factorUuid : factorUuid,
					value : newValue
				},
				success: function(response, options) {
				}
			});
		}
	},
	
	editRelationProperty : {
		serverCallback : function(prop, oldValue, relation){
			if("serverCallback" === arguments[arguments.length-2]){
				return ;
			}
			Ext.Ajax.request({ 
				url: '../work-platform/updateValue.do',
				params: {
					factorUuid : prop.uuid,
					value : prop.value
				},
				success: function(response, options) {
				}
			});
		},
		
		drawCallback : function(prop, oldValue, relation){
			if("drawCallback" === arguments[arguments.length-2]){
				return ;
			}
			var link = Layout.App.getController('DrawController').graph.getCell(relation.get('uuid'));
			link.remove();
			Layout.App.getController('PoolFactorController').createLink(relation);
		}
		
	},
	
	editFactorProp : {
		
		serverCallback : function(prop, oldValue, factor){
			if("serverCallback" === arguments[arguments.length-2]){
				return ;
			}
			Ext.Ajax.request({ 
				url: '../work-platform/updateValue.do',
				params: {
					factorUuid : prop.uuid,
					value : prop.value
				},
				success: function(response, options) {
				}
			});
		},
		drawCallback : function(prop, oldValue, factor){
			if("drawCallback" === arguments[arguments.length-2]){
				return ;
			}
			var cell = Layout.App.getController('DrawController').graph.getCell(factor.get('uuid'));
			switch(prop.defineUuid){
			case FACTORDEFINE_FACTOR_COLOR:
				var shape = factor.getShape();
				var color = factor.getColor();
				var attr = {};
				attr[getSvgShape(shape)] = {fill: color};
				console.log(attr);
				cell.attr(attr);
				break;
			case FACTORDEFINE_FACTOR_SIZE:
				cell.resize(parseInt(prop.value)*2, parseInt(prop.value)*2);
				break;
			case FACTORDEFINE_FACTOR_X:
				cell.translate(parseInt(prop.value)-parseInt(oldValue),0);
				break;
			case FACTORDEFINE_FACTOR_Y:
				cell.translate(0,parseInt(prop.value)-parseInt(oldValue));
				break;
			case FACTORDEFINE_FACTOR_SHAPE:
				var graph = Layout.App.getController('DrawController').graph; 
				var links = graph.getConnectedLinks(cell);
				cell.remove();
				cell = Layout.App.getController('PoolFactorController').createCell(factor);
				graph.addCell(links);
				break;
			}
		}
	},
	
	addRelation: {
		
		serverCallback : function(store, records, index){
			// 目前仅存在单个记录更新的情形
			Ext.Array.each(records, function(record){
				Ext.Ajax.request({ 
					async : false,
					url: '../work-platform/importRelation.do',
					params: {
						record : Ext.encode(record.data)
					},
					success: function(response, options) {
					var relation = Ext.decode(response.responseText);
						
						record.set('uuid', relation.uuid);
						record.set('childs', relation.childs);
					}
				});
			});
		},
		
		editGridCallback : function(store, records, index){
			var grid = Ext.getCmp('editFactorGrid');
			
			grid.getStore().load({
	    		scope: grid,
	    		callback: function(){
	    			grid.loadEditor.apply(grid, arguments);
	    		}
	    	});
		},
		
		drawCallback : function(store, records, index){
			
			Ext.Array.each(records, function(record){
				var context = Layout.App.getController('PoolFactorController');
				context.createLink(record);
			});
		}
	},
	addFactor : {
		serverCallback : function(store, records, index){
			
			// 目前仅存在单个记录更新的情形
			Ext.Array.each(records, function(record){
				Ext.Ajax.request({ 
					async : false,
					url: '../work-platform/importFactor.do',
					params: {
						record : Ext.encode(record.data)
					},
					success: function(response, options) {
						//record.set('childs', response.responseText);
						var factor = Ext.decode(response.responseText);
						
						record.set('uuid', factor.uuid);
						record.set('childs', factor.childs);
					}
				});
			});
		},
		
		editGridCallback : function(store, records, index){
			var grid = Ext.getCmp('editFactorGrid');
			Ext.Array.each(records, function(record){
				var editFactorStore = grid.getStore();
				editFactorStore.add(record);
			});
			grid.loadEditor.call(grid, records);
		},
		
		drawCallback : function(store, records, index){
			
			Ext.Array.each(records, function(record){
				var context = Layout.App.getController('PoolFactorController');
				context.createCell(record);
			});
		}
	},
	
	createLink : function(relation){
		var link = new joint.dia.Link({
			id : relation.get('uuid'),
		    source: { id: relation.get('factor1Uuid') },
		    target: { id: relation.get('factor2Uuid') },
		    smooth : true,
		    toolMarkup: ['<g class="link-tool">',
		                 '</g>'].join(''),
		    attrs: {}
		});
		var color = relation.getColor();
		var shape = relation.getShape();
		switch(shape){
		case 2:
			link.attr({
				'.connection': { stroke: color },
			    '.marker-source': { fill: color, d: 'M 10 0 L 0 5 L 10 10 z' }
			});
			break;
		case 3:
			link.attr({
				'.connection': { stroke: color },
			    '.marker-target': { fill: color, d: 'M 10 0 L 0 5 L 10 10 z' }
			});
			break;
		case 4:
			link.attr({
				'.connection': { stroke: color },
			    '.marker-source': { fill: color, d: 'M 10 0 L 0 5 L 10 10 z' },
			    '.marker-target': { fill: color, d: 'M 10 0 L 0 5 L 10 10 z' }
			});
			break;
		default:
			link.attr({
				'.connection': { stroke: color }
			});
		}
		
		link.click = function(uuid){
			Ext.getCmp('project-tab').expand();
			Ext.getCmp('editRelationGrid').fireEvent('clickProperty', uuid, Ext.getCmp('editRelationPropGrid'));
		};
		
		var drawController = Layout.App.getController('DrawController'); 
		drawController.graph.addCell(link);
	},
	
	createCell : function(factor){
		var x = factor.getX();
		var y = factor.getY();	
		var color = factor.getColor();
		var size = factor.getSize();
		var shape = factor.getShape();
		var shapeCls = getSvgcls(shape);
		
		var config = {
			id : factor.get('uuid'),
			position : {
				x : x,
				y : y
			},
			size: { 
				width: size*2, 
				height: size*2 
			},
			attrs: { 
				text: { text: factor.getName(), fill: 'black' } 
			}
		};
		config.attrs[getSvgShape(shape)] = { fill: color };
		console.log(config);
		
		var cell = new shapeCls(config);
		
		var drawController = Layout.App.getController('DrawController'); 
		drawController.graph.addCell(cell);
		
		// append cell event
		drawController.paper.findViewByModel(cell).on('cell:pointerdown', function($el, x, y) { 
			console.log('cell:pointerdown '+x+','+y);
			var paper = this;
			
			paper.isNewlink = isShiftActive();
			
			var view = paper.findView($el.target);
			var factorUuid = view.model.id;
			
			if(paper.isNewlink){
				// create new link, source is currentcell, target is mouse
				var link = new joint.dia.Link({
				    source: { id: factorUuid },
				    target: { id: factorUuid },
				    smooth : true,
				    attrs: {}
				});
				
				paper.addCell(link);
				var linkView = paper.findViewByModel(link);
				
				linkView._arrowheadEnd = 'target';
				linkView._action = 'arrowhead-move';
				linkView._originalZ = linkView.model.get('z');
				linkView.model.set('z', Number.MAX_VALUE);
				linkView.$el.css({ 'pointer-events': 'none' });
				
				paper.sourceView = paper.findView(linkView.$el.find('path[end=target]')[0]);
				
				linkView.on('cell:pointerup', function($el, x, y){
					console.log(arguments);
					var graph = Layout.App.getController('DrawController').graph;
					paper.isNewlink = false;
					link.remove();
					
					if('arrowhead-move' !== this._action){
						return;
					}
					
					delete this._action;
					
					// if link has no target, drop it
					if(!this._viewUnderPointer
							|| this._viewUnderPointer.model.id===factorUuid){
						return;
					}
					
					// if link duplicated, drop it
					var links = graph.getConnectedLinks (view.model);
					var i = Ext.Array.each(links, function(link){
						if(link.get('target').id === this._viewUnderPointer.model.id
							|| link.get('source').id === this._viewUnderPointer.model.id){
							return false;
						}
					}, linkView);
					if(Ext.isNumber(i)){
						delete this._viewUnderPointer;
						return;
					}
					
					// save link
					var record = new Layout.model.RelationModel();  
					var poolController = Layout.App.getController('PoolFactorController');
					var factor1 = poolController.factorStore.findRecordByKey('uuid', factorUuid);
					var factor2 = poolController.factorStore.findRecordByKey('uuid', this._viewUnderPointer.model.id);
					
					record.set('factor1Uuid',factor1.get('uuid'));
					record.set('factor1Name',factor1.get('name'));
					record.set('factor2Uuid',factor2.get('uuid'));
					record.set('factor2Name',factor2.get('name'));
					record.set('type', RELATIONTYPE_FACTOR);
					
					// prototype property
					var defaultProp = [{
				    	defineUuid : FACTORDEFINE_RELATION_COLOR,
				    	name : '关系颜色',
				    	value : '0x000000',
				    	width : 8,
				    	decimalWidth: 0,
				    	dataType : 1,
				    	type : 2,
				    	prototype : 2,
				    	format : "1"
				    },{
				    	defineUuid : FACTORDEFINE_RELATION_SHAPE,
				    	name : '关系形状',
				    	value : '1',
				    	width : 8,
				    	decimalWidth: 0,
				    	dataType : 1,
				    	type : 2,
				    	prototype : 2,
				    	format : "1"
				    }];
			    	Ext.Array.each(defaultProp, function(prop){
			    		record.addProperty(prop);
			    	});
					
					Layout.App.getController('PoolFactorController').relationStore.add(record);
				}, linkView);
			}else{
				var view = this.findView($el.target);
				
				view.originX = x;
				view.originY = y;
				
				// active factor prop
				var editFactorPropGrid = Ext.getCmp('editFactorPropGrid');
				if(factorUuid === editFactorPropGrid.factorUuid
						&& 'editFactorPropGrid' === Ext.getCmp('project-tab').getActiveTab().id){
					return;
				}
				Ext.getCmp('project-tab').expand();
				Ext.getCmp('editFactorGrid').fireEvent('clickProperty',
						factorUuid, Ext.getCmp('editFactorPropGrid'));
			}
		},drawController.paper);
		
		drawController.paper.findViewByModel(cell).on('cell:pointerup', function($el, x, y) {
			console.log('cell:pointerup '+x+','+y);
			var view = this.findView($el.target);
			var factorUuid = view.model.id;
			var poolStore = Layout.App.getController('PoolFactorController').factorStore;
	    	var factor = poolStore.findRecordByKey("uuid",factorUuid);
	    	
	    	var oldPositionX = factor.getX();
	    	var oldPositionY = factor.getY();
	    	
	    	var newPositionX = oldPositionX+x-view.originX;
	    	var newPositionY = oldPositionY+y-view.originY;
	    	
	    	var propX = factor.setProperty(FACTORDEFINE_FACTOR_X,newPositionX);
	    	poolStore.fireEvent('editProperty', propX, view.originX, factor, "drawCallback");
	    	
	    	var propY = factor.setProperty(FACTORDEFINE_FACTOR_Y,newPositionY);
	    	poolStore.fireEvent('editProperty', propY, view.originY, factor, "drawCallback");
	    	
	    	// 设置editPropGrid的两个坐标
	    	var editFactorPropGrid = Ext.getCmp('editFactorPropGrid');
	    	editFactorPropGrid.getStore().setX(newPositionX);
	    	editFactorPropGrid.getStore().setY(newPositionY);
		},drawController.paper);
		
		return cell;
	}
    
});