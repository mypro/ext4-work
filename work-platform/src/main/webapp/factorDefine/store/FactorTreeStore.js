Ext.define('Factor.store.FactorTreeStore', {
    extend: 'Ext.data.TreeStore',
    alias : 'widget.factorTreeStore',
    
//    model : 'Factor.model.FactorModel',
    
	autoLoad: true,
	
	root : {
            name: '根节点',
            uuid: '0',
            expanded: true
    },
	
    fields: ['uuid','name', 'text'],

    proxy: {
        type: 'ajax',
        url : '../../../work-platform/loadFactorDefine.do?condition={prototype:0,createLevel:2}',
        reader: {
            type: 'json'
        }
    }
});