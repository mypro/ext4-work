Ext.define('Layout.chart.Radar',{
	extend : 'Layout.chart.CommonChart',
		
	animate: true,
    shadow: true,
    legend: {
        position: 'right'
    },
    insetPadding: 60,
    theme: 'Base:gradients',
	    
	initComponent : function(){
		var me = this,
			valueFields = me.valueFields;
		
		
		me.axes = [{
            type: 'Radial',
            position: 'radial',
            label: {
                display: true
            }
        }];
		
		me.series = [];
		Ext.Array.each(valueFields, function(field){
			me.series.push(
				{
		            type: 'radar',
		            xField: 'name',
		            yField: field,
		            showInLegend: true,
		            showMarkers: true,
		            markerConfig: {
		                radius: 5,
		                size: 5
		            },
		            tips: {
		                trackMouse: true,
		                width: 100,
		                height: 28,
		                renderer: function(storeItem, item) {
		                    this.setTitle(storeItem.get('name') + ': ' + storeItem.get(field));
		                }
		            },
		            style: {
		                'stroke-width': 2,
		                fill: 'none'
		            }
		        }
			);
		});
		
		
		me.callParent(arguments);
	}
});