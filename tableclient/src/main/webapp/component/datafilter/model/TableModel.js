Ext.define('DataFilter.model.TableModel',{
    extend: 'Ext.data.Model',
    fields: [
       {name: 'uuid'},
       {name: 'name'},
       {name: 'keyword'},
       {name: 'type'}
    ],
    idProperty: 'uuid'
});