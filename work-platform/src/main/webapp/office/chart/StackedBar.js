Ext.define('Layout.chart.StackedBar',{
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
            type: 'Numeric',
            position: 'bottom',
            fields: valueFields,
            label: {
                renderer: Ext.util.Format.numberRenderer('0,0')
            },
            title: '',
            grid: true,
            minimum: 0
        }, {
            type: 'Category',
            position: 'left',
            fields: ['name'],
            title: ''
        }],
		
		me.series = [{
            type: 'bar',
            axis: 'left',
            highlight: true,
            stacked: true,
            tips: {
              trackMouse: true,
              width: 140,
              height: 28,
              renderer: function(storeItem, item) {
                this.setTitle(item.value[0]+' '+item.yField+' '+item.value[1]);
              }
            },
            label: {
                display: 'insideEnd',
                field: valueFields,
                renderer: Ext.util.Format.numberRenderer('0'),
                orientation: 'horizontal',
                color: '#333',
                'text-anchor': 'middle'
            },
            xField: 'name',
            yField: valueFields
        }];
		
		
		me.callParent(arguments);
	}
});