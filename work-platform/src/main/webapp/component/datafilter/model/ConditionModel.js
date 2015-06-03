Ext.define('DataFilter.model.ConditionModel',{
    extend: 'Ext.data.Model',
    fields: [
       {name: 'uuid'},
       {name: 'seq',type:'int'},
       {name: 'leftbracket'},
       {name: 'columnKeyword'},
       {name: 'operator'},
       {name: 'columnValue'},
       {name: 'rightbracket'},
       {name: 'logical'}
    ],
    idProperty: 'uuid'
});