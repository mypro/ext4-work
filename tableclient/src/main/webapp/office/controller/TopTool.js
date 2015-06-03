Ext.define('Layout.controller.TopTool', {
    extend: 'Ext.app.Controller',
    
    init: function() {
    	this.control({
            '#tool-save' : {
            	click : this.clickSave
            },
            '#tool-delete' : {
            	click : this.clickDelete
            },
            '#tool-import' : {
            	click : this.clickImport
            },
            '#tool-c' : {
            	click : this.clickCopy
            },
            '#tool-p' : {
            	click : this.clickPast
            },
            '#tool-x' : {
            	click : this.saveAs
            },
            '#create-factor':{
            	click : this.createFactor 
            },
            '#create-factorProp':{
            	click : this.createFactorProp
            },
            '#create-relationProp':{
            	click : this.createRelationProp 
            },
            '#layout-whole':{
            	click : this.layoutWhole
            },
            '#layout-back':{
            	click : this.layoutBack
            },
            '#layout-front':{
            	click : this.layoutFront
            }
    	});
    },
    
    initTopTool : function(factor){
    	var activePaper = Layout.DrawController.getActivePaper();
    	
    	// if it`s a factor, then set 'size', 'axe-x', 'axe-y'
    	if(!(factor instanceof Layout.model.RelationModel)){
    		// size
	    	Ext.getCmp('size').setRawValue(parseInt(factor.getSize()));
	    	
	    	// axe
	    	Ext.getCmp('axe-x').setRawValue(parseInt(factor.getXY(activePaper).x));
	    	Ext.getCmp('axe-y').setRawValue(parseInt(factor.getXY(activePaper).y));
	    	
	    	// font-color
	    	var textColor = factor.getTextColor();
	    	$('#font-color span span span').css({'color': textColor});
	    	Ext.getCmp('tool-edit').down('#font-color colorpicker').select(textColor, true);
    	}
    	
    	// do this whatever
    	var color = factor.getColor();
    	$('#graph-color span span span').css({'color': color});
    	Ext.getCmp('tool-edit').down('#graph-color colorpicker').select(color, true);
    },
    
    layoutWhole : function(){
    	var drawController = Layout.DrawController,
    		factors = Layout.EventSchedule.factorStore.data.items,
    		paper = drawController.getActivePaper();
    	
		if(!isNaN(parseInt(paper.panel.type)) && 0!=parseInt(paper.panel.type)){
			// if this is a algorithm panel, then ...
			Layout.DrawController.autoDraw(paper, parseInt(paper.panel.type));
		}else{
			// scale auto
			Layout.Layout.autoScale(paper, factors);
		}
    	
    },
    
    saveAs : function(){
    	Layout.DrawTabController.createNewTab(Ext.getCmp('centerArea').getActiveTab());
    },
    
    layoutBack : function(){
    	var drawController = Layout.DrawController,
    		positions = drawController.layoutHistory.back();
    	
    	if(positions){
    		drawController.batchUpdatePosition(positions);
    	}
    },
    
    layoutFront : function(){
    	var drawController = Layout.DrawController,
			positions = drawController.layoutHistory.front();
		
		if(positions){
			drawController.batchUpdatePosition(positions);
		}
    },
    
    createFactor : function(){
    	var x = 10;
    	var y = 10;
    	var factor = Layout.DefaultDefine.createFactor(1, x, y),
			ES = Layout.EventSchedule;
		
		if(ES.factorStore.findRecordByKey('name', factor.get('name'))){
			console.log('factor name duplicate!');
			return;
		}
		
		Layout.DrawController.addFactor(factor);
    },
    
    createFactorProp : function(){
    	var selectObj = Layout.Select.getSelect();
    	
    	if(!selectObj || Layout.Select.TYPE_FACTOR !==selectObj.type){
    		return;
    	}
    	
    	Layout.EditFactorPropController.addProp();
    },
    
    createRelationProp : function(){
    	var selectObj = Layout.Select.getSelect();
    	
    	if(!selectObj || Layout.Select.TYPE_RELATION !==selectObj.type){
    		return;
    	}
    	
    	Layout.EditRelationPropController.addProp();
    },
    
    clickImport : function(btn, e){
    	var AddfileForm=new Ext.FormPanel(
    			{
    				name : 'AddfileForm',
    				id:'AddfileForm',
    				frame : true,
    				labelWidth : 90,
    				url : '../../../work-platform/getDataFromExcel.do',
    				fileUpload : true,
    				width : 420,
    				autoDestroy : true,
    				bodyStyle : 'padding:0px 10px 0;',
    				items : [{
    							id:'fileName',
    							xtype : 'filefield',
    							emptyText : '选择上传文件',
    							fieldLabel : '文件',
    							name : 'upfile',
    							buttonText : '',
    							anchor : '95%',
    							buttonText: '选择excel文件.',
    							listeners : {
    								'change':function(fb,v){
    									var re_text = /xls|xlsx/i; 
    									var fnNames =  v.split('.');
    									var fnSuffix = fnNames[fnNames.length-1];
    									if (fnSuffix.search(re_text) == -1) {     
    										Ext.Msg.alert("错误","不允许选择该类型文件，请重新选择！");
    										Ext.getCmp('saveButton').setDisabled(true);
    									}else{
    										Ext.getCmp('saveButton').setDisabled(false);
    									}
    										
    								}
    							}
    						}]
    			});
    	
    	var AddfileWin=new Ext.Window(
    			{
    				name : 'AddfileWin',
    				width : '450',
    				height : '180',
    				layout : 'fit',
//    				closeAction : 'close',
    				closeable:false,
    				title : '上传文件',
    				buttonAlign : 'center',
    				resizable : false,
    				modal : true,
    				autoDestroy : true,
    				items : AddfileForm,
    				buttons :[{
    							text : '保存',
    							id:'saveButton',
    							disabled:true,
    							handler : function() {
    								if (AddfileForm.getForm().isValid()) {
    									Ext.MessageBox.show({
    										title : '请稍等...',
    										msg : '因子导入中...',
    										progressText : '',
    										width : 300,
    										progress : true,
    										closable : false,
    										animEl : 'loading'
    									});

    									AddfileForm.getForm().submit(
    											{
    												success : function(form, action) {
    													AddfileForm.close();
    													AddfileWin.close();
    													Ext.MessageBox.alert("提示", '因子导入成功');
    													var factors = action.result.factors;
    													
    													var distance = 100;
    													
    													Ext.Array.each(factors, function(factor){
    														Layout.Draw.createNewFactor(1, 
    																distance*((parseInt(factor.column)+1)),
    																distance*((parseInt(factor.row)+1)),
    																factor.name);
    													});
    													
    												},
    												failure : function(form, action) {
//    													var Result = action.result.flag;
    													Ext.MessageBox.alert("提示",'导入失败');
    												}
    											});
    								}
    							}
    						}, {
    							text : '重置',
    							handler : function() {
    								AddfileForm.getForm().reset();
    							}
    						}, {
    							text : '关闭',
    							handler : function() {
    								Ext.getCmp('saveButton').destroy();
    								AddfileForm.close();
    								AddfileWin.close();
    							}
    						} ]
    			});
    			AddfileWin.show();
    },
    
    clickSave : function(btn, e){
    	Ext.getCmp('factorPanel').fireEvent('clickSave');
    },
    
    clickDelete : function(btn, e){
    	/* if factor is editing in draw, it's prohibited to continue...*/
		if(Layout.Draw.isEditingInDraw()){
			return;
		}
		
		e.browserEvent.preventDefault();
		
    	var ES = Layout.EventSchedule,
    		cells = Layout.DrawController.getSelectCell(),
    		row_factorProp = Ext.getCmp('editFactorPropGrid').getSelectRow(),
    		row_relationProp = Ext.getCmp('editRelationPropGrid').getSelectRow();

    	// delete Factor or Relation
    	Ext.Array.each(cells, function(cell){
            if('link' !== cell.get('type')){
	    		var factor = ES.factorStore.findRecordByKey('uuid', cell.get('id'));
	    		
	    		ES.fireEvent(ES.factorStore, 'removeFactor', factor,
	    				function(factor){
	    					ES.factorStore.remove(factor);
	    				}
	    		);
	    	}else{
	    		var relation = ES.relationStore.findRecordByKey('uuid', cell.get('id'));
	    		
	    		ES.fireEvent(ES.relationStore, 'removeRelation', relation,
	    				function(relation){
	    					ES.relationStore.remove(relation);
	    				}
	    		);
	    	}
        });
    	
    	// delete factor property
    	if(!isNaN(row_factorProp)){
    		var grid = Ext.getCmp('editFactorPropGrid'),
    			record = grid.getStore().getAt(row_factorProp);
    		
    		if(0 != parseInt(record.get('prototype'))){
    			return ;
    		}
    		
    		ES.fireEvent(ES.factorStore, 'removeProperty', record, 
    				function(record){
    					ES.factorStore.findRecordByKey('uuid', record.get('factor1Uuid'))
    											.removeProperty(record.get('uuid'));
    				},
    				Ext.create('Layout.event.EventContext',{
    					grid : grid
    				})
    		);
    	}
    	
    	// delete relation property
    	if(!isNaN(row_relationProp)){
    		var grid = Ext.getCmp('editRelationPropGrid'),
				record = grid.getStore().getAt(row_relationProp);
    		
    		if(0 != parseInt(record.get('prototype'))){
    			return ;
    		}
    		
    		ES.fireEvent(ES.relationStore, 'removeProperty', record, 
    				function(record){
    					ES.relationStore.findRecordByKey('uuid', record.get('factor1Uuid'))
    											.removeProperty(record.get('uuid'));
    				},
    				Ext.create('Layout.event.EventContext',{
    					grid : grid
    				})
    		);
    	}
    },
    
    clickCopy : function(btn, e){
    	/* if factor is editing in draw, it's prohibited to move*/
		if(Layout.Draw.isEditingInDraw()){
			return;
		}
		
		e.browserEvent.preventDefault();
    	Layout.Copy.ctrlC();
    	
    	// aim to translate focus from any input
    	Ext.getCmp('centerArea').focus();
    },
    
    clickPast : function(btn, e){
    	/* if factor is editing in draw, it's prohibited to move*/
		if(Layout.Draw.isEditingInDraw()){
			return;
		}
		/* if factor define is editing , ....*/
		if(Ext.getCmp('factorPanel').isEditing){
			return;
		}
		
		e.browserEvent.preventDefault();
    	Layout.Copy.ctrlV();
    },
    
    clickRelationShape : function(btn){
    	var me = Layout.TopTool,
    		drawController = Layout.DrawController,
    		cells = drawController.getSelectCell(),
    		pressed = btn.pressed;

    	me.selectedRelationShape = btn.value;

        Ext.Array.each(cells, function(cell){
            if('link' !== cell.get('type')){
        	}else{
                drawController.changeRelationProp(cell.get('id'), FACTORDEFINE_RELATION_SHAPE,
    				btn.value, null, "");
        	}
        });
        
        Ext.Array.each(Ext.getCmp('shapeGroup').items.items, function(btn){
        	btn.toggle && btn.toggle(false);
    	});
    	Ext.Array.each(Ext.getCmp('relationGroup').items.items, function(btn){
    		btn.toggle && btn.toggle(false);
    	});
    	btn.toggle(!pressed);
    	delete btn.factor1Uuid;
    },
    
    changeSize : function(field){
    	var size = field.value,
    		drawController = Layout.DrawController,
    		cells = drawController.getSelectCell();

        Ext.Array.each(cells, function(cell){
            if('link' !== cell.get('type')){
        		drawController.changeFactorProp(cell.get('id'), FACTORDEFINE_FACTOR_SIZE,
        					size, null, "");
        	}else{
        	}
        });
    },
    
    changeTextColor : function(field){
    	var color = '0x'+field.value,
			drawController = Layout.DrawController,
			cells = drawController.getSelectCell();
    	
    	$('#font-color span span span').css({'color': '#'+field.value});
    	
    	Ext.Array.each(cells, function(cell){
    		drawController.changeFactorProp(cell.get('id'), FACTORDEFINE_FACTOR_TEXTCOLOR,
    				color, null, "");
    	});
    },
    
    changeColor : function(field){
    	var color = '0x'+field.value,
    		drawController = Layout.DrawController,
    		cells = drawController.getSelectCell();
    	
    	$('#graph-color span span span').css({'color': '#'+field.value});

        Ext.Array.each(cells, function(cell){
            if('link' !== cell.get('type')){
        		drawController.changeFactorProp(cell.get('id'), FACTORDEFINE_FACTOR_COLOR,
        				color, null, "");
        	}else{
        		drawController.changeRelationProp(cell.get('id'), FACTORDEFINE_RELATION_COLOR,
        				color, null, "");
        	}
        });
        
    },
    
    showValue : function(field){
    	var ES = Layout.EventSchedule,
    		drawController = Layout.DrawController,
    		paper = drawController.getActivePaper();
    	
    	if(field.pressed){
    		
    		Ext.Array.each(ES.factorStore.data.items, function(factor){
	    		if(!factor.layout[paper.uuid]){
	    			return;
	    		}
	    		Layout.FactorValue.deleteFactorValue(paper, factor);
	    	});
    		
    		field.toggle(false);
    		field.setText('显示值');
    	}else{
    	
	    	Ext.Array.each(ES.factorStore.data.items, function(factor){
	    		if(!factor.layout[paper.uuid]){
	    			return;
	    		}
	    		if(factor.layout[paper.uuid].showValue){
	    			return;
	    		}
	    		Layout.FactorValue.createFactorValue(paper, factor);
	    	});
	    	
	    	field.toggle(true);
	    	field.setText('隐藏值');
    	}
    },
    
    showProperty : function(field){
    	var ES = Layout.EventSchedule,
			drawController = Layout.DrawController,
			paper = drawController.getActivePaper();
	
		if(field.pressed){

			Ext.Array.each(ES.factorStore.data.items, function(factor){
	    		if(!factor.layout[paper.uuid]){
	    			return;
	    		}
	    		
	    		Layout.Draw.deleteProperty(paper, factor);
	    	});
			
			var showPropertyValueBtn = Ext.getCmp('showPropertyValue');
			
			if(showPropertyValueBtn.pressed){
				Layout.TopTool.showPropertyValue(showPropertyValueBtn);
			}
			
			field.toggle(false);
		}else{
			
			Ext.Array.each(ES.factorStore.data.items, function(factor){
	    		if(!factor.layout[paper.uuid]){
	    			return;
	    		}
	    		
	    		Layout.Draw.createProperty(paper, factor);
	    	});
			
			field.toggle(true);
		}
    },
    
    showPropertyValue : function(field){
    	var ES = Layout.EventSchedule,
			drawController = Layout.DrawController,
			paper = drawController.getActivePaper();
    	
    	if(!Ext.getCmp('showProperty').pressed){
    		// U must show property firstly!
    		return;
    	}
	
		if(field.pressed){
	
			Ext.Array.each(ES.factorStore.data.items, function(factor){
	    		if(!factor.layout[paper.uuid]){
	    			return;
	    		}
	    		
	    		Layout.FactorValue.deleteFactorProperty(paper, factor);
	    	});
			
			field.toggle(false);
		}else{
			
			Ext.Array.each(ES.factorStore.data.items, function(factor){
	    		if(!factor.layout[paper.uuid]){
	    			return;
	    		}
	    		
	    		Layout.FactorValue.createFactorProperty(paper, factor);
	    	});
			
			field.toggle(true);
		}
    },
    
    changeShape : function(field){
    	var shape = field.value,
    		drawController = Layout.DrawController,
    		cells = drawController.getSelectCell(),
    		pressed = field.pressed;
    	
    	Ext.Array.each(cells, function(cell){
            if('link' !== cell.get('type')){
        		drawController.changeFactorProp(cell.get('id'), FACTORDEFINE_FACTOR_SHAPE,
        				shape, null, "");
        	}else{
        	//	drawController.changeRelationProp(cell.get('id'), FACTORDEFINE_RELATION_SHAPE,
        	//			shape, null, "");
        	}
        });
    	
    	Ext.Array.each(Ext.getCmp('shapeGroup').items.items, function(btn){
    		btn.toggle && btn.toggle(false);
    	});
    	Ext.Array.each(Ext.getCmp('relationGroup').items.items, function(btn){
    		btn.toggle && btn.toggle(false);
    	});
    	field.toggle(!pressed);
    },
    
    changeX : function(field){
    	var value = field.value,
			drawController = Layout.DrawController,
			cells = drawController.getSelectCell();
    	
    	if(!SHAKE.preventShake("direction", 500, drawController)){
            return;
        }
    	
        if(0 == cells.length){
            return;
        }

        cell = cells[0];
        
		if('link' !== cell.get('type') && value >= 0){
			Layout.Layout.batchUpdatePosition(drawController.getActivePaper(), [{
				uuid : cell.get('id'),
				posX : value,
				posY : cell.get('position').y
			}]);
		}else{
			console.log("value 不可取负值！")
		}
    },
    
    changeY : function(field){
    	var value = field.value,
			drawController = Layout.DrawController,
			cells = drawController.getSelectCell(),
			cell;
    	
    	if(!SHAKE.preventShake("direction", 500, drawController)){
            return;
        }
		
		if(0 == cells.length){
			return;
		} 

        cell = cells[0];
        
		if('link' !== cell.get('type') && value >= 0){
			Layout.Layout.batchUpdatePosition(drawController.getActivePaper(), [{
				uuid : cell.get('id'),
				posX : cell.get('position').x,
				posY : value
			}]);
		}else{
			console.log("value 不可取负值！")
		}
    },
    
    changeScale : function(field){
    	Layout.Draw.changeScale(Layout.DrawController.getActivePaper(), field.value);
    },
    
    direction: function(keycode, step){
    	var drawController = Layout.DrawController,
			cells = drawController.getSelectCell(),
			step = step || 20;

		/* if factor is editing in draw, it's prohibited to move*/
		if(Layout.Draw.isEditingInDraw()){
			return;
		}

        if(!SHAKE.preventShake("direction", 500, drawController)){
            return;
        }

        Ext.Array.each(cells, function(cell){
            if('link' !== cell.get('type')){
    			switch(keycode){
    			case Ext.EventObject.UP:
    				if(cell.get('position').y-step<0){
    					return;
    				}
    				Ext.getCmp('axe-y').setRawValue(cell.get('position').y-step);
//    				drawController.changeFactorProp(cell.get('id'), FACTORDEFINE_FACTOR_Y,
//    						cell.get('position').y-step, cell.get('position').y, true);
    				Layout.Layout.batchUpdatePosition(drawController.getActivePaper(), [{
    					uuid : cell.get('id'),
    					posX : cell.get('position').x,
    					posY : cell.get('position').y-step
    				}]);
    				break;
    			case Ext.EventObject.DOWN:
    				if(cell.get('position').y+step>DRAW_HEIGHT){
    					return;
    				}
    				Ext.getCmp('axe-y').setRawValue(cell.get('position').y+step);
//    				drawController.changeFactorProp(cell.get('id'), FACTORDEFINE_FACTOR_Y,
//    						cell.get('position').y+step, cell.get('position').y, true);
    				Layout.Layout.batchUpdatePosition(drawController.getActivePaper(), [{
    					uuid : cell.get('id'),
    					posX : cell.get('position').x,
    					posY : cell.get('position').y+step
    				}]);
    				break;
    			case Ext.EventObject.LEFT:
    				if(cell.get('position').x-step<0){
    					return;
    				}
    				Ext.getCmp('axe-x').setRawValue(cell.get('position').x-step);
    				Layout.Layout.batchUpdatePosition(drawController.getActivePaper(), [{
    					uuid : cell.get('id'),
    					posX : cell.get('position').x-step,
    					posY : cell.get('position').y
    				}]);
    				break;
    			case Ext.EventObject.RIGHT:
    				if(cell.get('position').x+step>DRAW_WIDTH){
    					return;
    				}
    				Ext.getCmp('axe-x').setRawValue(cell.get('position').x+step);
    				Layout.Layout.batchUpdatePosition(drawController.getActivePaper(), [{
    					uuid : cell.get('id'),
    					posX : cell.get('position').x+step,
    					posY : cell.get('position').y
    				}]);
    				break;
    			}
    			
    		}else{
    			
    		}
        });
    },
    
    getPressedButton : function(){
    	var shapeBtns ,
    		relationBtns,
    		i;
    	
    	shapeBtns = Ext.getCmp('shapeGroup').items.items;
    	
    	i = Ext.Array.each(shapeBtns, function(btn){
    		if(btn.pressed){
    			return false;
    		}
    	});
    	
    	if(Ext.isNumber(i)){
    		return {
    			type : 1,
    			field : shapeBtns[i]
    		};
    	}
    	
    	relationBtns = Ext.getCmp('relationGroup').items.items;
    	
    	i = Ext.Array.each(relationBtns, function(btn){
    		if(btn.pressed){
    			return false;
    		}
    	});
    	
    	if(Ext.isNumber(i)){
    		return {
    			type : 2,
    			field : relationBtns[i]
    		};
    	}
    	
    	return null;
    		
    }
    
});