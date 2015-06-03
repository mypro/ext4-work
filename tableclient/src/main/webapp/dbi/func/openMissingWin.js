/**
 * 选择变量类型时，通过该方法打开小窗口
 */
function openMissingWin(){
	if(Ext.getCmp('missingWin')!=null){
		Ext.getCmp('missingWin').close();
	} 
	var aligns = Ext.create('Ext.data.Store', {
        fields: ['abbr', 'name'],
        data : [
                {"abbr":"varchar", "name":"dd-mmmm-yyyy"},
                {"abbr":"int", "name":"dd-mmmm-yy"},
                {"abbr":"float", "name":"mm/dd/yyyy"},
                {"abbr":"float", "name":"mm/dd/yy"},
                {"abbr":"float", "name":"dd/mm/yyyy"},
                {"abbr":"float", "name":"dd/mm/yy"},
                {"abbr":"float", "name":"yyyy/mm/dd"},
                {"abbr":"float", "name":"yy/mm/dd"},
                {"abbr":"float", "name":"yyddd"},
                {"abbr":"float", "name":"yyyyddd"}
            ]
    });
	 var datatypeform = Ext.create('Ext.form.Panel', {
	        layout: 'absolute',
	        defaultType: 'textfield',
	        border: false,
	        width:260,
	        height:200,
	        items: [{
	        	x: 10,
	            y: 10,
	            xtype:"radio",
	           name:"sex",
	           checked: true,
	           boxLabel:"没有缺失值",
	           id:'radio1',
	           listeners: {
		              click: {
		                  element: 'el', 
		                  fn: function(){
		                	  var radio1 = Ext.getCmp('radio1');
		                	 if (radio1.getValue()) {
		                		 Ext.getCmp('lisan').setDisabled(true);
		                		 Ext.getCmp('fanwei').setDisabled(true);
		                		 Ext.getCmp('lisanzhi').setDisabled(true);
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
	           id:'radio2',
	           listeners: {
		              click: {
		                  element: 'el', 
		                  fn: function(){
		                	  var radio2 = Ext.getCmp('radio2');
		                	 if (radio2.getValue()) {
		                		 Ext.getCmp('lisan').setDisabled(false);
		                		 Ext.getCmp('fanwei').setDisabled(true);
		                		 Ext.getCmp('lisanzhi').setDisabled(true);
		                	 }
		                	 
		                  }
		              }
		          }
        	},{
	        	xtype: 'fieldcontainer',
	        	id:'lisan',
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
	           id:'radio3',
	           listeners: {
		              click: {
		                  element: 'el', 
		                  fn: function(){
		                	  var radio3 = Ext.getCmp('radio3');
		                	 if (radio3.getValue()) {
		                		 Ext.getCmp('lisan').setDisabled(true);
		                		 Ext.getCmp('fanwei').setDisabled(false);
		                		 Ext.getCmp('lisanzhi').setDisabled(false);
		                	 }
		                	 
		                  }
		              }
		          }
        	},{
	        	xtype: 'fieldcontainer',
	        	id:'fanwei',
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
        		id:'lisanzhi',
        		disabled:true,
        		x: 10,
	            y: 150,
				xtype : 'textfield',
				width:125
			}
	        ]
	    });

	    var win = Ext.create('Ext.window.Window', {
	    	id:'missingWin',
	        autoShow: true,
	        title: '变量类型',
	        autoWidth: true,
	       autoHeight: true,
	        /*minWidth: 400,
	        minHeight: 200,*/
	        layout: 'fit',
	        plain:true,
	        items: datatypeform,
	        buttons: [{
	            text: '确定',
	            handler: onMissingSelect
	        },{
	            text: '取消',
	            handler: onMissingCancle
	        },{
	            text: '帮助'/*,
	            handler: onDatatypeCancle*/
	        }]
	    });
}
//选择字段数据类型，并反写到grid
function onMissingSelect(){
	/*var datatype=Ext.getCmp('datatypeRadio').lastValue['rb'];
	var width=Ext.getCmp('width').value;
	var decimals=Ext.getCmp('decimals').value;
	
	var blparameter= Ext.getCmp('BLSTgrid').getSelectionModel();
	var selectRecord = blparameter.getSelection();
	selectRecord[0].data['datatype']=datatype;
	selectRecord[0].data['width']=width;
	selectRecord[0].data['decimals']=decimals;
	blparameter.selectionStart.set('type',datatype+"asd");
	blparameter.selectionStart.set('type',datatype);
	blparameter.selectionStart.set('width',width+"");
	blparameter.selectionStart.set('width',width);
	blparameter.selectionStart.set('decimals',decimals);*/
	
	Ext.getCmp('missingWin').close();
	/*var plug = BLSTgrid.getPlugin();
    plug.startEdit(selectRecord[0].index, 2);*/
}
//取消选择，
function onMissingCancle(){
	Ext.getCmp('missingWin').close();
}
