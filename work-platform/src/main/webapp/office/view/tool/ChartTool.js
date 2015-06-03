Ext.define('Layout.view.tool.ChartTool',{
	extend: 'Ext.panel.Panel',
    alias : 'widget.chartTool',
    
    layout: 'absolute',
    
    initComponent : function(){
    	var me = this;

    	var items = [{
       		xtype: 'label',
		    text: '映射区域',
		    width:30,
		    style:{
		    	'font-weight':'bold'
		    },
		    hidden: true,
		    x:10,
		    y:10
       	},{
       		xtype: 'combo',
       		id:'combo-factor',
       		multiSelect: true,
	       	queryMode: 'local',
	        displayField: 'name',
	        valueField: 'uuid',
       		fieldLabel: '因子',
       		labelWidth:40,
       		width:200,
       		hidden: true,
       		x:50,
       		y:5
       	},{
       		xtype: 'combo',
       		id:'combo-factorProp',
       		multiSelect: true,
       		queryMode: 'local',
	        displayField: 'name',
	        valueField: 'defineUuid',
       		fieldLabel: '属性',
       		labelWidth:40,
       		width:200,
       		hidden: true,
       		x:50,
       		y:30
       	},{
       		xtype: 'button',
       		id:'selectdata',
       		text:'选择数据集',
       		width:80,
       		hidden: true,
       		x:260,
       		y:5
       	},{
       		xtype: 'button',
       		id : 'chartBtn',
       		text:'选择统计图',
       		width:80,
       		hidden: true,
       		x:260,
       		y:30,
       		menu : [
           	        {text:'柱状', id: 'chart-column'},
           	        {text:'饼图', id: 'chart-pie'},
           	        {text:'折线', id: 'chart-line'},
           	        {text:'雷达', id: 'chart-radar'},
           	        {text:'构成', id: 'chart-stackeBar'},
           	        {text:'散点', id: 'chart-scatter'},
           	        {text:'气泡', id: 'chart-bubble'},
           	        {text:'金字塔', id: 'chart-pyramid'}
           	    ]
       	},{
       		xtype: 'combo',
       		id:'data-factor',
       		multiSelect: true,
       		hidden: true
       	},{
       		xtype: 'combo',
       		id:'data-factorprop',
       		multiSelect: true,
       		hidden: true
       	},{
       		xtype: 'combo',
       		id:'datax-factorprop',
       		multiSelect: true,
       		hidden: true
       	},{
       		xtype: 'combo',
       		id:'datay-factorprop',
       		multiSelect: true,
       		hidden: true
       	},{
       		xtype: 'combo',
       		id:'dataRecords',
       		multiSelect: true,
       		hidden: true
       	}
        ];
    	
    	Ext.apply(me,{
    		items : items
    	});
    	me.callParent(arguments);
    }

});