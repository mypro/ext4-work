Ext.define('Layout.controller.BaseFactorPropController', {
    extend: 'Ext.app.Controller',
    stores: [
             "CommonFactorStore"
    ],
    models: [
             "CommonFactorModel"   
    ],
    view: [
    ],
    
//    refs : [{  
//        selector: '#factorPropEditGrid',  
//        ref: 'factorPropEditGrid'  
//    }],

    init: function() {
    	this.control({
        	'#baseFactorPropGrid' : {
        		clickFactor: this.clickFactor
            }
        });
    },
    
    clickFactor : function(uuid, grid){
    	$('#'+grid.id+' .x-grid-row-selected').removeClass('x-grid-row-selected');
    	$('#'+grid.id+' tr[data-recordid='+uuid+']').addClass('x-grid-row-selected');
    	
    	grid.up('tabpanel').setActiveTab(0);
    }
});