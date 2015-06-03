  Ext.define('Layout.chart.Bar',{
	extend : 'Layout.chart.CommonChart',
		
	animate: true,
    shadow: true,
    legend: {
        position: 'right'
    },
    insetPadding: 60,
    theme: 'Base:gradients',
	    
	initComponent : function(){
		var me = this;
		
		me.axes = [{
            type: 'Category',
            position: 'left',
            fields: ['name'],
            title: ''
        },{
            type: 'Numeric',
            position: 'bottom',
            fields: ['value'],
            label: {
                renderer: Ext.util.Format.numberRenderer('0,0')
            },
            title: '',
            grid: true,
            minimum: 0
        }, ];
		
		me.series = [{
            type: 'bar',
            axis: 'bottom',
            highlight: true,
            tips: {
              trackMouse: true,
              width: 140,
              height: 28,
              renderer: function(storeItem, item) {
                this.setTitle(storeItem.get('name') + ': ' + storeItem.get('value') + ' views');
              }
            },
            label: {
                display: 'insideEnd',
                field: 'name',
                renderer: Ext.util.Format.numberRenderer('0'),
                orientation: 'horizontal',
                color: '#333',
                'text-anchor': 'middle'
            },
            xField: 'name',
            yField: ['value']
        }];
		
		
		
		me.callParent(arguments);
	}
});