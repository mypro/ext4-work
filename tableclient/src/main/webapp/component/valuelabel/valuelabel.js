Ext.define('component.valuelabel.valuelabel', {});
//参数表
var T_PARAM_TABLE='aa473745579144b383df76a4cd47a18b';
var LABEL_WINDOW_ID='';
var DEFINENAME='';
Ext.application({
	name : 'ValueLabel',
	appFolder : 'component/valuelabel',
	controllers : [
	               	'ValueLabelController'    
	],
	views : [
	         		'ParamDefineGrid',
	         		'ParamGrid',
	        		'ValueLabelWindow'
	],
	launch : function() {
		ValueLabel.App = this;
		
		this.idPrefix = 'cmpt-valuelabel-'+this.id+'-';
	}
});