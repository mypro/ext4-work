Ext.define('Factor.view.window.RelationWindow',{
    extend: 'Ext.Window',
    alias : 'widget.relationWindow',
    
    store : "FactorStore",
    
    initComponent : function(){
    	
    	this.title = '编辑因子关系';
     	this.width = 270;
     	this.height = 140;
     	this.plain = true;
     	this.modal = true;
     	this.closeAction = 'hide';
     	this.layout = 'column';
        this.defaults = {
            anchor: '100%'
        };
     	this.listeners = {
     			'close':function(){
         			this.hide();
     			}
     	};
     	
     	this.items = [{
	        xtype: 'form',
	        id: 'relationInfoForm',
	        bodyStyle:'padding:5px 5px 5px 5px;',  
            labelWidth :60, 
            width :250,
	        height: 100,
            border:false,  
            defaults: {anchor : "100%"},  
	        items : [{
	        		xtype : 'textfield',
				    name: 'relation-uuid',
				    id : 'relation-uuid',
				    value : '',
				    hidden: true
				},{
	        		xtype : 'numberfield',
				    name: 'relation-type',
				    id : 'relation-type',
				    value : 0,
				    hidden: true
				},{
					xtype : 'combo',
					name : 'relation-factor1Uuid',
					id : 'relation-factor1Uuid',
					fieldLabel: '因子一',
					store : this.store,
					valueField : "uuid",
					displayField : "name",
					mode : 'remote',
					triggerAction : 'all',
					listeners : {
					},
					allowBlank : false,
					editable : false,
					width : 180
				},{
					xtype : 'combo',
					name : 'relation-factor2Uuid',
					id : 'relation-factor2Uuid',
					fieldLabel: '因子二',
					store : this.store,
					valueField : "uuid",
					displayField : "name",
					mode : 'remote',
					triggerAction : 'all',
					listeners : {
					},
					allowBlank : false,
					editable : false,
					width : 180
				}
	        ],
	        buttons: [{
	            text: '保存',
	            id : 'relationSaveButton',
	            height : 23
			},{
	            text: '取消',
	            id : 'relationCancelButton',
	            height : 23
			}]
        }];
     		
        this.callParent(arguments);
    }
});