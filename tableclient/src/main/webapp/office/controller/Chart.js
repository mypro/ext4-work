Ext.define('Layout.controller.Chart', {
    extend: 'Ext.app.Controller',
    refs :[{
		    	selector : '#chartPanel',
		    	ref: 'chartPanel'
		    }],
		    
    init : function(){
    	this.control({
//	    	'#eastpanel' : {
//	    		'afterrender' : function(){
//	    			$('#eastpanel_header_hd').bind('dblclick', function(){
//	    				var p = Ext.getCmp('eastpanel');
//	    				var d = Ext.getCmp('eastpanel');
//	    				
//	    				//原来修改宽度的事件改成双击展开
//	    				if(p){
//	    					p.collapse(Ext.Component.DIRECTION_RIGHT,true);
//	    				}
//	    				
//	    			});
//	    		}
//	    	}
    	});
    },
   


});
