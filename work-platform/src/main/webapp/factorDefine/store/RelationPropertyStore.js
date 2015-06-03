Ext.define('Factor.store.RelationPropertyStore', {
    extend: 'Ext.data.Store',
    alias : 'widget.relationPropertyStore',
    
    model : 'Factor.model.RelationPropertyModel',
    
	autoLoad: false,

    proxy: {
        type: 'ajax',
        url : '../../../work-platform/loadProperty.do',
        reader: {
            type: 'json'
        }
    },
    groupField: 'prototype',
    listeners: {
        load: {
            element: 'el', //bind to the underlying el property on the panel
            fn: function(){ 
            	filterFactorProperty();
            	filterRelationProperty();
            }
        }
    }
});
function filterRelationProperty(){
	var stores =Factor.App.getPanelRelationPropertyControllerController().getRelationPropertyGrid().getStore();
	
	var records = [];
	for(var i=0;i<stores.getCount();i++){
		records.push(stores.getAt(i));
	}
	var selectedPropMap = {};
	Ext.Array.each(records, function(record){
		selectedPropMap[record.get('defineUuid')] = true;
	});
	Ext.Array.each(defaultRelationProp, function(defaultProp, i){
		if(selectedPropMap[defaultProp.defineUuid]){
			return true;
		}
		
		var record = new Factor.model.CommonFactorModel();  
		Ext.apply(record.data, defaultProp);
		record.set('uuid', 'newProp-'+i);   
		
		records.push(record);
	});
	stores.removeAll();
	stores.add(records);
	
	var list=[],j=0;
	var factorPropertystores =Factor.App.getPanelFactorPropertyControllerController().getFactorPropertyGrid().getStore();
	for(var i=0;i<factorPropertystores.getCount();i++){
		var record=factorPropertystores.getAt(i);
		if(0==record.get('prototype')){
			list[j]=record.get('name');
			j++;
		}
	}
	for(var i=0;i<stores.getCount();i++){
		var record=stores.getAt(i);
		if(0==record.get('prototype')){
			list[j]=record.get('name');
			j++;
		}
	}
	var by='text';
//	if(list.length>0)
	Factor.App.getTreeFactorTreeControllerController().getFactorTree().filterByNoInTree(list,by);
}