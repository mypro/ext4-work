Ext.define('FDW.view.DefinePanel',{
    extend: 'Ext.form.Panel',
    alias : 'widget.factorDefinePanel',
    
    callback : {},
    
    initComponent : function(){
    	var me = this;
    	
    	me.addEvents(
    			'initForm',
                'clickSave',
                'clickCancel'
            );
    	
    	var idPrefix = 'cmpt-factordefine-'+me.id+'_';
    	
    	me.defaultType = 'textfield';
    	me.items = [{
            id : idPrefix+'factor-uuid',
            value : '',
            hidden: true
        },{
            id : idPrefix+'factor-defineUuid',
            value : '',
            hidden: true
        },{
            id :  idPrefix+'factor-dataType',
            xtype : 'numberfield',
            hidden: true
		},{
            id :  idPrefix+'factor-format',
            xtype : 'numberfield',
            hidden: true
		},{
		    fieldLabel: '名称',
		    xtype : 'textfield',
		    id :  idPrefix+'factor-name',
		    allowBlank: false,
		    value: ''
		},{
			fieldLabel: '数据类型',
			xtype : 'triggerfield',
			triggerCls : 'x-form-my-trigger',
			id : idPrefix+'factor-typeShow',
			editable : false,
			value : '数值',
//			onTriggerClick : Factor.App.getController('window.FactorWindowController')
//							.clickDataType
		},{
		    fieldLabel: '宽度',
		    xtype : 'numberfield',
		    id :  idPrefix+'factor-width',
		    allowBlank: true,
		    value: ''
		},{
		    fieldLabel: '小数宽度',
		    xtype : 'numberfield',
		    id :  idPrefix+'factor-decimalWidth',
		    allowBlank: true,
		    value: ''
		},{
		    fieldLabel: '值标签',
		    id :  idPrefix+'factor-valueLabelUuid',
		    xtype : 'triggerfield',
			triggerCls : 'x-form-my-trigger',
		    allowBlank: true,
		    value: '',
	    	editable : false,
//			onTriggerClick : Factor.App.getController('panel.ValueLabelController')
//							.clickValueLable
		}];
    	
    	me.listeners = {
    		'initForm' : FDW.App.getController('DefinePanelController').initForm,
    		'clickSave' : FDW.App.getController('DefinePanelController').clickSave,
    		'clickCancel': function(){this.hide();}
    	};
    	
    	this.callParent(arguments);
    },
    
    getField : function(name){
    	var prefix = FDW.App.getController('DefinePanelController').getPrefix(this);
    	return Ext.getCmp(prefix+'factor-name');
    },
});