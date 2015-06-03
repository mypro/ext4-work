Ext.define('component.datafilter.datafilter', {});
var FORM_ID;
Ext.application({
	name : 'DataFilter',
	appFolder : 'component/datafilter',
	controllers : [
	               	'DataFilterController'    
	],
	views : [
	        		'DataFilterForm',
	        		'ConditionView'
	],
	launch : function() {
		DataFilter.App = this;
		
		this.idPrefix = 'cmpt-datafilter-'+this.id+'-';
	}
});