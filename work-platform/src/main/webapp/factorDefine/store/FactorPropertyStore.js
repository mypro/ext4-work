Ext.define('Factor.store.FactorPropertyStore', {
    extend: 'Ext.data.Store',
    alias : 'widget.factorPropertyStore',
    
    model : 'Factor.model.FactorPropertyModel',
    
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
            fn: filterFactorProperty
        }
    }
});

function filterFactorProperty(){
	var stores =Factor.App.getPanelFactorPropertyControllerController().getFactorPropertyGrid().getStore();

	var records = [];
	for(var i=0;i<stores.getCount();i++){
		records.push(stores.getAt(i));
	}
	var selectedPropMap = {};
	Ext.Array.each(records, function(record){
		selectedPropMap[record.get('defineUuid')] = true;
	});
	Ext.Array.each(defaultFactorProp, function(defaultProp, i){
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