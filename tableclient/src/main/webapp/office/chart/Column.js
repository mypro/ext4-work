Ext.define('Layout.chart.Column',{
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
			store = me.store,
			valueFields = me.valueFields,
			category    = me.category,
		    isQuery     = me.isQuery;
		
		if(isQuery){
			me.axes = [];
			Ext.Array.each(valueFields, function(field,index){
				if(index ==0){
					me.axes.push({
							type: 'Category',
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
						label: {
				                renderer: Ext.util.Format.numberRenderer('0,0')
				            },
				         title: '',
				         grid: true,
				         minimum: 0
						
						});
				}
			});
			
			me.series = [{
	            type: 'column',
	            axis: 'left',
	            highlight: true,
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
	            xField: valueFields[0],
	            yField: valueFields[1]
	        }];
		}else {
			me.axes = [{
	            type: 'Numeric',
	            position: 'left',
	            fields: valueFields,
	            label: {
	                renderer: Ext.util.Format.numberRenderer('0,0')
	            },
	            title: '',
	            grid: true,
	            minimum: 0
	        }, {
	            type: 'Category',
	            position: 'bottom',
	            fields: category,
	            title: ''
	        }],
			
			me.series = [{
	            type: 'column',
	            axis: 'left',
	            highlight: true,
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
	            xField: category,
	            yField: valueFields
	        }];
		}
		
		
		
		me.callParent(arguments);
	}
});