Ext.define('Project.store.ProjectTreeStore', {
    extend: 'Ext.data.TreeStore',
    alias : 'widget.projectTreeStore',
    
	autoLoad: false,
	
	root : {
            name: '根节点',
            uuid: '0',
            expanded: false
    },
	
    fields: ['uuid','value', 'text'],

    proxy: {
        type: 'ajax',
        url : '../../../work-platform/loadProject.do',
        reader: {
            type: 'json'
        }
    }
});