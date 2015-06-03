Ext.define('ValueLabel.view.ValueLabelWindow',{
    extend: 'Ext.Window',
    alias : 'widget.valueLabelWindow',
    
    initComponent : function(){
    	LABEL_WINDOW_ID=this.id;
    	DEFINENAME=this.data.defineName;
    	var winId = this.id;
    	
    	var idPrefix = 'cmpt-valueLabel-'+winId+'_';
    	
    	var xtype = this.data.xtype;
    	
    	
    	this.items = Ext.create('Ext.form.Panel',{
    		id:         idPrefix+'form',
    		layout: 	'absolute',
	        defaultType: 'textfield',
	        border: 	false,
	        width:450,
            height:300,
	        items: [{
		            fieldLabel: '参数组名',
		            fieldWidth: 30,
		            labelWidth:60,
		            width:268,
		            x: 5,
		            y: 10,
		            id:idPrefix+'paramDefine',
		            listeners: {
		                'change': function(fb, v){
		                	if(Ext.getCmp(idPrefix+'paramDefine').getValue()!=null&&Ext.getCmp(idPrefix+'paramDefine').getValue()!=''){
		                		Ext.getCmp(idPrefix+'search').setDisabled(false);
		                	}
		                }
		            }
	            },{
	                fieldLabel: '值',
	                fieldWidth: 10,
	                labelWidth:60,
	                width:268,
	                xtype:xtype,
	                x: 5,
	                y: 40,
	                id:idPrefix+'values',
	                listeners: {
	                    'change': function(fb, v){
	                    	if(Ext.getCmp(idPrefix+'label').getValue()!=null&&Ext.getCmp(idPrefix+'label').getValue()!=''/*&&Ext.getCmp(idPrefix+'values').getValue()!=null&&Ext.getCmp(idPrefix+'values').getValue()!=''*/){
	                    		var sm = Ext.getCmp(idPrefix+'parameterGrids').getSelectionModel();
	    	                	var ur = sm.getSelection();
	    	                	if(ur.length>0){
	    		                	var  labelCha=ur[0].data['label'];
	    		                	var valuesCha =ur[0].data['value'];
	    		                	if(Ext.getCmp(idPrefix+'values').getValue()!=valuesCha||Ext.getCmp(idPrefix+'label').getValue()!=labelCha){
	    		                		Ext.getCmp(idPrefix+'add').enable();
	    		                		Ext.getCmp(idPrefix+'update').enable();
	    		                	}else{
	    		                		Ext.getCmp(idPrefix+'update').disable();
	    		                		Ext.getCmp(idPrefix+'add').disable();
	    		                	}
	    	                	}else{
	    	                		Ext.getCmp(idPrefix+'add').enable();
	    	                	}
	                    	}else{
	                    		Ext.getCmp(idPrefix+'update').disable();
	                    		Ext.getCmp(idPrefix+'add').disable();
	                    	}
	                    }
	                }
	            }, {
		            fieldLabel: '标签',
		            fieldWidth: 30,
		            labelWidth:60,
		            width:268,
		            x: 5,
		            y: 70,
		            id: idPrefix+'label',
		            //anchor: '-5', // anchor width by percentage
		            listeners: {
		                'change': function(fb, v){
		                	if(Ext.getCmp(idPrefix+'label').getValue()!=null&&Ext.getCmp(idPrefix+'label').getValue()!=''/*&&Ext.getCmp(idPrefix+'values').getValue()!=null&&Ext.getCmp(idPrefix+'values').getValue()!=''*/){
		                		var sm = Ext.getCmp(idPrefix+'parameterGrids').getSelectionModel();
			                	var ur = sm.getSelection();
			                	if(ur.length>0){
				                	var  labelCha=ur[0].data[idPrefix+'label'];
				                	var valuesCha =ur[0].data[idPrefix+'value'];
				                	if(Ext.getCmp(idPrefix+'values').getValue()!=valuesCha||Ext.getCmp(idPrefix+'label').getValue()!=labelCha){
				                		Ext.getCmp(idPrefix+'add').enable();
				                		Ext.getCmp(idPrefix+'update').enable();
				                	}else{
				                		Ext.getCmp(idPrefix+'update').disable();
				                		Ext.getCmp(idPrefix+'add').disable();
				                	}
			                	}else{
			                		Ext.getCmp(idPrefix+'add').enable();
			                	}
		                	}else{
		                		Ext.getCmp(idPrefix+'update').disable();
		                		Ext.getCmp(idPrefix+'add').disable();
		                	}
		                	
		                }
		            }
		        },{
		            x:10,
		            y: 125,
		            xtype: 'button',
		            hideLabel: true,
		            text:'添加',
		            action:'add',
		            id:idPrefix+'add',
		            disabled:true,
		            waitMsg: 'Saving Data...',
//		            handler: onParameterAdd
		        },{
		            x:10,
		            y: 160,
		            xtype: 'button',
		            hideLabel: true,
		            text:'修改',
		            action: 'update',
		            id: idPrefix+'update',
		            disabled:true
		        },{
		            x:10,
		            y: 195,
		            xtype: 'button',
		            hideLabel: true,
		            text:'删除',
		            action: 'delete',
		            id: idPrefix+'delete',
		            disabled:true
		        },{
		            x:10,
		            y: 230,
		            xtype: 'button',
		            hideLabel: true,
		            text:'清除',
		            action: 'clear',
		            id: idPrefix+'clear',
		            disabled:true
		        },{
		            x:290,
		            y: 10,
		            xtype: 'button',
		            hideLabel: true,
		            text:'搜索',
		            action: 'search',
		            id: idPrefix+'search',
		            disabled:true
		        }, Ext.create('ValueLabel.view.ParamGrid',{
		        	id:idPrefix+'parameterGrids',
		          	x:70,
		            y: 100,
		            width:204,
		            height:175
		        }),
		        Ext.create('ValueLabel.view.ParamDefineGrid',{
		        	x:290,
		            y: 40,
		            width:125,
		            height:235,
		    		id:idPrefix+'paramDefineGrid'
		        })
		        ]
    	});
    	
    	this.title = "值标签";
    	this.layout = 'fit';
    	this.plain = true;
    	this.buttons = [{
    		action:    'save',
    		id:	idPrefix+'saveBtn',
            text: '确定'
        },{
            text: '取消',
            handler: function(){ Ext.getCmp(winId).close();}
        }];
    	
    	
        this.callParent(arguments);
    }
});