Ext.define('Layout.func.Draw',{
	
	position : function(paper, x, y){
		var VElement = V(paper.viewport),
			transformAttr = VElement.attr('transform') || '';
		
		if(typeof x === 'undefined'){
			var translate;
			
			if (transformAttr) {
	            var translateMatch = transformAttr.match(/translate\((.*)\)/);
	            if (translateMatch) {
	                translate = translateMatch[1].split(',');
	            }
			}
			return {
                x: (translate && translate[0]) ? parseInt(translate[0], 10) : 0,
                y: (translate && translate[1]) ? parseInt(translate[1], 10) : 0
            };
		}
		
		transformAttr = transformAttr.replace(/translate\([^\)]*\)/g, '').trim();
		VElement.attr('transform', 'translate(' + x + ',' + y + ') ' + transformAttr);
	},
	
	initPaper : function(panel){
		var id = panel.id + '-body',
			panelEl = Ext.get(id).el,
			graph,
			paper,
			$panel = $('#'+id);
		
		Ext.Array.each(panelEl.dom.childNodes, function(child,i){
			panelEl.dom.removeChild(child);
		});
	
			
		//不再出现滚动条
//		$panel.css({'overflow':'auto'});
	
		$("#"+panel.id).css({'background':'#DFDFDF'})
		
		$panel.unbind("mousedown");
		$panel.unbind("dblclick");
		
		graph = new joint.dia.Graph;
		
		paper = new joint.dia.Paper({
    	    el: $panel,
    	    width: DRAW_WIDTH,
    	    height: DRAW_HEIGHT,
    	    gridSize: 1,
    	    model: graph
    	});
		paper.panel = panel;
		
		this.position(paper, panel.center.x, panel.center.y);
		
		paper.on('blank:pointerdown',PaperEvent.pointerDown);

		this.appendDefs(paper);
		this.scroll(paper);
		this.scale(paper);
		this.multiSelect(paper);
        this.renderMatrix(paper,100,100);
		
		return paper;
	},
	
	renderMatrix : function(paper, x, y){
		var viewport = $(V(paper.svg).node).children('g:first-child');
		
		for(var i=0;i<40000/y;i++){
    		var path = V('path');
        	path.attr({
        		stroke : 'blue',
        		'stroke-width' : '0.1',
        		fill : 'blue',
    			d:'M -20000 '+(i*y-20000)+' L20000 '+(i*y-20000)+' Z'
    		});
        	viewport.append(path.node);
    	}
		for(var i=0;i<40000/x;i++){
    		var path = V('path');
        	path.attr({
        		stroke : 'blue',
        		'stroke-width' : '0.1',
        		fill : 'blue',
    			d:'M '+(i*x-20000)+' -20000 L'+(i*x-20000)+' 20000 Z'
    		});
        	viewport.append(path.node);
    	}
	},
	
	multiSelect : function(paper){
		var drr = new Drr(paper),
			me = this;
		
    	drr.conditionCallback = function(){
    		return isShiftActive();
    	};
    	drr.dropEvent = function(startX, startY, endX, endY){
    		console.log(startX+'  '+startY+'  '+endX+'  '+endY); 
    		var scale = Ext.getCmp('scale').value/100;
	    		startX *= scale;
	    		startY *= scale;
	    		endX *= scale;
	    		endY *= scale;
	    		
	    	if(startX > endX){
	    		var tmp = startX;
	    		startX = endX;
	    		endX = tmp;
	    	}
	    	
	    	if(startY > endY){
	    		var tmp = startY;
	    		startY = endY;
	    		endY = tmp;
	    	}
	    	
	    	var paperPosition = me.position(paper);
	    	
    		var selectedViews = paper.findViewsInArea({
				x : startX+paperPosition.x,
				y : startY+paperPosition.y,
				width  : endX-startX,
				height : endY-startY
			});
    		
    		Ext.Array.each(selectedViews, function(view){
                view.highlight(); 
                me.highlightCell(view);
            });
    	};
	},
	
	/**
	 * scale paper by scroll
	 */
	scale : function(paper){
		var targetId = paper.$el.attr('id'),
			me = this;
		
		Ext.get('centerArea').on('mousewheel',function(e, target){
			var scaleField = Ext.getCmp('scale');
			
			while(target && target.parentElement && targetId != target.parentElement.id){
				target = target.parentElement;
				if(!target){
					return;
				}
			}
			
			e.browserEvent.preventDefault();
			var mouseInPaper = paper.snapToGrid({
    			x : e.browserEvent.clientX,
    			y : e.browserEvent.clientY
    		});
			
			// magnify
			var currentScale = me.getScale(paper);
			if(e.getWheelDelta()<0){
				if(currentScale>0.1){
					scaleField.setRawValue(currentScale*100-1);
					me.magnify(paper, -0.01, mouseInPaper.x, mouseInPaper.y, false);
				}
			}
			// narrow
			else{
				if(currentScale<1){
					scaleField.setRawValue(currentScale*100+1);
					me.magnify(paper, 0.01, mouseInPaper.x, mouseInPaper.y, true);
				}
			}
		});
	},
	
	
	/**
	 * scroll panel by mouse
	 */
	scroll : function(paper){
		var $panel = paper.$el,
			me = this;
		
		$panel.mousedown(function(evt){
			if(isShiftActive()){
                return;
            }
			
			if(paper.findView(evt.target)){
				return;
			}
			
			var mouseInPaper = paper.snapToGrid({
    			x : evt.clientX,
    			y : evt.clientY
    		});
			
    		Ext.getCmp('axe-x').setRawValue(mouseInPaper.x);
	        Ext.getCmp('axe-y').setRawValue(mouseInPaper.y);
			
			this.clickX = evt.clientX;
			this.clickY = evt.clientY;
			this.paperPos = me.position(paper);
			
			// calculate boundary's position
			var minX=9999999, maxX=-1, 
				minY=9999999, maxY=-1;
			Ext.Array.each(paper.model.getElements(), function(cell){
				var x = cell.get('position').x,
					y = cell.get('position').y;
				
				minX = (x<minX)?x:minX;
				maxX = (x>maxX)?x:maxX;
				minY = (y<minY)?y:minY;
				maxY = (y>maxY)?y:maxY;
			});
			this.boundary = {
					minX : minX,
					maxX : maxX,
					minY : minY,
					maxY : maxY
			};
			
			
			//由于页面包含了iframe 无法准确计算 于浏览器的距离
//			var left = $("#"+paper.panel.id).offset().left+31.5;
//			var top = $("#"+paper.panel.id).offset().top;
//			var scale = Ext.getCmp('scale').getValue();
//			
//			if(Ext.isNumber(scale)){
//				if(scale<10){
//					scale = 0.1;
//				}else if(scale>100){
//					scale = 1;
//				}else {
//					scale = scale/100;
//				}
//				
//			
//				Ext.getCmp('axe-x').setRawValue((this.sLeft+this.clickX-left)/scale);
//				Ext.getCmp('axe-y').setRawValue((this.sTop+this.clickY-121.8)/scale);
//			}
			
		});
		
		$panel.mousemove(function(evt){
			if(!this.beginMove || !this.paperPos){
	            return false;
	        }
			
			var scrollLeft = this.clickX-evt.clientX,
        		scrollTop = this.clickY-evt.clientY,
        		translateX = this.paperPos.x-scrollLeft,
        		translateY = this.paperPos.y-scrollTop;
	        
	        me.position(paper, translateX, translateY);
		
	        // check four diretion
	        var viewWidth = $panel.width();
	        var viewHeight = $panel.height();
	        var scale = me.getScale(paper);
	        var buffer = 100;
	        
	        // left
	        if(this.boundary.minX*scale + translateX > viewWidth + buffer){
	        	me.position(paper, -buffer-this.boundary.maxX*scale, translateY);
				this.paperPos = {
						x: -buffer-this.boundary.maxX*scale,
						y: translateY
				};
	        }
	        // right
	        if(this.boundary.maxX*scale + translateX < -buffer){
	        	console.log('right overflow!');
	        	me.position(paper, viewWidth + buffer-this.boundary.minX*scale, translateY);
				this.paperPos = {
						x: viewWidth + buffer-this.boundary.minX*scale,
						y: translateY
				};
	        }
	        // top
	        if(this.boundary.minY*scale + translateY > viewHeight + buffer){
	        	console.log('top overflow!');
	        	me.position(paper, translateX, -buffer-this.boundary.maxY*scale);
				this.paperPos = {
						x: translateX,
						y: -buffer-this.boundary.maxY*scale
				};
	        }
	        // bottom
	        if(this.boundary.maxY*scale + translateY < -buffer){
	        	console.log('bottom overflow!');
	        	me.position(paper, translateX, viewHeight + buffer-this.boundary.minY*scale);
				this.paperPos = {
						x: translateX,
						y: viewHeight + buffer-this.boundary.minY*scale
				};
	        }
		});
		
		
		
        paper.on('blank:pointerdown', function($el, x, y){
        	
			if(isShiftActive()){
                return;
            }
			$panel.get(0).beginMove = true;
			
			return;
		});
        
        paper.on('blank:pointerup', function($el, x, y){
        	$panel.get(0).beginMove = false;
        });
	},
	
	appendDefs : function(paper){
		var defs = V('defs');
			defs.attr({
				id:'draw-defs'
			});
		
		V(paper.svg).append(defs);
	},

	appendRadialGradient : function(paper, id, color){
		var radialGradient = V('radialGradient'),
			radialId = 'grad-'+id;
		
		radialGradient.attr({
			id:radialId,
			cx:"50%",
			cy:"50%",
	        r:"50%", 
	        fx:"50%",
	        fy:"50%"
		});
		
		var stop1= V('stop');
		stop1.attr({
			offset:'0%',
			style:'stop-color:rgb(255,255,255);stop-opacity:0'
		});
		
		var stop2= V('stop');
		stop2.attr({
			offset:'100%',
			style:'stop-color:'+color+';stop-opacity:1'
		});
		
		radialGradient.append(stop1);
		radialGradient.append(stop2);
		
		$('#draw-defs').children('radialgradient[id='+radialId+']').remove();
		$('#draw-defs').append(radialGradient.node);
	},

	getScale : function(paper){
		var transform = paper.viewport.getAttribute('transform'),
			scaleStart, scaleValue;
		
		if(!transform){
			// no transform
			return 1;
		}
		
		scaleStart = transform.indexOf('scale(');
	
		if(-1 === scaleStart){
			// no scale
			return 1;
		}
		
		scaleValue = transform.substring(scaleStart+6, transform.indexOf(',', scaleStart));
		
		return parseFloat(scaleValue);
	},

	changeElementProp : function(paper, factor, defineUuid, value){
		var graph = paper.model,
			cell = paper.model.getCell(factor.get('uuid')),
			shape = factor.getShape();
		
		switch(defineUuid){
		case FACTORDEFINE_FACTOR_TEXTCOLOR:
			var color = factor.getTextColor();
			
			cell.attr({text:{fill: color}});
			break;
		case FACTORDEFINE_FACTOR_COLOR:
			var color = factor.getColor(),
				attr = {};
			attr[this.getSvgShape(shape)] = {fill: color};
			cell.attr(attr);
			this.highlightCell(paper.findViewByModel(cell));
			break;
		case FACTORDEFINE_FACTOR_SIZE:
		case FACTORDEFINE_FACTOR_SHAPE:
			var links = graph.getConnectedLinks(cell);
			    isHighlight = /\b(highlighted)\b/.exec(
                        paper.findViewByModel(cell).$el.attr('class'));
            
            cell.remove();
			cell = this.createFactor(paper, factor);

            // it`s supposed to highlight, if it`s highlight before.
            if(isHighlight){
                paper.findViewByModel(cell).highlight();
            }
            
            Ext.Array.each(links, function(link){
            	var relation = Layout.EventSchedule.relationStore.findRecordByKey('uuid',
    					link.get('id'));
            	
            	if(relation){
            		this.createRelation(paper,relation);
            	}
    		}, this);
            
//			graph.addCell(links);
			break;
		}
	},
	
	highlightCell : function(view){
		var color, cell, record;
		
		if(!view){
			return;
		}
		if('link' === view.model.get('type')){
            return;
        }
            
		cell = view.$el.children().children().children();
		record = Layout.EventSchedule.factorStore.findRecordByKey(
				'uuid', view.model.id);
		if(!record){
			return;
		}
		color = record.getColor();
		cell.attr('color',color);
		if('#FFFFFF'===color){
			color = '#AAAAAA';
		}
		this.appendRadialGradient(view.paper, view.model.id, color);
		//$('#draw-defs').children().children(':last').attr('style', 'stop-color:'+color+';stop-opacity:1');
		cell.attr('fill', 'url(#grad-'+view.model.id+')');
		cell.attr('stroke', color);
	},
	
	unhighlightCell : function(view){
		if(!view || 'link'===view.model.get('type')){
			return;
		}
		var cell = view.$el.children().children().children();
		var color = cell.attr('color');
		cell.attr('fill', color);
	},

    getSvgcls : function(value){
		switch(value){
		case 1:
		case 5:
			return joint.shapes.basic.Circle;
		case 2:
		case 6:
			return joint.shapes.basic.Rect;
		case 3:
			return joint.shapes.basic.Diamond;
		case 4:
			return joint.shapes.basic.Triangle;
		default:
			break;
		}
		
		return joint.shapes.basic.Circle;
	},
	
	getSvgShape : function(value){
		switch(value){
		case 1:				// 圆
		case 5:				// 椭圆
			return 'circle';
		case 2:				// 正方
		case 3:				// 菱形
		case 6:				// 长方形
			return 'rect';
		case 4:				// 三角形
			return 'path';
		default:
			break;
		}
		
		return 'circle';
	},
	
	getSvgSize : function(value, len){
		var size = {
				width : len*2,
				height : len*2
		};
		switch(value){
		case 5:
			size.width =  len*2.5;
			size.height = len*1.5;
			break;
		case 6:
			size.width =  len*4;
			size.height = len*0.8;
			break;
		default:
			break;
		}
		return size;
	},
	
	getSvgTextPosition : function(paper, model){
		var tx = 0,
		    ty = 0,
			refX = model.get('attrs').text['ref-x'],
			refY = model.get('attrs').text['ref-y'],
			refDx = model.get('attrs').text['ref-dx'],
			refDy = model.get('attrs').text['ref-dy'],
			scale = Ext.getCmp('scale').value,
			paperPosition = this.position(paper);
        
        if(Ext.isDefined(refDx)){
        	tx = model.get('position').x + model.get('size').width + refDx;
        }
        if(Ext.isDefined(refDy)){
        	ty = model.get('position').y + model.get('size').height + refDy;
        }
        if(Ext.isDefined(refX)){
	        if (refX > 0 && refX < 1) {
	            tx = model.get('position').x + model.get('size').width * refX;
	        }else{
	        	tx = model.get('position').x + refX;
	        }
        }
        if(Ext.isDefined(refY)){
	        if (refY > 0 && refY < 1) {
	            ty = model.get('position').y + model.get('size').height * refY;
	        }else{
	        	ty = model.get('position').y + refY;
	        }
        }
        
        tx -= WIDTH_NAME_INPUT/2 - 5;
        ty -= 10;
        
        // scale
        if(Ext.isNumber(scale)){
        	scale /= 100;
        	tx *= scale;
        	ty *= scale;
        }
        
        // scroll
        tx -= paper.$el.scrollLeft();
        ty -= paper.$el.scrollTop();
        
        // drawpanel's position
		tx += Ext.getCmp('westArea').getCollapsed()?25:Ext.getCmp('westArea').width;
		ty += Ext.getCmp('northArea').height+HEIGHT_CENTERTAB;
		
		// paper's position
		tx += paperPosition.x;
		ty += paperPosition.y;
        
        return {
        	x : tx, y : ty
        };
	},

	isEditingInDraw : function(){
		return 0!=$('#factorName').length;
	},

    gc : function(){
		var factorName = $("#factorName");
		
		if(0 === factorName.length){
			return false;
		}else{
			factorName.blur().remove();
			return true;
		}
	},

    selectCellByUuid : function(paper, uuid){
    	var draw = Layout.Draw,
    		cell = paper.model.getCell(uuid);
    	
    	if(!cell){
    		return;
    	}
    	draw.selectCell(paper.findViewByModel(cell));
    },

    selectCell : function(view){
        var hasSelected,
            paper = view.paper;
        
        hasSelected = isShiftActive()? this.getSelectView(paper):[];
            
        Layout.Select.cancelSelect();
        
        hasSelected.push(view);

        Ext.Array.each(hasSelected, function(view){
            view.highlight(); 
            this.highlightCell(view);
        }, this);
    },

    getSelectView : function(paper){
        var selectedDoms = paper.$el.find('.highlighted'),
            selectedLinkDoms = paper.$el.find('.linkhighlighted'),
			selectedViews = [];
		
		Ext.Array.each(selectedDoms, function(dom){
           selectedViews.push(paper.findView(dom)); 
        });
        Ext.Array.each(selectedLinkDoms, function(dom){
           selectedViews.push(paper.findView(dom)); 
        });
        
        return selectedViews;
    },
	
	getSelectCell : function(paper){
        var selectViews = this.getSelectView(paper),
            selectCells = [];

        Ext.Array.each(selectViews, function(view){
           selectCells.push(view.model); 
        });

        return selectCells;
	},
	
	getSelectRecord : function(paper){
        var cells = this.getSelectCell(paper),
            records = [];

        Ext.Array.each(cells, function(cell){
            if('link' !== cell.get('type')){
                    if(cell.get('factorUuid') !== undefined){
            		var factor =  Layout.EventSchedule.factorStore.findRecordByKey('uuid', cell.get('factorUuid'));
            		var factorProps = factor.getProperties();
            		Ext.each(factorProps,function(prop){
            			if(prop.uuid==cell.get('id')){
            				  records.push({
                  			  	record : Ext.create('Layout.model.CommonFactorModel',prop),
            					type :   Layout.Select.TYPE_FACTOR
                            });
            			}
            		});
            		
            	}else{
            		 records.push({
                         record : Layout.EventSchedule.factorStore.findRecordByKey('uuid', cell.get('id')),
     					type : Layout.Select.TYPE_FACTOR
                     });
            	}
              
            }else{
                records.push({
					record : Layout.EventSchedule.relationStore.findRecordByKey('uuid', cell.get('id')),
					type : Layout.Select.TYPE_RELATION
			    });
            }
        });

        return records;
	},
	
	cancelSelect : function(paper){
		var me = this,
			selectedArray = paper.$el.find('.highlighted'),
			selectedLinkArray = paper.$el.find('.linkhighlighted');
		
		Ext.Array.each(selectedArray, function(el){
			var view = paper.findView(el);
			view.unhighlight();
    		Layout.Draw.unhighlightCell(view);
    	});
        Ext.Array.each(selectedLinkArray, function(el){
			var view = paper.findView(el);
			view.unhighlight();
    	});
	},
	
	createNewFactor : function(shape, x, y, name){
		var ES = Layout.EventSchedule,
			factor,
			drawController = Layout.DrawController;
		
		factor = Layout.DefaultDefine.createFactor(shape, x, y);
		
		if(name){
			factor.set('name', name);
		}
		
		if(ES.factorStore.findRecordByKey('name', factor.get('name'))){
			console.log('factor name duplicate!');
			return;
		}
		
		// set XY
		drawController.eachPanel(function(panel){
			factor.setXY(panel.paperUuid, x, y);
		});
		
		drawController.addFactor(factor);
	},

	
	createProperty : function(paper, factor){
		var props = factor.getProperties(),
			factorUuid = factor.get('uuid'),
			draw = Layout.Draw;
		
		var factorX = factor.getXY(paper).x;
		var factorY = factor.getXY(paper).y;
			
		var propSize = 0;
		
		Ext.Array.each(props, function(prop){
			// only show custom property
			if(RELATIONTYPE_FACTOR !== parseInt(prop.prototype)){
				return;
			}
			propSize++;
		});
		
		if(0==propSize){
			return;
		}
		
		var angle = 300,
			angleStep = 360/propSize,
			linkLength = 150;
		
		Ext.Array.each(props, function(prop){
			
			// only show custom property
			if(RELATIONTYPE_FACTOR !== parseInt(prop.prototype)){
				return;
			}
			
			var shiftX = linkLength * Math.cos((angle % 360) * Math.PI / 180);
			var shiftY = linkLength * Math.sin((angle % 360) * Math.PI / 180);
			
			angle += angleStep;
			
			var propertyCell = new joint.shapes.basic.Circle({
				id : prop.uuid,
				factorUuid : factorUuid,
				isProp : 1,
				shift : {
					x : shiftX,
					y : shiftY
				},
				position : {
					x : factorX + shiftX,
					y : factorY + shiftY
				},
				size: {
					width : 75,
					height : 45
				},
				attrs: { 
					text: { 
							text: prop.name,
							fill: '#3498DB'
					},
					circle : { 
							stroke: '#3498DB',
							fill: '#FFFFFF',
							'stroke-dasharray': '5 2'
					}
				}
			});
		
			paper.model.addCell(propertyCell);
			
			propertyCell.toFront();
			
			paper.findViewByModel(propertyCell).on('cell:pointerdown', function(e, x, y){
				var view = this;
				
				// highlight node
				draw.selectCell(view);
		    	draw.highlightCell(view);
				
				// u can`t move
				//delete paper.sourceView;
				//e.preventDefault();
				
			});
			/*
			paper.findViewByModel(propertyCell).on('cell:pointermove ', function(e, x, y){
                var view = this;
                
                // highlight node
                draw.selectCell(view);
                draw.highlightCell(view);
                
                // u can`t move
                delete paper.sourceView;
                e.preventDefault();
                
            });
			*/
			
			// link
			var link = new joint.dia.Link({
				id : prop.relationUuid,
			    source: { id: prop.factor1Uuid },
			    target: { id: prop.factor2Uuid },
			    smooth : true,
			    toolMarkup: ['<g class="link-tool">',
			                 '</g>'].join(''),
			    attrs: {
			    	'.connection': { 
			    		stroke: '#3498DB', 
			    		'stroke-width': 3, 
			    		'stroke-dasharray': '5 2' 
			    	},
			        '.marker-target':  { stroke: '#3498DB', fill: '#3498DB', d: 'M5.5,15.499,15.8,21.447,15.8,15.846,25.5,21.447,25.5,9.552,15.8,15.152,15.8,9.552z' }
			    },
			    labels: [{ 
			    	position: .5, 
			    	attrs: { text: { text: '' } } 
			    }]
			});
			
			paper.model.addCell(link);
			
			paper.findViewByModel(link).on('cell:pointerdown', function(e, x, y){
				delete paper.sourceView;
			});
		});
		
	},
	
	deleteProperty : function(paper, factor){
		var props = factor.getProperties();
		
		Ext.Array.each(props, function(prop){
			var propCell = paper.model.getCell(prop.uuid);
			
			if(propCell){
				propCell.remove();
			}
		});
	},
    
    createFactor : function(paper, factor){
		var x = factor.getXY(paper).x,
			y = factor.getXY(paper).y,	
			color = factor.getColor(),
			size = factor.getSize(),
			shape = factor.getShape(),
			shapeCls = this.getSvgcls(shape),		
			config = {
				id : factor.get('uuid'),
				position : {
					x : x,
					y : y
				},
				size: this.getSvgSize(shape, size),
				attrs: { 
					text: { 
							text: factor.getName(), 
							fill: factor.getTextColor() 
					} 
				}
			},
			graph = paper.model,
			cell;
		
		if(cell = graph.getCell(factor.get('uuid'))){
			cell.remove();
		}
		
		config.attrs[this.getSvgShape(shape)] = { 
				fill: color,
				stroke: '#FFFFFF'==color?'#000000':color
		};
		
		cell = new shapeCls(config);
		
		graph.addCell(cell);
		
		// append cell event
		this.bindCellEvent(paper.findViewByModel(cell));
		
		return cell;
	},

	createRelation : function(paper, relation){
		var link,
			color = relation.getColor(),
			shape = relation.getShape(),
			graph = paper.model;
		
		if(link = graph.getCell(relation.get('uuid'))){
			link.remove();
		}
		
		link = new joint.dia.Link({
			id : relation.get('uuid'),
		    source: { id: relation.get('factor1Uuid') },
		    target: { id: relation.get('factor2Uuid') },
		    smooth : true,
		    toolMarkup: ['<g class="link-tool">',
		                 '</g>'].join(''),
		    attrs: {},
		    labels: [{ 
		    	position: .5, 
		    	attrs: { text: { text: '' } } 
		    }]
		});
		
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
				
		graph.addCell(link);
		
		this.bindLinkEvent(paper.findViewByModel(link));
		
	},
	
	bindCellEvent : function(view){
		
		view.on('cell:pointerdown', CellEvent.pointerDown);
		
		view.on('cell:pointermove', CellEvent.pointerMove);
		view.on('cell:pointermove', CellEvent.pointerMoveValue);
		view.on('cell:pointermove', CellEvent.pointerMoveProp);
		view.on('cell:pointermove', CellEvent.pointerMovePropValue);
		
		view.on('cell:pointerup', CellEvent.pointerUp);
		
		view.on('cell:dblclick', CellEvent.dblclick);
	},
	
	bindLinkEvent : function(view){
		view.model.click = LinkEvent.click;
		
		view.on('cell:pointermove', LinkEvent.pointerMove);
		
		view.on('cell:pointerup', LinkEvent.pointerUp);
	},
	
	magnify : function(paper, val, x, y){
		var position = this.position(paper),
			currentScale = this.getScale(paper);
		
		paper.scale(currentScale+val,currentScale+val);
		this.position(paper, position.x-x*val, position.y-y*val);
	},
	
	changeScale : function(paper, value, x, y){
    	var ES = Layout.EventSchedule;
    	
    	if(Ext.isNumber(value)){
    		value /= 100;
    	}
    	//画布缩放范围 0.1 - 1
    	//缩放时候改变画布的大小
    	if(value >0.1 && value<=1){
    		paper.scale(value,value);
//    		$(paper.el).css("height",DRAW_HEIGHT*value);
//	    	$(paper.el).css("width",DRAW_WIDTH*value);
//	    	paper.scale(value, value);
    	}
    	
    
    	// if text is too small, all textsvg hold dimensions 
//    	if(value<0.7){
//	    	Ext.Array.each(ES.factorStore.data.items, function(record){
//	    		V(paper.findViewByModel(record.get('uuid')).$el.find('text')[0])
//	    			.scale(0.7/value,0.7/value);
//	    	});
//    	}
    },
    
    refreshPaper : function(paper){
    	var graph = paper.model,
    		elements = graph.getElements(),
			links = graph.getLinks();
		
		Ext.Array.each(elements, function(ele){
			ele.remove();
		});
		Ext.Array.each(links, function(link){
			link.remove();
		});
		
		Ext.Array.each(elements, function(cell){
			
			var factor = Layout.EventSchedule.factorStore.findRecordByKey('uuid',
					cell.get('id'));
			
			if(!factor){
				/* maybe prop or value  */
				return;
			}
			this.createFactor(paper,factor);
		}, this);
		
		Ext.Array.each(links, function(link){
			var relation = Layout.EventSchedule.relationStore.findRecordByKey('uuid',
					link.get('id'));
			
			if(!relation){
				/* maybe prop relation  */
				return;
			}
			
			this.createRelation(paper,relation);
		}, this);
    }
    
});


/**
 * cell Event
 */
var CellEvent = {
    pointerDown : function($el, x, y){
        var draw = Layout.Draw,
            ES = Layout.EventSchedule,
            view = this,
            paper = view.paper,
            factorUuid = view.model.id;
    
        if(draw.gc()){
			// stop drag
			delete this.sourceView;
			return;
		}
		
		if(!view){
			// because of timeseq
			return;
		}
		view.originX = x;
		view.originY = y;
		/* create link immediately*/
		var pressedBtn = Layout.TopTool.getPressedButton();
		if(pressedBtn && 2==pressedBtn.type){
			if(!pressedBtn.field.factor1Uuid){
				pressedBtn.field.factor1Uuid = factorUuid;
				return ;
			}
			
			if(pressedBtn.field.factor1Uuid !== factorUuid){
				
				// if link duplicated, drop it
				var links = paper.model.getConnectedLinks (view.model);
				i = Ext.Array.each(links, function(link){
					if(link.get('target').id === pressedBtn.field.factor1Uuid
						|| link.get('source').id === pressedBtn.field.factor1Uuid){
						return false;
					}
				});
				if(Ext.isNumber(i)){
					delete pressedBtn.factor1Uuid;
					return;
				}
				
				// save link
				relationRecord = Layout.DefaultDefine.createRelation(pressedBtn.field.factor1Uuid, 
								factorUuid);
				
				ES.fireEvent(ES.relationStore, 'addRelation', [relationRecord],
					function(relations){
						ES.relationStore.add(relations);
					}
				);
				
				delete pressedBtn.field.factor1Uuid;
			}
			return ;
		}
		
		// if batch move cell
		var selectCells = draw.getSelectCell(paper);
		if(selectCells.length>1){
			var i=Ext.Array.each(selectCells, function(cell){
				if(cell.id === factorUuid){
					return false;
				}
			});
			if(Ext.isNumber(i)){
				var mouseCell = selectCells[i];
				var mouseCellX = mouseCell.get('position').x;
				var mouseCellY = mouseCell.get('position').y;
				var batchMoveCell = {};
				Ext.Array.each(selectCells, function(cell){
					batchMoveCell[cell.id]={
							shiftX : cell.get('position').x-mouseCellX,
							shiftY : cell.get('position').y-mouseCellY,
					};
				});
//				paper.batchMoveCell = batchMoveCell;
				return;
			}
		}
		delete paper.batchMoveCell;
		
        // highlight node
		draw.selectCell(view);
    	draw.highlightCell(view);
        
		paper.isNewlink = isShiftActive();
		if(paper.isNewlink){
			// create new link, source is currentcell, target is mouse
			var linkView,
				link = new joint.dia.Link({
					    source: { id: factorUuid },
					    target: { id: factorUuid },
					    smooth : true,
					    attrs: {}
					});
			
			paper.addCell(link);
			linkView = paper.findViewByModel(link);
			linkView._arrowheadEnd = 'target';
			linkView._action = 'arrowhead-move';
			linkView._originalZ = linkView.model.get('z');
			linkView.model.set('z', Number.MAX_VALUE);
			linkView.$el.css({ 'pointer-events': 'none' });
			
			paper.sourceView = paper.findView(linkView.$el.find('path[end=target]')[0]);
			
            linkView.on('cell:pointermove', function(){
                paper.time = paper.time || 1;
    			if(0 != (paper.time++%20)){
    				return;
    			}
                
                Ext.getCmp('tab-project').setActiveTab(2);
            });
			
			linkView.on('cell:pointerup', function($el, x, y){
				var links,
					i,
					relationRecord,
					graph = paper.model;
				
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
				links = graph.getConnectedLinks (view.model);
				i = Ext.Array.each(links, function(link){
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
				relationRecord = Layout.DefaultDefine.createRelation(factorUuid, 
												this._viewUnderPointer.model.id);
				
				
				ES.fireEvent(ES.relationStore, 'addRelation', [relationRecord],
						function(relations){
							ES.relationStore.add(relations);
						}
				);
			}, linkView);
		}else{
			var factor = ES.factorStore.findRecordByKey('uuid', factorUuid);
			
			
			
			// focus translate
			Ext.getCmp('factorPanel').selModel.deselectAll();
			Ext.getCmp('centerArea').focus();
			
	    	// init top tool
	    	Layout.TopTool.initTopTool(factor);
	    	
		}
    },
    
    pointerMovePropValue : function(e, x, y){
    	var factorUuid = this.model.id,
			paper = this.paper,
			paperScale = Layout.Draw.getScale(paper),
			factor = Layout.EventSchedule.factorStore.findRecordByKey('uuid', factorUuid),
			paperPosition = Layout.Draw.position(paper);
    	
    	props = factor.getProperties();
		
		Ext.Array.each(props, function(prop){
			var valueCell = paper.model.getCell(Layout.FactorValue.PREFIX_UUID+prop.uuid),
				propCell = paper.model.getCell(prop.uuid),
				bbox;
			
			if(!valueCell || !propCell){
				return;
			}
			
			bbox = paper.findViewByModel(propCell).getBBox();
			
			posX = (bbox.x+bbox.width-paperPosition.x)/paperScale+3;
			posY = (bbox.y-paperPosition.y)/paperScale;
			
			valueCell.position(posX, posY);
		}, this);
    },
    
    pointerMoveProp : function(e, x, y){
    	var factorUuid = this.model.id,
			paper = this.paper,
			factor = Layout.EventSchedule.factorStore.findRecordByKey('uuid', factorUuid),
			factorX = this.model.get('position').x,
			factorY = this.model.get('position').y;
			
		props = factor.getProperties();
		
		Ext.Array.each(props, function(prop){
			var propCell = paper.model.getCell(prop.uuid);

			if(!propCell){
				return;
			}
			propCell.position(factorX + propCell.get('shift').x, 
							factorY + propCell.get('shift').y);
		}, this);
		
    },
    
    pointerMoveValue : function(){
		var uuid = this.model.id,
			paper = this.paper,
			valueCell = paper.model.getCell(Layout.FactorValue.PREFIX_UUID+uuid),
			bbox,
			paperScale,
			paperPosition = Layout.Draw.position(paper);

		if(!valueCell){
			return;
		}
		
		paperScale = Layout.Draw.getScale(paper);
		
		bbox = this.getBBox();
		valueCell.position((bbox.x+bbox.width-paperPosition.x)/paperScale+3, 
							(bbox.y-paperPosition.y)/paperScale);
	},

    pointerMove : function(e, x, y){
		var paper = this.paper,
            view = this,
            oldPositionX,
            newPositionX,
            oldPositionY,
            newPositionY,
            shiftX = x-view.originX,
            shiftY = y-view.originY,
            factorUuid,
            factor,
            draw = Layout.Draw;
    
        
		paper.time = paper.time || 1;
		if(0 != (paper.time++%20)){
			return;
		}
		
		factorUuid = view.model.id,
    	factor = Layout.EventSchedule.factorStore.findRecordByKey("uuid",factorUuid),
		oldPositionX = factor.getXY(paper).x,
		oldPositionX = isNaN(oldPositionX)?0:oldPositionX,
		newPositionX = isNaN(view.originX)?oldPositionX:oldPositionX+shiftX;
		oldPositionY = factor.getXY(paper).y;
 		oldPositionY = isNaN(oldPositionY)?0:oldPositionY;
 		newPositionY = isNaN(view.originY)?oldPositionY:oldPositionY+shiftY;
		
		// batch move
		var selectCells = draw.getSelectCell(paper);
		if(selectCells.length>1){
			
			Ext.Array.each(selectCells, function(cell){
				if(factorUuid === cell.id){
					return;
				}
			});
			
			return;
		}
		
		// single move
		try{
			Ext.getCmp('axe-x').setRawValue(newPositionX);
			Ext.getCmp('axe-y').setRawValue(newPositionY);
		}catch(e){
			// do nothing
		}
	},

    pointerUp : function($el, x, y) {
        var draw = Layout.Draw,
            view = this,
            poolStore = Layout.EventSchedule.factorStore,
			factorUuid = view.model.id,
			factor,
			oldPositionX,
			newPositionX,
			oldPositionY,
			newPositionY,
			paper = view.paper,
			ES = Layout.EventSchedule;

        delete paper.sourceView;
        
        if(draw.gc()){
			// stop drag
			return;
		}
        
		if(!view){
			// because of timeseq
			return;
		}
		
    	factor = poolStore.findRecordByKey("uuid",factorUuid);
    	
		oldPositionX = factor.getXY(paper).x;
		oldPositionX = isNaN(oldPositionX)?0:oldPositionX;
		newPositionX = isNaN(view.originX)?oldPositionX:oldPositionX+x-view.originX;
    	Ext.getCmp('axe-x').setRawValue(newPositionX);
    		
		oldPositionY = factor.getXY(paper).y;
		oldPositionY = isNaN(oldPositionY)?0:oldPositionY;
		newPositionY = isNaN(view.originY)?oldPositionY:oldPositionY+y-view.originY;
    	Ext.getCmp('axe-y').setRawValue(newPositionY);
    	
    	if(x != view.originX || y != view.originY){
    		ES.fireEvent(ES.factorStore, 'editLayout', [{
    			uuid : factor.layout[paper.uuid].uuid,
    			defineUuid : paper.uuid,
    			factorUuid : factorUuid, 
    			x:newPositionX,
    			y:newPositionY
    		}], function(){
    			factor.setXY(paper, newPositionX, newPositionY);
    		});
    	}else{
    	
	    	// active factor define
			Ext.getCmp('factorPanel').fireEvent('init', factor);
			
			// active factor prop
			if(factorUuid === Ext.getCmp('editFactorPropGrid').factorUuid
					&& 'editFactorPropGrid' === Ext.getCmp('tab-project').getActiveTab().id){
				return;
			}
			Ext.getCmp('tab-project').expand();
			Ext.getCmp('editFactorGrid').fireEvent('clickProperty',
					factorUuid, Ext.getCmp('editFactorPropGrid'));
    	}
	},

    dblclick : function(evt, x, y){
		var draw = Layout.Draw,
            factorUuid = this.model.id,
            model = this.model,
			style = [],
			size = model.get('size').width,
			name = model.get('attrs').text.text,
			textPos = draw.getSvgTextPosition(this.paper, model),
			ES = Layout.EventSchedule,
			factor = ES.factorStore.findRecordByKey('uuid', factorUuid);
			
		if(draw.gc()){
			// do nothing
		}
		
		style.push('position:absolute');
		style.push('z-index:9999');
		style.push('width:'+WIDTH_NAME_INPUT+'px');
		style.push('top:'+(textPos.y+'px'));
		style.push('left:'+(textPos.x+'px'));
		
		$("<input>",{
			id : 'factorName',  
			type : 'text',
			val : name,
			style : style.join(';')
		})
		.bind("blur", function(evt){
			(function(uuid){
				var factorPanel = Ext.getCmp('factorPanel');
				factorPanel.getStore().setValue('name', evt.target.value);
				factorPanel.fireEvent('clickSave');
				$(evt.target).remove();
			})(factorUuid);
		})
		.bind('keypress',function(evt){
            if(13 === evt.keyCode)    
            {
            	draw.gc();
            }
        })
        .appendTo('body')
        .select();
	}
	
};


/**
 * link Event
 */
var LinkEvent = {
    click : function(uuid){
        var draw = Layout.Draw;
        
		Ext.getCmp('tab-project').expand();
		Ext.getCmp('editRelationGrid').fireEvent('clickProperty', uuid, Ext.getCmp('editRelationPropGrid'));
	
	    //highlight
        draw.selectCell(this);
    	
    	// init top tool
    	Layout.TopTool.initTopTool(
    			Layout.EventSchedule.relationStore.findRecordByKey('uuid', uuid));
	},

    pointerMove : function($el, x, y){
		Ext.getCmp('tab-project').setActiveTab(2);
	},

    pointerUp : function($el, x, y){
		var source, target,
			sourceId, targetId,
			underPointerId,underPointerName,
			newRelation,
			relationUuid = this.model.id,
			ES = Layout.EventSchedule,
			relation = ES.relationStore.findRecordByKey('uuid',relationUuid);
		
		// if link has no target, stop !
		if(!this._viewUnderPointer){
			this.model.set({ 
				source: {id:relation.get('factor1Uuid')}, 
				target: {id:relation.get('factor2Uuid')} 
			});
			return;
		}
		underPointerId = this._viewUnderPointer.model.id;

		// if target equal source, stop !
		source = this.model.get('source');
		target = this.model.get('target');
		sourceId = (!this._isPoint(source)) ? source.id : underPointerId;
		targetId = (!this._isPoint(target)) ? target.id : underPointerId;
		if(sourceId === targetId){
			delete this._viewUnderPointer;
			this.model.set({ 
				source: {id:relation.get('factor1Uuid')}, 
				target: {id:relation.get('factor2Uuid')} 
			});
			return;
		}
		
		// if relation has existed, stop!
		newRelation = ES.relationStore.findRelation(sourceId, targetId);
		if(newRelation && newRelation.get('uuid')!=this.model.id){
			delete this._viewUnderPointer;
			this.model.set({ 
				source: {id:relation.get('factor1Uuid')}, 
				target: {id:relation.get('factor2Uuid')} 
			});
			return ;
		}
		
		// change relation endPoint
		underPointerName = ES.factorStore.findRecordByKey('uuid', underPointerId).get('name');
		if(this._isPoint(source)){
			relation.set('factor1Uuid', underPointerId);
			relation.set('factor1Name', underPointerName);
		}else{
			relation.set('factor2Uuid', underPointerId);
			relation.set('factor2Name', underPointerName);
		}
		ES.fireEvent(ES.relationStore, 'changeRelation', relation);
		
	}
};

/**
 * Paper Event
 */
var PaperEvent  = {
	pointerDown : function($el, x, y){
		Layout.Draw.gc();
		Layout.Select.cancelSelect();
		
		var pressedBtn = Layout.TopTool.getPressedButton();
		/* create cell immediately*/
		if(pressedBtn && 1==pressedBtn.type){
			Layout.Draw.createNewFactor(pressedBtn.field.value, x,y);
		}
		
	}
};
