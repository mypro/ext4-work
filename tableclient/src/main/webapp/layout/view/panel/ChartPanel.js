Ext.define('Layout.view.panel.ChartPanel',{
	extend: 'Ext.panel.Panel',
    alias : 'widget.chartPanel',
    
    border : true,
    
    layout: 'fit',
    
    initComponent : function(){
    	var me = this;
    	
    	me.tbar=[{
            text: '生成映射图',
            handler: function() {
      
            	Ext.Ajax.request({
            		url : '../../work-platform/loadFactor.do',
            		success: function(response){
            			var result = response.responseText;
            			var store = new Ext.data.Store({
            				model : 'Layout.model.CommonFactorModel',
            				autoLoad: false,
            		    	data : Ext.decode(result)
            		    });
            			// filter record which datatype is 1
            			store.filterBy(function(record){
            				return 1===parseInt(record.get('dataType'));
            			});
            			me.removeAll();
            			me.add(
            					Ext.create('Ext.chart.Chart', {
            					    xtype: 'chart',
            					    animate: true,
            					    store: store,
            					    shadow: true,
            					    legend: {
            					        position: 'right'
            					    },
            					    insetPadding: 60,
            					    theme: 'Base:gradients',
            					    series: [{
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
        				                    store.each(function(rec) {
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
            					            font: '8px Arial'
            					        }
            					    }]
            					})  
            				);
            		}
            	});
          	
//            	me.add(
//Ext.create('Ext.chart.Chart', {
//    xtype: 'chart',
//    animate: true,
//    store: new Ext.data.Store({
//    	fields: ['name','value'],
//    	data : [
//    	         {name: 'Ed',    value: 1},
//    	         {name: 'Tommy', value: 0},
//    	         {name: 'Aaron', value: 0},
//    	         {name: 'Jamie', value: 0}
//    	     ]
//    }),
//    shadow: true,
//    legend: {
//        position: 'right'
//    },
//    insetPadding: 60,
//    //theme: 'Base:gradients',
//    series: [{
//        type: 'pie',
//        field: 'value',
//        showInLegend: true,
//        donut: false,
//        highlight: {
//          segment: {
//            margin: 20
//          }
//        },
//        label: {
//            field: 'name',
//            display: 'rotate',
//            contrast: true,
//            font: '8px Arial'
//        }
//    }]
//})       
//            	            );
            }
        }];
    	
    	
    	me.callParent(arguments);
    }
});