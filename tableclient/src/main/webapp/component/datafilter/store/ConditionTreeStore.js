Ext.define('DataFilter.store.ConditionTreeStore', {
    extend: 'Ext.data.TreeStore',
    alias : 'widget.conditionTreeStore',
    
    model : 'DataFilter.model.ConditionTreeModel',
    
	autoLoad: false,
	
	root : {
			text:'和关系',
            name: '和关系',
            type:'',
            leaf:false,
            expanded: true
    },
	
//    fields: ['uuid','name', 'text'],

    proxy: {
        type: 'ajax',
        url : '../../../work-platform/loadCondition.do',
        reader: {
            type: 'json'
        }
    }
});