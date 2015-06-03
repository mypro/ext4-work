Ext.define('Factor.store.RelationPropertyStore', {
    extend: 'Ext.data.Store',
    model : 'Factor.model.RelationPropertyModel',
	autoLoad: false,
	
	proxy: {
        type: 'ajax',
        url : '../../../work-platform/loadRelationProperty.do',
        reader: {
            type: 'json'
        }
    }
});