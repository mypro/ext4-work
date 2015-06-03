Ext.define('Layout.chart.Scatter',{
	extend : 'Layout.chart.CommonChart',
	
	animate: true,
    shadow: true,
    legend: false,
    insetPadding: 60,
    theme: 'Base:gradients',
	 
	initComponent : function(){
		var me = this,
			valueFields = me.valueFields,
			store = me.store;
		
		
		me.axes = [];
		Ext.Array.each(valueFields, function(field,index){
			if(index ==0){
				me.axes.push({
					type: 'Numeric',
					position: 'bottom',
					fields: [field],
					title: field,
					grid: true,
					minimum: 0
					
					});
			}else{
				me.axes.push({
						type: 'Numeric',
						position: 'left',
						fields: [field],
						title: field,
						grid: true,
						minimum: 0
						
						});
			}
		});
//		me.axes =  [{
//			type: 'Numeric',
//			position: 'left',
//			fields: store[valueFields[1]],
//			title: valueFields[1],
//			grid: true,
//			minimum: 0
//			
//		}, {
//			type: 'Numeric',
//			position: 'bottom',
//			fields: store[valueFields[0]],
//			grid: true,
//			title: valueFields[0],
//			minimum: 0
//		}],
		me.series =  [{
			type: 'scatter',
			markerConfig: {
				type: 'cross',
				radius: 3,
				size: 5
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
			yField: valueFields[1]
		}];
		
		
		me.callParent(arguments);
	}
});