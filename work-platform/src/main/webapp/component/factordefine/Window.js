Ext.define('component.factordefine.Window', {});

Ext.application({
	name : 'FDW',
	appFolder : 'component/factordefine',
	controllers : [
	          'DefineWindowController',
	          'DefinePanelController'
	],
	views : [
	         'DefineWindow',
	         'DefinePanel',
	         'DefineGrid'
	],
	launch : function() {
		FDW.App = this;
	}
});