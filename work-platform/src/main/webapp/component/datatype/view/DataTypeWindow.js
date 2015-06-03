Ext.define('DataType.view.DataTypeWindow',{
    extend: 'Ext.Window',
    alias : 'widget.dataTypeWindow',
    
    modal : true,
    
 	closeAction : 'hide',
    
    initComponent : function(){
    	var me = this;
    	
    	var winId = this.id;
    	var idPrefix = 'cmpt-datatype-'+winId+'_';
    	
    	this.items = Ext.create('Ext.form.Panel',{
    		id:         idPrefix+'form',
    		layout: 	'absolute',
	        defaultType: 'textfield',
	        border: 	false,
	        width:		400,
	        height:		300,
	        items: [
                {
                	xtype: 			'dataTypeRadio',
                	id:             idPrefix+'typeRadio',
                	idPrefix:       idPrefix
                },
	    		{fieldLabel: '长度',fieldWidth: 10,xtype: 'numberfield',x: 185,y: 65,value:8,id:idPrefix+'width',   name: idPrefix+'width',   labelWidth:35},
//	  		  	{fieldLabel: '字符',fieldWidth: 10,xtype: 'numberfield',x: 185,y: 65,value:8,  id:idPrefix+'char',    name: idPrefix+'width',   labelWidth:35, hidden:true},
	  		  	{fieldLabel: '小数',fieldWidth: 10,xtype: 'numberfield',x: 185,y: 95,value:2,  id:idPrefix+'decimals',name: idPrefix+'decimals',labelWidth:35},
	  		  	{
		  			fieldLabel: 	'日期格式',
	            	xtype: 			'combo',
	            	id:				idPrefix+'date',
	            	editable: 		false,
	                emptyText: 		"请选择...",
	                valueField: 	"abbr",
	                displayField: 	"name",
	                mode: 			'local',
	                x: 				185,
	                y: 				65,
	                labelWidth:		60,
	                store: 			Ext.create('DataType.store.DateFormatStore'),
	                allowBlank: 	false,
	                hidden:			true
		        },
	            {
		        	fieldLabel: 	'美元格式',
	            	xtype: 			'combo',
	            	id:				idPrefix+'dollar',
	            	editable: 		false,
	                emptyText: 		"请选择...",
	                valueField: 	"abbr",
	                displayField: 	"name",
	                mode: 			'local',
	                x: 				185,
	                y: 				125,
	                labelWidth:		60,
	                store: 			Ext.create('DataType.store.DollarFormatStore'),
	                allowBlank: 	false,
	                hidden:			true
		       }]
    	});
    	
    	this.title = "数据类型";
    	this.layout = 'fit';
    	this.plain = true;
    	this.buttons = [{
    		action:    'save',
    		id:			idPrefix+'saveBtn',
            text: 		'确定'
        },{
            text: '取消',
            handler: function(){ Ext.getCmp(winId).close();}
        }];
    	
    	this.listeners = {  
            "show" : function(){
            	// 初始化设置
            	Ext.getCmp(idPrefix+'form').form
            			.findField(idPrefix+'type').setValue(this.data.dataType);
            	Ext.getCmp(idPrefix+'width').setValue(this.data.width);
            	Ext.getCmp(idPrefix+'decimals').setValue(this.data.decimalWidth);
            },
            'close':function(){
 				me.destroy();
 			}
        },  
    	
        this.callParent(arguments);
    }
});