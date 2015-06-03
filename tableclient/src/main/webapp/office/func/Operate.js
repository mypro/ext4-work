Ext.define('Layout.func.Operate',{
	
	position : function(paper, x, y){},
	
	initPaper : function(panel){
		var id = panel.id + '-body',
			panelEl = Ext.get(id).el,
			graph,
			paper,
			$panel = $('#'+id);
		
		
		var  width  = OPRATE_WIDTH,
		     height = Ext.getCmp(panel.id).getHeight()-40,
		     cellWidth = 80,
		     cellHeight = 20;
		
		//中心矩阵块
		var rectx =cellWidth*(parseInt(0.5*width/cellWidth)),
			recty =cellHeight*(parseInt(0.5*height/cellHeight));
		
		
		Ext.Array.each(panelEl.dom.childNodes, function(child,i){
			panelEl.dom.removeChild(child);
		});
	
	

	
		$("#"+panel.id).css({'background':'#DFDFDF'})
		$panel.unbind("mousedown");
		$panel.unbind("dblclick");
		
	
		graph = new joint.dia.Graph;
		paper = new joint.dia.Paper({
    	    el: $panel,
    	    width: width,
    	    height: height,
    	    gridSize: 1,
    	    model: graph
    	});
		paper.panel = panel;
	
		this.initTheInterface(paper,rectx,recty,width,height);
		
		paper.matrixs = this.initMatrixs(paper,cellWidth,cellHeight);
		
		this.renderMatrix(paper, 80, 20);
		
//		paper.matrixs.initArray(paper.matrixs.crosswise,paper.matrixs.verticalSize,paper.matrixs.cellwidth,paper.matrixs.cellheight)
//		
		paper.on('anywhere:pointerdown',anywhereEvent.thepointerDown);
		paper.on('blank:pointerup',PaperEvent.pointerUp);
		
//		this.appendDefs(paper);
		
        
		return paper;
	},
	
	/**
	 * 初始化矩阵
	 */
	initMatrixs : function(paper,cellWidth,cellHeight){
		var matrixs = new Matrixs(paper,cellWidth,cellHeight);
		Layout.Operate.initArray(matrixs,matrixs.crosswise,matrixs.verticalSize,matrixs.cellwidth,matrixs.cellheight);
		return matrixs;
	},
	initArray : function (matrixs,crosswise,verticalSize,cellwidth,cellheight){
		
			var me = matrixs,
			    array  = new Array();
		
			if(crosswise >0 && verticalSize>0){
				for(var i=0;i<verticalSize;i++){
				var array_x = new Array();
					for(var j=0;j<crosswise;j++){
					var cell = new Cell(j*cellwidth,i*cellheight,cellwidth,cellheight)
						array_x.push(cell);
				}
				array.push(array_x);
				}
			}
			var m =matrixs.center.m,
				n =matrixs.center.n;
			
			//三个文字位置和中心位置一被占用
			array[m][n].isUsed=1;
			array[m][n].isCenter=1;
			array[m][0].isUsed=1;
			array[3][n].isUsed=1;
			array[0][n+1].isUsed=1;
			
			me.array = array;
	},
	
	renderMatrix : function(paper, x, y){
		var viewport = $(V(paper.svg).node).children('g:first-child');
		
		for(var i=0;i<1600/y;i++){
    		var path = V('path');
        	path.attr({
        		stroke : 'blue',
        		'stroke-width' : '0.1',
        		fill : 'blue',
    			d:'M -800 '+(i*y-800)+' L800 '+(i*y-800)+' Z'
    		});
        	viewport.append(path.node);
    	}
		for(var i=0;i<1600/x;i++){
    		var path = V('path');
        	path.attr({
        		stroke : 'blue',
        		'stroke-width' : '0.1',
        		fill : 'blue',
    			d:'M '+(i*x-800)+' -800 L'+(i*x-800)+' 800 Z'
    		});
        	viewport.append(path.node);
    	}
	},
	
	/**
	 * 初始化界面
	 */
	initTheInterface : function (paper,rectx,recty,width,height){
		var array = new Array();
		var arrow_l = new joint.shapes.basic.Path({
			position: { x: 0, y: recty },
			size: { width: width, height: 40 },
			attrs: { rect: { fill: '#FFFFFF' } ,path:{d:'M0,0 L520,0 L520,-10 L560,10 L520,30 L520,20 L0,20 Z'}}
		});
		
		var arrow_v = new joint.shapes.basic.Path({
			position: { x: 280, y: 0 },
			size: { width: 100, height: height },
			attrs: { rect: { fill: 'gray','stroke-opacity':0 } ,path:{d:'M0,0 L-50,60 L-40,60 L-40,'+height+' L40,'+height+' L40,60 L50,60 Z'} }
		});
		
		
		var rect = new joint.shapes.basic.Rect({
			position: { x: rectx, y: recty },
			size: { width: 80, height: 20 },
			attrs: { rect: { fill: 'gray' } }
		});
		
		var text1 = new joint.shapes.basic.Rect({
			position: { x: 240, y: 60 },
			size: { width: 80, height: 20 },
			attrs: {  text: { 'font-size': 10,'font-family':'宋体 ,simsun, sans-serif',text: '纵坐标', fill: 'gray','ref-y':14} }
		});
		
		var text2 = new joint.shapes.basic.Rect({
			position: { x: 0, y: recty },
			size: { width: 80, height: 20 },
			attrs: {  text: { 'font-size': 10,'font-family':'宋体, simsun, sans-serif',text: '横坐标', fill: 'gray' ,'ref-y':14} }
		});
		
		var text3 = new joint.shapes.basic.Rect({
			position: { x: 320, y: 0 },
			size: { width: 80, height: 20 },
			attrs: {  text: { 'font-size': 10,'font-family':'宋体 ,simsun, sans-serif',text: '数据区', fill: 'gray','ref-y':14 } }
		});
		
		array.push(arrow_l);
		array.push(arrow_v);
		array.push(rect);
		array.push(text1);
		array.push(text2);
		array.push(text3);
		
		paper.model.addCells(array);
		
		Ext.each(array,function(cell){
			paper.findViewByModel(cell).on('cell:pointerdown', function(e, x, y){
				// u can`t move
				delete paper.sourceView;
				e.preventDefault();
				
			});
			
		});
	
	},
	/**
	 * 
	 */
	createCell : function (uuid,text,x,y){
		var cell = new joint.shapes.basic.Rect({
			id : uuid,
			position: { x: x, y: y },
			size: { width: 80, height: 20 },
			attrs: { rect: { fill: '#fff' },text : {text: text, fill: 'black','ref-y':15} }
		});
		return cell;
	},
	
	computePosition : function (matrixs,mouseInPaper){
//		var position ;
		var cellwidth = matrixs.cellwidth;
		var cellheight = matrixs.cellheight;
		var m = parseInt(mouseInPaper.y/cellheight);
		var n = parseInt(mouseInPaper.x/cellwidth);
		var matrix = matrixs.getCell(m,n);
		return matrix;
	},
	
	  /**
     * 判断数组中是否有改元素
     */
    isContain : function(source ,find,key){
    	if(null == source || source == undefined){
    		return true;
    	}else{
    		for(var i= 0 ;i< source.length;i++){
    			if(source[i].data.defineUuid==find.data.defineUuid){
    				return true;
    			}
    		}
    		return false;
    	}
    	
    },
});


/**
 * cell Event
 */
var CellEvent = {
	
};


/**
 * link Event
 */
var LinkEvent = {};

/**
 * Paper Event
 */
var PaperEvent  = {
		thepointerUp : function($el, x, y){console.log('鼠标抬起')},
		
		thepointerDown : function(evt,x,y){
			var paper = this,
			 	dataFactor      = Ext.getCmp('data-factor'),
			 	dataFactorprop  = Ext.getCmp('data-factorprop'),
			 	dataxFactorprop = Ext.getCmp('datax-factorprop'),
			 	datayFactorprop  = Ext.getCmp('datay-factorprop');

			
			var mouseInPaper = paper.snapToGrid({
    			x : evt.clientX,
    			y :  evt.clientY
    		  });
			
			var position  = Layout.Operate.computePosition(paper.matrixs,mouseInPaper);
			
			
			
	    var records = Layout.DrawController.getSelectRecord(),
	    	record;
        Ext.Array.each(records, function(arr){
        	record = Ext.create('Layout.model.CommonFactorModel',arr.record.data);

         });
        	if(record){
        	
        			var cell = Layout.Operate.createCell(record.getId(),record.getName(),position.x,position.y)
        			
        			Layout.Select.cancelSelect();
        			
        			var factorStore     = dataFactor.getStore();
        			if(!factorStore){
        				 factorStore     = Ext.create('factorStore',new Layout.store.CommonFactorStore());
        			}

        			factorStore.add(record);
        			dataFactor.bindStore(factorStore);
//        			dataFactorprop.bindStore(new Layout.store.CommonPropStore());
					paper.model.addCells([cell]);
        	}
		},
		
		thepointerMove : function($el, x, y){console.log('鼠标移动')}
};

var anywhereEvent  = {
		thepointerUp : function($el, x, y){console.log('鼠标抬起')},
		
		thepointerDown : function(evt,x,y){
			var paper = this,
			dataFactor      = Ext.getCmp('data-factor'),
			dataFactorprop  = Ext.getCmp('data-factorprop'),
			dataxFactorprop = Ext.getCmp('datax-factorprop'),
			datayFactorprop  = Ext.getCmp('datay-factorprop');
			
			
			var mouseInPaper = paper.snapToGrid({
				x : evt.clientX,
				y :  evt.clientY
			});
			
			var matrix  = Layout.Operate.computePosition(paper.matrixs,mouseInPaper),
				center = paper.matrixs.center;
			
			
			var records = Layout.DrawController.getSelectRecord(),
			record;
			Ext.Array.each(records, function(arr){
				record = Ext.create('Layout.model.CommonFactorModel',arr.record.data);
			});
			if(record){
				// the matrix isn't used
				if(matrix.isUsed=='0'){
						Layout.Select.cancelSelect();
						//bind data  for chart 
						if(record.get('createLevel') == '1'){
							var factorStore     = dataFactor.getStore();
							if(factorStore.storeId=='ext-empty-store'){
								factorStore     = Ext.create('Layout.store.CommonFactorStore',{storeId:'factorStore'});
							}
							if(!Layout.Operate.isContain(factorStore.getRange(),record,'defineUuid')){
								factorStore.add(record);
								dataFactor.bindStore(factorStore);
								
	
								var array = new Array()
								Ext.each(factorStore.getRange(),function(record){
									array.push(record.get('uuid'));
								});
								dataFactor.setValue(array);
							
								var cell = Layout.Operate.createCell(record.getId(),record.getName(),matrix.x,matrix.y)
								paper.model.addCells([cell]);
								matrix.isUsed='1';
							}	
							
						}else if(record.get('createLevel') == '2') {
							var factorpropStore     = dataFactorprop.getStore();
							if(factorpropStore.storeId=='ext-empty-store'){
								factorpropStore     = Ext.create('Layout.store.CommonFactorStore',{storeId:'factorpropStore'});
							}
							
							
							if(!Layout.Operate.isContain(factorpropStore.getRange(),record,'defineUuid')){
									
									// if  at  x-axes
									if(center.m === parseInt(matrix.y/matrix.height)){
										var dataxStore     = dataxFactorprop.getStore();
										var xarray = new Array();
										if(dataxStore.storeId=='ext-empty-store'){
											dataxStore     = Ext.create('Layout.store.CommonFactorStore',{storeId:'dataxStore'});
										}
										dataxStore.add(record);
										dataxFactorprop.bindStore(dataxStore);
										Ext.each(dataxStore.getRange(),function(record){
											xarray.push(record.get('defineUuid'));
										});
										
										dataxFactorprop.setValue(xarray);
									
									// if  at  y-axes
									}else if(center.n === parseInt(matrix.x/matrix.width)){
										var datayStore     = datayFactorprop.getStore();
										var yarray = new Array();
										if(datayStore.storeId=='ext-empty-store'){
											datayStore     = Ext.create('Layout.store.CommonFactorStore',{storeId:'datayStore'});
										}
										datayStore.add(record);
										datayFactorprop.bindStore(datayStore);
										
										Ext.each(datayStore.getRange(),function(record){
											yarray.push(record.get('defineUuid'));
										});
										datayFactorprop.setValue(yarray);
									}
									
									//all of property
									factorpropStore.add(record);
									dataFactorprop.bindStore(factorpropStore);
									var array = new Array();
									Ext.each(factorpropStore.getRange(),function(record){
										array.push(record.get('defineUuid'));
									});
									
									dataFactorprop.setValue(array);

									var cell = Layout.Operate.createCell(record.getId(),record.getName(),matrix.x,matrix.y)
									paper.model.addCells([cell]);
									matrix.isUsed='1';
							}	
							
						}else{
							console.log('no this createLevel');
						}
					
				
							
				}
			}
		},
		
		thepointerMove : function($el, x, y){console.log('鼠标移动')}
};