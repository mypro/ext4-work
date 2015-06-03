Ext.define('component.headtb.toolbar', {});
Ext.application({
	name : 'Toolbar',
	appFolder : 'component/headtb',
	controllers : [
	               	'ToolbarController'    
	],
	views : [
	        		'ToolbarView'
	],
	launch : function() {
		Toolbar.App = this;
		
		this.idPrefix = 'cmpt-toolbar-'+this.id+'-';
	}
});