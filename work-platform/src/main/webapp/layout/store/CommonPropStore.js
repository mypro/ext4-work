Ext.define('Layout.store.CommonPropStore', {
    extend: 'Layout.store.CommonFactorStore',
    
	autoLoad: false,

    setX : function(x){
    	var recordX = this.findRecordByKey('defineUuid', FACTORDEFINE_FACTOR_X);
    	if(recordX){
    		recordX.set('value', x);
    	}
    },
    
    setY : function(y){
    	var recordY = this.findRecordByKey('defineUuid', FACTORDEFINE_FACTOR_Y);
    	if(recordY){
    		recordY.set('value', y);
    	}
    }
    
});