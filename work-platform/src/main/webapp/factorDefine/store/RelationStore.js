Ext.define('Factor.store.RelationStore', {
    extend: 'Ext.data.Store',
    alias : 'widget.relationStore',
    
    model : 'Factor.model.RelationModel',
    
	autoLoad: true,

    proxy: {
        type: 'ajax',
        url : '../../../work-platform/loadRelation.do',
        reader: {
            type: 'json'
        }
    }
});