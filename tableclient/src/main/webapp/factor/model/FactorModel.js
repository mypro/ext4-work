Ext.define('Factor.model.FactorModel', {
    extend: 'Ext.data.Model',
    fields:[
            {name: 'uuid'},
            {name: 'name'},
            {name: 'seq'}
         ],
    idProperty: 'uuid'
});