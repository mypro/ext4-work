Ext.define('Layout.controller.ShapeController', {
    extend: 'Ext.app.Controller',
    
    refs : [{
    	selector : '#westArea',
    	ref: 'westArea'
    },{
    	selector : '#northArea',
    	ref: 'northArea'
    }],
    
    init: function() {
    	this.control({
    	});
    },
    
    drapFactorFromShape : function(target, e){
    	var me = Layout.ShapeController,
			x = e.xy[0]-(Ext.getCmp('westArea').getCollapsed()?25:Ext.getCmp('westArea').width),
			y = e.xy[1]-me.getNorthArea().height-HEIGHT_CENTERTAB,
			scale = Ext.getCmp('scale').value;
			
    	// 滚动条
        x += $('#'+target.id+'-body').scrollLeft();
        y += $('#'+target.id+'-body').scrollTop();
        
		// scale
        if(Ext.isNumber(scale) && 0!==scale){
        	scale /= 100;
        	x /= scale;
        	y /= scale;
        }
        
        Layout.Draw.createNewFactor(this.value, x, y);
        
//		factor = Layout.DefaultDefine.createFactor(this.value, x, y);
//		
//		if(ES.factorStore.findRecordByKey('name', factor.get('name'))){
//			console.log('factor name duplicate!');
//			return;
//		}
//		
//		// set XY
//		drawController.eachPanel(function(panel){
//			factor.setXY(panel.paperUuid, x, y);
//		});
//		
//		drawController.addFactor(factor);
    }
});