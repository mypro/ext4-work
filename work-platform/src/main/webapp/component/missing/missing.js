Ext.define('component.missing.missing', {});
Ext.application({
	name : 'Missing',
	appFolder : 'component/missing',
	controllers : [
//	               	'ValueLabelController'    
	],
	views : [
	        		'MissingWindow'
	],
	launch : function() {
		Missing.App = this;
		
		this.idPrefix = 'cmpt-missing-'+this.id+'-';
	}
});