Ext.define('Layout.chart.Pie',{
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
			valueFields = me.valueFields,
			category    = me.category;
		   if(valueFields && valueFields.length>1){
				me.series = [{
			        type: 'pie',
			        field: 'value',
			        showInLegend: true,
			        donut: false,
			        tips: {
		              trackMouse: true,
		              width: 140,
		              height: 28,
		              renderer: function(storeItem, item) {
		                var total = 0;
		                me.store.each(function(rec) {
		                    total += parseInt(rec.get('value'));
		                });
		                this.setTitle(storeItem.get('name') + ': ' + Math.round(storeItem.get('value') / total * 100) + '%');
		              }
		            },
			        highlight: {
			          segment: {
			            margin: 20
			          }
			        },
			        label: {
			            field: 'name',
			            display: 'rotate',
			            contrast: true,
			            renderer: function(name, el, record, pie, row, display) {
			            	return name+' : '+record.get('value');
			            },
			            font: '12px Arial'
			        }
			    }];
	        }else {
	        	me.series = [{
	    	        type: 'pie',
	    	        field: valueFields,
	    	        showInLegend: true,
	    	        donut: false,
	    	     
	    	        tips: {
	                  trackMouse: true,
	                  width: 200,
	                  height: 28,
	                  renderer: function(storeItem, item) {
	                    var total = 0;
	                    me.store.each(function(rec) {
	                        total += parseInt(rec.get(valueFields));
	                    });
	                    this.setTitle(storeItem.get(category) + ': ' +valueFields+'  '+ Math.round(storeItem.get(valueFields) / total * 100) + '%');
	                  }
	                },
	    	        highlight: {
	    	          segment: {
	    	            margin: 20
	    	          }
	    	        },
	    	        label: {
	    	            field: category,
	    	            display: 'rotate',
	    	            contrast: true,
	    	            renderer: function(name, el, record, pie, row, display) {
	    	            	return name+' : ' +valueFields+'  '+record.get(valueFields);
	    	            },
	    	            font: '12px Arial'
	    	        }
	    	    }];
	        }
		
		
		me.callParent(arguments);
	}
});