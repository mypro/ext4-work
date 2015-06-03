Ext.define('Missing.view.MissingWindow',{
    extend: 'Ext.Window',
//    alias : 'widget.missingwindow',
    
    initComponent : function(){
    	
    	var winId = this.id;
    	var idPrefix = 'cmpt-missing-'+winId+'_';
    	
    	this.items = Ext.create('Ext.form.Panel',{
    		id:         idPrefix+'form',
    		layout: 	'absolute',
	        defaultType:'textfield',
	        border: 	false,
	        width: 		260,
	        height:		200,
	        items: [{
	        	x:   	10,
	            y: 		10,
	            xtype:	"radio",
	           name:	"sex",
	           checked: true,
	           boxLabel:"没有缺失值",
	           id:		idPrefix+'radio1',
	           listeners: {
		              click: {
		                  element: 'el', 
		                  fn: function(){
		                	  var radio1 = Ext.getCmp(idPrefix+'radio1');
		                	 if (radio1.getValue()) {
		                		 Ext.getCmp(idPrefix+'lisan').setDisabled(true);
		                		 Ext.getCmp(idPrefix+'fanwei').setDisabled(true);
		                		 Ext.getCmp(idPrefix+'lisanzhi').setDisabled(true);
		                	 }
		                	 
		                  }
		              }
		          }
        	},{
	        	x: 10,
	            y: 30,
	            xtype:"radio",
	           name:"sex",
	           boxLabel:"离散缺失值",
	           id:idPrefix+'radio2',
	           listeners: {
		              click: {
		                  element: 'el', 
		                  fn: function(){
		                	  var radio2 = Ext.getCmp(idPrefix+'radio2');
		                	 if (radio2.getValue()) {
		                		 Ext.getCmp(idPrefix+'lisan').setDisabled(false);
		                		 Ext.getCmp(idPrefix+'fanwei').setDisabled(true);
		                		 Ext.getCmp(idPrefix+'lisanzhi').setDisabled(true);
		                	 }
		                	 
		                  }
		              }
		          }
        	},{
	        	xtype: 'fieldcontainer',
	        	id:idPrefix+'lisan',
	            combineErrors: true,
	            x: 10,
	            y: 60,
	            disabled:true,
	            layout: 'hbox',
	            items: [{
	    				xtype : 'textfield',
	    				width:75
	    			},{
	    				xtype : 'textfield',
	    				width:75
	    			},{
	    				xtype : 'textfield',
	    				width:75
	    			}]
	        },{
	        	x: 10,
	            y: 90,
	            xtype:"radio",
	           name:"sex",
	           boxLabel:"范围加上一个可选离散缺失值",
	           id:idPrefix+'radio3',
	           listeners: {
		              click: {
		                  element: 'el', 
		                  fn: function(){
		                	  var radio3 = Ext.getCmp(idPrefix+'radio3');
		                	 if (radio3.getValue()) {
		                		 Ext.getCmp(idPrefix+'lisan').setDisabled(true);
		                		 Ext.getCmp(idPrefix+'fanwei').setDisabled(false);
		                		 Ext.getCmp(idPrefix+'lisanzhi').setDisabled(false);
		                	 }
		                	 
		                  }
		              }
		          }
        	},{
	        	xtype: 'fieldcontainer',
	        	id:idPrefix+'fanwei',
	            combineErrors: true,
	            x: 10,
	            disabled:true,
	            y: 120,
	            layout: 'hbox',
	            items: [{
	            		fieldLabel: "低",
	            		labelWidth:15,
	    				xtype : 'textfield',
	    				width:75
	    			},{
	    				fieldLabel: "高",
	            		labelWidth:15,
	    				xtype : 'textfield',
	    				width:75
	    			}]
	        },{
				fieldLabel: "离散值",
        		labelWidth:45,
        		id:idPrefix+'lisanzhi',
        		disabled:true,
        		x: 10,
	            y: 150,
				xtype : 'textfield',
				width:125
			}]
    	});
    	
    	this.title = "缺失值";
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
    	
//    	this.listeners = {  
//            "show" : function(){
//            	// 初始化设置
//            	Ext.getCmp(idPrefix+'form').form
//            			.findField(idPrefix+'type').setValue(this.data.dataType);
//            	Ext.getCmp(idPrefix+'width').setValue(this.data.width);
//            	Ext.getCmp(idPrefix+'decimals').setValue(this.data.decimalWidth);
//            }
//        },  
    	
        this.callParent(arguments);
    }
});