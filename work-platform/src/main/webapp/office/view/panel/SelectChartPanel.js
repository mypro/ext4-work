Ext.define('Layout.view.panel.SelectChartPanel',{
	extend: 'Ext.panel.Panel',
    alias : 'widget.selchartPanel',
    
    border : true,
    baseCls:'x-plain',
    layout : 'fit',
    defaults: {frame:false},
    
    initComponent : function(){
    	var me = this;
    	
    	
    	
    	me.items = [
    	            { 
    	            	xtype : 'panel',
    	            	id : 'panel1',
    	            	width : 500,
    	            	layout: {
    	            		    type: 'column'
    	            	    },
    	            	items : [{
        	            	xtype :'panel',
        	            	id : 'checked_column',
        	            	title : '柱图',
        	            	items : [
        	            	         {
        	            	        	html :"<img onclick='javasctipt:Layout.SetChartController.showChartPanel(1);' src='office/img/chart-column.gif'></img>",
    	                				width :135,
    	                				height : 130
        	            			}]
                			
        	            	
        	            },{
        	            	id :  'checked_pie',
        	            	title : '饼图',
        	            	items : [{
                				html :"<img onclick='javasctipt:Layout.SetChartController.showChartPanel(2);' src='office/img/chart-pie.gif'></img>",
                				width :135,
                				height : 130
                			}],
    	           			 listeners:{
    	      	        	   'click':Layout.SetChartController.showChartPanel
    	           			 }
        	            },{
        	            	id : 'checked_line',
        	            	title : '折线图',
        	            	items : [{
                				html :"<img onclick='javasctipt:Layout.SetChartController.showChartPanel(3);' src='office/img/chart-line.gif'></img>",
                				width :135,
                				height : 130
                			}]
        	            },{
        	            	id : 'checked_radar',
        	            	title : '雷达图',
        	            	items : [{
                				html :"<img onclick='javasctipt:Layout.SetChartController.showChartPanel(4);' src='office/img/chart-radar.gif'></img>",
                				width :135,
                				height : 130
                			}]
        	            },{
        	            	id :  'checked_stacked',
        	            	title : '构成图',
        	            	items : [{
                				html :"<img onclick='javasctipt:Layout.SetChartController.showChartPanel(5);' src='office/img/chart-stacked.gif'></img>",
                				width :135,
                				height : 130
                			}]
        	            },{
        	            	id : 'checked_scatter',
        	            	title : '散点图',
        	            	items : [{
                				html :"<img onclick='javasctipt:Layout.SetChartController.showChartPanel(6);' src='office/img/chart-scatter.gif'></img>",
                				width :135,
                				height : 130
                			}]
        	            		
        	            },{
        	            	id :  'checked_bubble',
        	            	title : '气泡图',
        	            	items : [{
                				html :"<img onclick='javasctipt:Layout.SetChartController.showChartPanel(7);' src='office/img/chart-bubble.gif'></img>",
                				width :135,
                				height : 130
                			}]
        	            },{
        	            	id : 'checked_pyramid',
        	            	title : '金字塔图',
        	            	items : [{
                				html :"<img onclick='javasctipt:Layout.SetChartController.showChartPanel(8);' src='office/img/chart-pyramid.gif'></img>",
                				width :135,
                				height : 130
                			}]
        	            }]
    	            },{
    	            	xtype : 'datasetPanel',
    	            	id : 'panel2',
    	            	width : 800,
    	            	hidden :true
    	            }];
    	            
    	
    	me.callParent(arguments);
    }
});