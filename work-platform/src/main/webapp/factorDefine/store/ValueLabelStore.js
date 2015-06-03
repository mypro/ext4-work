Ext.define('Factor.store.ValueLabelStore', {
    extend: 'Ext.data.Store',
    alias : 'widget.valueLabelStore',
    
    model : 'Factor.model.ValueLabelModel',
    
	autoLoad: false,

    proxy: {
        type: 'ajax',
        url : '../../../work-platform/loadValueLabel.do',
        reader: {
            type: 'json'
        }
    }
});