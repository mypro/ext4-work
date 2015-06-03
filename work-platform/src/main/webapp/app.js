Ext.require('Ext.container.Viewport');
Ext.require('Ext.form.Panel');

Ext.application({
    name: 'AM',
    
    appFolder : 'app',
    
    controllers: [
                  'Users'
              ],
    
	views: [
	          'user.List',
	          'user.Edit'
	      ],
    
    launch: function() {
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [
                {
                	xtype : 'userlist',
                }
            ]
        });
    }
});