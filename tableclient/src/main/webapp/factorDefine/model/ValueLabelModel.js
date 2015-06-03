Ext.define('Factor.model.ValueLabelModel', {
    extend: 'Ext.data.Model',
    fields:[
            {name: 'uuid'},
            {name: 'defineUuid'},
            {name: 'value'},
            {name: 'label'},
            {name: 'seq', type:'number'}
         ],
    idProperty: 'uuid'
});