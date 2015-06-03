//矩阵集合
var Matrixs ={};	
Matrixs = function (paper,cellwidth,cellheight) {
   		console.log(paper,cellwidth,cellheight);
   			var me = this;
			me.paper = paper,
			me.cellwidth=cellwidth,
			me.cellheight=cellheight,
			me.crosswise = parseInt(paper.options.width/me.cellwidth),
			me.verticalSize = parseInt(paper.options.height/me.cellheight);
			//调用是时候再init 适用于不同的参数情况
//			me.array = me.initArray(me.crosswise,me.verticalSize,me.cellwidth,me.cellheight);
   			me.center = {m:parseInt(me.verticalSize/2),n:parseInt(me.crosswise/2)};
   			
   			me.getCell = function (m,n){
   				var cell = me.array[m][n];
   				return cell;
   			}
};		

	
//	Matrixs.prototype.initArray = function(crosswise,verticalSize,cellwidth,cellheight){
//		var me = this;
//  			var array  = new Array();
//  		
//  			if(crosswise >0 && verticalSize>0){
//  				for(var i=0;i<verticalSize;i++){
//					var array_x = new Array();
//  					for(var j=0;j<crosswise;j++){
//						var cell = new Cell(j*cellwidth,i*cellheight,cellwidth,cellheight)
//  						array_x.push(cell);
//					}
//  				array.push(array_x);
//  				}
//  			}
//  			me.array = array;
//	}
	
	Matrixs.prototype.getCell = function (m,n){
			var cell = this.array[m][n];
				return cell;
			}

	Matrixs.prototype.setCell = function (m,n,obj){
			this.array[m][n]= obj;
			
			
	}
//矩阵中的每个小格元素	
	var Cell ={};
	Cell = function(x,y,width,height){
			var cell = {};
			cell.x = x,
			cell.y = y,
			cell.area = width*height,
			cell.width=width,
			cell.height=height,
			cell.isUsed = 0,
			cell.factorid='',
			cell.isCenter=0;
			
			
			
			return cell;
		}
