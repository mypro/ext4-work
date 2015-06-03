	var Drr ={};	
	
	Drr = function (paper) {
   		
		var me = this;
		
		this.paper = paper;
		
	  //鼠标按下
		this.paper.on('blank:pointerdown', function(e){
			
			if(me.conditionCallback){
				if(!me.conditionCallback.call(me)){
					return;
				}
			}
			
			var localPoint = this.snapToGrid({ x: e.clientX, y: e.clientY });

			me.startX = localPoint.x;
			me.startY = localPoint.y;
					
						
			me.rect = new joint.shapes.basic.Rect({
						position: { x: me.startX, y: me.startY },
						size: { width: 1, height: 1 },
						attrs: { rect: {  fill: 'white' }, text: { text: 'my box', fill: 'white'} }
			});
			me.rect.toBack();
								
			me.paper.model.addCells([me.rect]);
			me.rectid = me.rect.id;
					  
			me.pressEvent && me.pressEvent.call(me, me.startX, me.startY);
					
		});
			//鼠标抬起
		this.paper.on('blank:pointerup', function(e){
		
						    //矩形存在的时候触发
							if(me.rect != null){
									
									if(typeof(me.rectid) != 'undefined')
									{	
										me.paper.model.getCell(me.rectid).remove();
										me.rect =null;
									
									}
									
									var localPoint = this.snapToGrid({ x: e.clientX, y: e.clientY });
									
									me.dropEvent && me.dropEvent.call(me, me.startX,me.startY,localPoint.x,localPoint.y);
							}
				 });
	
		
		
		  //鼠标移动
		   	  this.paper.on('blank:pointermove', function(e){
					  //矩形存在的时候触
			 	 		if(me.rect != null){
			 	 				var localPoint = this.snapToGrid({ x: e.clientX, y: e.clientY });
							
								var diffXabs = Math.abs(localPoint.x-me.startX);
								var diffYabs = Math.abs(localPoint.y-me.startY);
								
								var diffX = localPoint.x-me.startX;
								var diffY = localPoint.y-me.startY;
								
								if(diffX>=0 ){
										if(diffY>=0){
											me.rect.resize(diffXabs, diffYabs);
										}else{
											
											me.rect.position(me.startX,localPoint.y);
											me.rect.resize(diffXabs, diffYabs);
										}
								}else {
										if(diffY>=0){
											me.rect.position(localPoint.x,me.startY);
											me.rect.resize(diffXabs, diffYabs);
											
										}else{
											me.rect.position(localPoint.x,localPoint.y);
											me.rect.resize(diffXabs, diffYabs);
										}
									}
								
								me.rect.toBack();
								me.rectid = me.rect.id;
								me.moveEvent && me.moveEvent.call(me, me.startX,me.startX,localPoint.x,localPoint.y);
						}
				
				
			  });
		   	  
		   	  
	};