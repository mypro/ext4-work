Ext.define('Layout.chart.Pyramid',{
	extend : 'Layout.chart.CommonDraw',
	
		title: 'polygon',
		viewBox: false,
		
		initGradient : function () {
			this.gradientId = Ext.id();
 		    this.gradients = [{
 		        id: this.gradientId,
 		        angle: 90,
 		        stops: {
 		            0: {
 		                color: 'rgb(240, 220, 170)'
 		            },
 		            100: {
 		                color: 'rgb(170, 110, 10)'
 		            }
 		        }
 		    }];

 		},
 		//填充颜色
 		 getFill : function () {
 		    return 'url(#' + this.gradientId + ')';
 		},
 		
		initComponent : function(){
				var me = this,
				valueFields = me.valueFields,
				store 　　　　　= me.store
				h0 = me.h0,
				surface = me.surface;
				
				
				
				
				me.initGradient(),
				
				
				
				
				
				me.items = [];
				//宽高比 7:6
				Ext.Array.each(valueFields, function(field,index){
					// nameX nameY 金字塔上文字 坐标        valueX  valueY右侧文字坐标
					var  textX=300,
						 textY=0 ,
						 valueX=0 ,
						 valueY=0 ;
						 path1 ='';
					if(0 == index){
						var x0 = 300-(h0*(index+1)-10)*3/7;
						var y0 = (h0*(index+1)-10);
						var x1 = 300+(h0*(index+1)-10)*3/7;
						var path ='M, 300,0  L '+x0+','+y0+' L '+x1+',' +y0 +' Z';
						textY = y0-20;
						valueX = x1+20;
						valueY = y0-20;
						path1 = 'M, '+x1+','+y0+' Y '+740+','+y0;
					}else {
						var y0=(h0*(index));
						var y1=(h0*(index+1)-10);
						var x0=300-y0*3/7;
						var x1=300+y0*3/7;
						var x2=300+y1*3/7;
						var x3=300-y1*3/7
						var path ='M, '+x0+','+y0+' L '+x1+','+y0+' L '+x2+',' +y1+ ' L '+x3+','+y1+' Z';
						textY = y1-20;	
						valueX = x2+20;
						valueY = y1-20;
						 path1 = 'M, '+x2+','+y1+' Y '+740+','+y1;
				}
					me.items.push(
									{
			  	 						type: 'path',
			  	 						path:  path,
			  	 						fill: me.getFill(),
			  	 						group : 'pyramid'
			  	 	       		   	},{
			  	 						type: 'path',
			  	 						path:  path1,
			  	 						stroke :  'yellow',
			  	 						group : 'pyramid'
			  	 	       		   	}, {  
						                type: 'text',  
						                text: field.name,  
						                'text-anchor' : 'middle',
						                fill: '#FF0',  
						                font: '15px "Arial"',  
						                x: textX,  
						                y: textY 
						            }, {  
						                type: 'text',  
						                text: field.value,  
						                'text-anchor' : 'start',
						                fill: '#000',  
						                font: '14px "Arial"',  
						                x: valueX,  
						                y: valueY  
						            }
			  	 			);
					})
//				surface.add(me.items);
//				var ladder = surface.getGroup('pyramid');
//				ladder.animate({
//				    duration: 1000,
//				    to: {
//				        translate: {
//				            y: 100
//				        }
//				    }
//				});
				
		me.callParent(arguments);
	}

});