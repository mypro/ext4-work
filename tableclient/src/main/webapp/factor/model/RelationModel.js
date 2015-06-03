Ext.define('Factor.model.RelationModel', {
    extend: 'Ext.data.Model',
    fields:[
            {name: 'uuid'},
            {name: 'factor1Uuid'},
            {name: 'factor2Uuid'},
            {name: 'factor1Name'},
            {name: 'factor2Name'},
            {name: 'seq'}
         ],
    idProperty: 'uuid'
});