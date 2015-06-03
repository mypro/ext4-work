Ext.define('Layout.controller.AutoDraw', {
    extend: 'Layout.controller.DrawController',
    
    init : function(){
//    	this.control({
//    		'autoDraw' : {
//    			'afterrender' : this.initDrawPaper,
//    			'activate' : this.initAutoDraw
//    		}
//    	});
    },
    
    requestLayout : function(panel, callback){
    	
    	Layout.DataServer.layoutAlgorithm(panel.algType, panel.factorStore.getDatas(),
    									panel.relationStore.getDatas(),
    			function(response){
    				var positions = Ext.decode(response.responseText);
    				
    				callback(positions);
    			}
    	);
    }
    

});