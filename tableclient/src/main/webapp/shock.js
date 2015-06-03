if (typeof exports === 'object') {

    var joint = {
        util: require('../src/core').util,
        shapes: {},
        dia: {
            Element: require('../src/joint.dia.element').Element,
            Link: require('../src/joint.dia.link').Link
        }
    };
}

joint.shapes.org = {};

joint.shapes.org.Rect = joint.dia.Element.extend({

    markup: '<g class="rotatable"><g class="scalable"><rect class="card"/></g><text class="name"/></g>',

    defaults: joint.util.deepSupplement({

        type: 'org.Rect',
        
        attrs: {

            rect: { width: 170, height: 40 },

            '.card': {
                fill: '#FFFFFF', stroke: '#000000', 'stroke-width': 2,
                'pointer-events': 'visiblePainted'
            },

            '.name': {
                'font-weight': 'bold',
                ref: '.card', 'ref-x': 0.9, 'ref-y': 0.6,
                'font-family': 'Courier New', 'font-size': 14,
		'text-anchor': 'end'
            }
        }
    }, joint.dia.Element.prototype.defaults)
});

joint.shapes.org.Circle = joint.dia.Element.extend({

    markup: '<g class=""><g class=""><circle class="card"/></g><text class="name"/></g>',

    defaults: joint.util.deepSupplement({

        type: 'org.Circle',
        attrs: {
			
            '.card': {
                fill: '#FFFFFF', stroke: '#000000', 'stroke-width': 2,
                'pointer-events': 'visiblePainted'
            },

            '.name': {
                'font-weight': 'bold',
                ref: '.card', 'ref-x': 0.9, 'ref-y': 0.5,
                'font-family': 'Courier New', 'font-size': 14,
		    'text-anchor': 'end'
            }
        }
    }, joint.dia.Element.prototype.defaults)
});

joint.shapes.org.Tree = joint.dia.Element.extend({

    markup: '<g class="rotatable"><g class="scalable"><rect class="card"/></g><text class="rank"/><text class="name"/></g>',

    defaults: joint.util.deepSupplement({

        type: 'org.Tree',
         size: { width: 180, height: 40 },
         attrs: {

            rect: { width: 170, height: 40 },

            '.card': {
                fill: '#FFFFFF', stroke: '#000000', 'stroke-width': 2,
                'pointer-events': 'visiblePainted', rx: 10, ry: 10
            },

            '.name': {
                'font-weight': 'bold',
                ref: '.card', 'ref-x': 0.9, 'ref-y': 0.5,
                'font-family': 'Courier New', 'font-size': 14,
		'text-anchor': 'end'
            }
        }
    }, joint.dia.Element.prototype.defaults)
});
joint.shapes.org.Arrow = joint.dia.Link.extend({

    defaults: {
        type: 'org.Arrow',
        source: { selector: '.card' }, target: { selector: '.card' },
        attrs: { '.connection': { stroke: '#585858', 'stroke-width': 3 },'.marker-target': { fill: 'red', d: 'M 10 0 L 0 5 L 10 10 z' }},
        z: -1
    }
});


if (typeof exports === 'object') {

    module.exports = joint.shapes.org;
}


/********************************/

var Frame =  function (){
		
		this.graph = new joint.dia.Graph;

		this.graphpaper = new joint.dia.Paper({
			el: $('#paper'),
			width: 5000,
			height: 3000,
			gridSize: 1,
			model: this.graph,
			perpendicularLinks: true
});
		
		}


Frame.prototype.rect = function(x, y,  name, width,height, background, border) {

    var cell = new joint.shapes.org.Rect({
        position: { x: x, y: y },
		size: { width: width, height: height },
        attrs: {
             '.card': { fill: background, stroke: border},
             '.name': { text: name }
        }
    });
    this.graph.addCell(cell);
    return cell;
};



//创建节点
Frame.prototype.circle = function(x, y,  name,  background, border) {

    var cell = new joint.shapes.org.Circle({
        position : {x : x, y : y},
        attrs: {
			
			 circle : {cx:x,cy:y,r:40},
             '.card': { fill: background, stroke: border} ,    
             '.name': { text: name }
        }
    });
   this.graph.addCell(cell);
    return cell;
};

Frame.prototype.link=function (source, target) {

    var cell = new joint.shapes.org.Arrow({
        source: { id: source.id },
        target: { id: target.id }//,
       // vertices: breakpoints
    });
   	this.graph.addCell(cell);
    return cell;
}

  // obj Frame对象  data json数据
 // x,y 是起始坐标（root节点的坐标  x=期望展现x坐标减去第一个节点宽度）。  width 宽度，height 最小高度  background 背景色   border 边框

function render1(obj,data,x,y,width,height,background,border){
		height =0;
		if(data && data.child.length>0){
				for(var i=0;i<data.child.length;i++){
					height += render1(obj,data.child[i],x+width,y+height,width,height,background,border);
				}
			
		}else {
				height = 40;
		}
		if(data.name!='root'){
			var mem = obj.rect(x,y,data.name,width,height,background,border);
			}
	    
		return height;
	}
	
	function render2(obj,data,x,y,width,height,background,border){
		
		width =0;
		if(data && data.child.length>0){
				for(var i=0;i<data.child.length;i++){
					width += render2(obj,data.child[i],x+width,y+height,width,height,background,border);
				}
			
		}else {
				width = 40;
		}
		if(data.name!='root'){
		 var mem = obj.rect(x,y,data.name,width,height,background,border);
		}
		return width;
	}


//obj frame对象  father 父节点   												
function render3 (obj,father,data,x,y,width,height,background,border){
	  

		var jsondata = data.child;
	  
		if(jsondata){
					if (jsondata.length>0){
						var offsetx = x;
						
							for(var i=0;i<jsondata.length;i++){
									  	
										var child = obj.rect(x, y, jsondata[i].name, width,height,background,border);
										
										if(father != '' ){
												
												obj.link(father,  child);
										}
										x= x+250;
												
										if (jsondata[i].child.length>0){
											  
											 offsetx =   render3(obj,child,jsondata[i],offsetx,y+200,width,height,background,border);	
										}
										
							}
				
					}
			
			}
			return x;
}
function render4 (obj,father,data,x,y,width,height,background,border){
	  
	  	 var skewing =0;
		 var childEl =''  ;  
			   if(data.name!='root'){
				  childEl = obj.circle(x,y,data.name,background,border);
				}
			
				if(father != '' ){
									obj.link(father, childEl);
								}
			
			if(data && data.child.length>0){
				for(var i=0;i<data.child.length;i++){
					skewing += render4(obj,childEl,data.child[i],x+skewing,y+height,width,height,background,border);
				}
			
			}else {
					skewing = 40;
			}
			
		if(data.name!='root'){
			childEl.translate(skewing,0);
		}
		
		return skewing;
}

function render5 (obj,father,data,x,y,width,height,background,border){
	  
	  	 var skewing =0;
		 var childEl =''  ;  
			   if(data.name!='root'){
				  childEl = obj.circle(x,y,data.name,background,border);
						
						obj.graphpaper.findViewByModel(childEl).on('cell:dblclick', function($el, x, y){
								var paper = this.paper;
								//var view = paper.findView($el.target);
								var factorUuid = this.model.id;
								link2parent(factorUuid,x,y,paper);
							});
				}
			
				if(father != '' ){
									obj.link(father, childEl);
								}
			
			if(data && data.child.length>0){
				for(var i=0;i<data.child.length;i++){
					var h = y+height+Math.floor(Math.random()*200);
					skewing += render5(obj,childEl,data.child[i],x+skewing,h,width,height,background,border);
				}
			
			}else {
					skewing = 40;
			}
			
		if(data.name!='root'){
			childEl.translate(skewing,0);
		}
		
		return skewing+Math.floor(Math.random()*50);
}

function link2parent(factorUuid,x,y,paper){

			var data1 =  [  {name:'金',  background:'#F1C40F',border:'gray',child:[]},
							{name:'木',  background:'#F1C40F',border:'gray',child:[]},
							{name:'水',  background:'#F1C40F',border:'gray',child:[]},
							{name:'火',  background:'#F1C40F',border:'gray',child:[]}
						];
																		
					for(var i=0;i<data1.length;i++){
					  	
						
						  	var circle = new joint.shapes.org.Circle({
										position: { x:x+100*(i+1), y: y-100 },
										
										attrs: { circle : { r:40}, 
												 '.card': { fill: data1[i].background, stroke: data1[i].border} ,
										  		 '.name': { text: data1[i].name } }
											});
							 var link1 = new joint.dia.Link({
								source: { id: factorUuid },
								target: { id: circle.id },
								attrs: {'.connection': { stroke: 'blue' },'.marker-target': { fill: 'red', d: 'M 10 0 L 0 5 L 10 10 z' }}
							});	
							paper.model.addCells([circle,link1]);
					}
				
			
}