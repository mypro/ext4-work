
Ext.define('component.datagrid.datagrid', {});
Ext.application({
	name : 'DataGrid',
	appFolder : 'component/datagrid',
	controllers : [
//	               	'VariableController'    
	],
	views : [
	        		'DataView'
	],
	launch : function() {
		DataGrid.App = this;
		
		this.idPrefix = 'cmpt-datagrid-'+this.id+'-';
	}
});