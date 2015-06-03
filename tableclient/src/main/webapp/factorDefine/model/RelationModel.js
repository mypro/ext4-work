Ext.define('Factor.model.RelationModel', {
    extend: 'Ext.data.Model',
    mixins :['Factor.model.CommonFunction'],
    fields:[
            {name: 'uuid'},
            {name: 'factor1Uuid'},
            {name: 'factor2Uuid'},
            {name: 'factor1Name'},
            {name: 'factor2Name'},
            {name: 'type', type:'number'},
            {name: 'seq', type:'number'},
            {name: 'childs'}
         ],
    idProperty: 'uuid',
    
    getColor : function(){
    	var colorProp = this.getProperty(FACTORDEFINE_RELATION_COLOR);
    	if(colorProp){
    		var val = parseInt(colorProp.value, 16).toString(16);
    		if(isNaN(parseInt(val,16))){
    			return '#000000';
    		}
    		for(var i=val.length;i<6;i++){
    			val='0'+val;
    		}
    		return '#'+val;
    	}
    	return '#000000';
    },
    
    getShape : function(){
    	var shapeProp = this.getProperty(FACTORDEFINE_RELATION_SHAPE);
    	if(shapeProp){
    		return parseInt(shapeProp.value);
    	}
    	return 1;
    }
    
});