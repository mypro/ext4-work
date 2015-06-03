Ext.define('Layout.chart.Bubble',{
	extend : 'Layout.chart.CommonChart',
	
	animate: true,
    shadow: true,
    legend: false,
    insetPadding: 60,
    theme: 'Base:gradients',
    
    createHandler : function (fieldName) {
         return function (sprite, record, attr, index, store) {
             var fieldValue = 50*record.get('radius')/maxRadius;
             if(fieldValue<5){
            	 fieldValue = 5; 
             } else if(fieldValue >100){
            	 fieldValue = 50;
             }
             var value = index % 8;
             var color = ['rgb(213, 70, 121)', 
                          'rgb(44, 153, 201)', 
                          'rgb(146, 6, 157)', 
                          'rgb(49, 149, 0)', 
                          'rgb(249, 153, 0)',
                          'rgb(0, 0, 0)',
                          'rgb(120, 120, 120)',
                          'rgb(200, 200, 200)'][value];
                     return Ext.apply(attr, {
                         radius: fieldValue,
                         fill: color
                     });
 	 		};
      
	 	},
	

	initComponent : function(){
		var me = this,
			valueFields = me.valueFields,
			store 　　　　　= me.store;
			maxRadius   = me.maxRadius;
		
		me.axes =  [{
			type: 'Numeric',
			position: 'left',
			fields: store[valueFields[1]],
			title: valueFields[1],
			minimum: 0
			
		}, {
			type: 'Numeric',
			position: 'bottom',
			fields: store[valueFields[0]],
			title: valueFields[0],
			minimum: 0
		}];
	
		me.series =  [	{type: 'scatter',
						 label: {
				                display: 'middle',
				                field: ['name'],
				                'text-anchor': 'middle',
				                 contrast: true
				            },
						markerConfig: {
							type: 'circle',
							fill: '#F93',
							radius:10,
							size: 50,
						},tips: {
			                trackMouse: false,
			                width: 150,
			                height: 28,
			                renderer: function(storeItem, item) {
			                    this.setTitle(storeItem.get('name') + ': ' + storeItem.get(valueFields[0]) + ' ' + storeItem.get(valueFields[1]));
			                }
			            },
						axis: 'left',
						xField: valueFields[0],
						yField: valueFields[1],
						renderer: me.createHandler('radius')
							
			}];

			
				
		
		me.callParent(arguments);
	}
});