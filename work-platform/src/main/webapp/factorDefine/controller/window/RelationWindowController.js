Ext.define('Factor.controller.window.RelationWindowController', 
{
    extend: 'Factor.controller.Base',
    stores: [
             "RelationStore"
    ],
    models: [
    ],
    views: [
    ],
    refs: [{  
        selector: '#relationInfoForm',  
        ref: 'relationInfoForm'  
    },{  
        selector: '#relationWindow',  
        ref: 'relationWindow'  
    },{
    	selector: '#relationGrid',  
        ref: 'relationGrid'
    },{  
        selector: '#factorWindow',  
        ref: 'factorWindow'  
    },{  
        selector: '#relation-uuid',  
        ref: 'relationUuid'  
    },{  
        selector: '#relation-type',  
        ref: 'relationType'  
    },{  
        selector: '#relation-factor1Uuid',  
        ref: 'relationFactor1Uuid'  
    },{  
        selector: '#relation-factor2Uuid',  
        ref: 'relationFactor2Uuid'  
    }],

    init: function() {
    	this.control({
    		'#relationSaveButton' : {
            	click : this.clickSaveRelation
            },
            '#relationCancelButton' : {
            	click : function(){this.getRelationWindow().hide()}
            }
        });
    },
    
    clear : function(){
    	this.getRelationUuid().setValue('');
    	this.getRelationType().setValue(0);
    	this.getRelationFactor1Uuid().setValue('');
    	this.getRelationFactor2Uuid().setValue('');
    },
    
    initForm : function(record){
    	this.getRelationUuid().setValue(record.get('uuid'));
    	this.getRelationType().setValue(0);
    	this.getRelationFactor1Uuid().setValue(record.get('factor1Uuid'));
    	this.getRelationFactor2Uuid().setValue(record.get('factor2Uuid'));
    	this.getRelationFactor1Uuid().setRawValue(record.get('factor1Name'));
    	this.getRelationFactor2Uuid().setRawValue(record.get('factor2Name'));
    },
	
	clickSaveRelation : function(btn){
		if(!btn.up('form').getForm().isValid()){
        	return;
        }
		
		// 因子关系
    	var relationRecord = {};
		var fields = this.getRelationInfoForm().items.items;
		for(var i=0;i<fields.length;i++){
			var field = fields[i];
			var key = field.getId().substring(9,field.getId().length);
			var value = field.getValue();
			relationRecord[key]=value;
		}
		
		if(relationRecord['factor1Uuid'] === relationRecord['factor2Uuid']){
			Ext.Msg.alert('','请选择两个不同因子');
			return;
		}
		
		Ext.Ajax.request({ 
			url: '../work-platform/saveRelation.do',
			params: {
				addRecord : Ext.encode(relationRecord)
			},
			success: function(response, options) {
				var result = Ext.JSON.decode(response.responseText); 
				if(result.duplicate){
					Ext.Msg.alert('','关系重复');
					return;
				}
				
				var me = Factor.App.getController('window.RelationWindowController');
				me.getRelationWindow().hide();
				me.getRelationStoreStore().load();
			}
		});
	}
    
    
});