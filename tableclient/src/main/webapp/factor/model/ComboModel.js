Ext.define('Factor.model.ComboModel',{
    extend: 'Ext.data.Model',
    fields: [
       {name: 'uuid'},
       {name: 'name'}
    ],
    idProperty: 'uuid'
});