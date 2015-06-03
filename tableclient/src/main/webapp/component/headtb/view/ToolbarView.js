Ext.define('Toolbar.view.ToolbarView',{
    extend: 'Ext.toolbar.Toolbar',
    alias : 'widget.toolbarView',
    
    initComponent : function(){
    	var barId = this.id;
    	var idPrefix = 'cmpt-toolbar-'+barId+'_';
    	this.cls='toolbar',
    	this.items =[{
    		action:    'new',
    		id:			idPrefix+'newBtn',
        	text: '新建',
//            iconCls: 'icon-save',
//            handler: onSaveClick
        },{
    		action:    'save',
    		id:			idPrefix+'saveBtn',
        	text: '保存',
//            iconCls: 'icon-save',
//            handler: onSaveClick
        },{
        	action:    'add',
    		id:			idPrefix+'addBtn',
            text: '添加',
//            iconCls: 'icon-add ',
//            handler: onAddClick
        },{
        	action:    'insert',
    		id:			idPrefix+'insertBtn',
            text: '插入',
//            iconCls: 'icon-insert',
//            disabled: true,
//            handler: onItemInsert
        },{
        	action:    'remove',
    		id:			idPrefix+'removeBtn',
        	text: '删除',
//        	iconCls: 'icon-delete',
//        	disabled: true,
//            handler: onItemDel
        },{
        	action:    'import',
    		id:			idPrefix+'importBtn',
        	text: '导入',
//        	iconCls: 'icon-grid',
//            handler: onItemUpload
        },{
        	action:    'export',
    		id:			idPrefix+'exportBtn',
        	text: '导出',
//        	iconCls: 'icon-grid',
//            handler: onItemUpload
        }];
    	this.callParent(arguments);
    }
});