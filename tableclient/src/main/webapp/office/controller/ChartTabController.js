Ext.define('Layout.controller.ChartTabController', {
    extend: 'Ext.app.Controller',
    
    init : function(){
    	this.control({
        	'#eastpanel' : {
        		'boxready' : this.initDrawPanel
            }
        });
    },
    
    initDrawPanel : function(){
    	this.initPanel();
    },
    
    initPanel : function(){
    
    	var operateTab = Ext.getCmp('operateTab');
    	this.initDrawPaper(operateTab);
    
    },
    
    
    initDrawPaper : function(panel){
		var paper = Layout.Operate.initPaper(panel);
		
		if(panel.paper){
			panel.paper.svg.remove();
		}
		
		paper.uuid = panel.paperUuid;
		panel.paper = paper;
		panel.graph = paper.model;
    },

    
});