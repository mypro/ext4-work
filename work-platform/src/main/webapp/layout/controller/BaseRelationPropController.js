Ext.define('Layout.controller.BaseRelationPropController', {
    extend: 'Ext.app.Controller',
    stores: [
             "CommonPropStore"
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
        	'#baseRelationPropGrid' : {
        		clickRelation: this.clickRelation
            }
        });
    },
    
    clickRelation : function(uuid, grid){
    	$('#'+grid.id+' .x-grid-row-selected').removeClass('x-grid-row-selected');
    	$('#'+grid.id+' tr[data-recordid='+uuid+']').addClass('x-grid-row-selected');
    	
    	grid.up('tabpanel').setActiveTab(2);
    }
});