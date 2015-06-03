Ext.define('DataFilter.model.ConditionTreeModel', {
    extend: 'Ext.data.Model',
    requires:[
        'Ext.data.proxy.LocalStorage',
        'Ext.data.proxy.Ajax'
    ],
    fields:['text','name','type','leaf','children']
});
