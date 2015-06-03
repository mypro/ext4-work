Ext.define('Factor.model.RelationPropertyModel', {
    extend: 'Ext.data.Model',
    fields:[
            {name: 'uuid'},
            {name: 'relationUuid'},
            {name: 'relationName'},
            {name: 'type'},
            {name: 'name'},
            {name: 'paramDefineUuid'},
            {name: 'paramValueUuid'},
            {name: 'paramValue'},
            {name: 'seq'}
         ],
});