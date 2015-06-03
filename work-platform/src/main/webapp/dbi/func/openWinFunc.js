/**
 * 选择变量类型时，通过该方法打开小窗口
 */
function openDataTypeWin(){
	if(Ext.getCmp('datatypeWin')!=null){
		Ext.getCmp('datatypeWin').close();
	} 
	var aligns = Ext.create('Ext.data.Store', {
        fields: ['abbr', 'name'],
        data : [
                {"abbr":COLUMNTYPE_DATE_1, "name":"d/m/y"},
                {"abbr":COLUMNTYPE_DATE_2, "name":"d-m-y"},
                {"abbr":COLUMNTYPE_DATE_3, "name":"Y-m-d H:i:s"},
                {"abbr":COLUMNTYPE_DATE_4, "name":"mm/dd/yy"},
                {"abbr":COLUMNTYPE_DATE_5, "name":"dd/mm/yyyy"},
                {"abbr":"float", "name":"dd/mm/yy"},
                {"abbr":"float", "name":"yyyy/mm/dd"},
                {"abbr":"float", "name":"yy/mm/dd"},
                {"abbr":"float", "name":"yyddd"},
                {"abbr":"float", "name":"yyyyddd"}
            ]
    });
	var dollar = Ext.create('Ext.data.Store', {
        fields: ['abbr', 'name'],
        data : [
                {"abbr":1, "name":"$#"},
                {"abbr":2, "name":"$##"},
                {"abbr":3, "name":"$###"},
                {"abbr":4, "name":"$###.##"},
                {"abbr":5, "name":"$#,###"},
                {"abbr":6, "name":"$#,###.##"},
                {"abbr":7, "name":"$###,###"},
                {"abbr":8, "name":"$###,###.##"},
                {"abbr":9, "name":"$###,###,###.##"},
                {"abbr":10, "name":"$###,###,###,###"}
            ]
    });
	 var datatypeform = Ext.create('Ext.form.Panel', {
	        layout: 'absolute',
	        defaultType: 'textfield',
	        border: false,
	        width:400,
	        height:300,
	        items: [{
		        		xtype: 'radiogroup',
		        		id:'datatypeRadio',
		                //fieldLabel: 'Two Columns',
		                columns: 1,
		                x:5,
		                y:0,
		                layout: 'vbox',
	//	                vertical: true,
		                items: [{boxLabel: '数值(N)', name: 'rb', inputValue: COLUMNTYPE_DECIMAL, checked: true},
		                        {boxLabel: '逗号(C)',name: 'rb',inputValue: COLUMNTYPE_COMMA},
		                        {boxLabel: '点(D)',name: 'rb',inputValue: COLUMNTYPE_POINT},
		                        {boxLabel: '科学计数法(S)',name: 'rb',inputValue: COLUMNTYPE_SCIENTIFIC},
		                        {boxLabel: '日期(A)', name: 'rb',inputValue: COLUMNTYPE_DATE_1},
		                        {boxLabel: '美元(L)',name: 'rb',inputValue: COLUMNTYPE_DOLLAR},
		                        {boxLabel: '设定货币(U)', name: 'rb',inputValue:COLUMNTYPE_CURRENCY},
		                        {boxLabel: '字符串(R)',name: 'rb',inputValue:COLUMNTYPE_CHAR},
		                        {boxLabel: '受限数值(具有前导零的整数)(E)',name: 'rb',inputValue: COLUMNTYPE_LIMIT}
		                ],
		    	        listeners: {
		    	        	change: function(field,newValue,oldValue,eOpts){
		    	        		
		    	        		if('09bd730a6a69412aaba66c02ff17e6af'===newValue.rb){//日期类型
		    	        			Ext.getCmp('width').hide();
		    	        			Ext.getCmp('decimals').hide();
		    	        			Ext.getCmp('char').hide();
		    	        			Ext.getCmp('date').show();
		    	        			Ext.getCmp('dollar').hide();
		    	        		}else if('85806344e6354482822f28ff055bcdd0'===newValue.rb){//字符类型
		    	        			Ext.getCmp('width').hide();
		    	        			Ext.getCmp('decimals').hide();
		    	        			Ext.getCmp('char').show();
		    	        			Ext.getCmp('date').hide();
		    	        			Ext.getCmp('dollar').hide();
		    	        		}else if(COLUMNTYPE_DECIMAL===newValue.rb
		    	        				||COLUMNTYPE_POINT===newValue.rb
		    	        				||COLUMNTYPE_COMMA===newValue.rb
		    	        				||COLUMNTYPE_CURRENCY===newValue.rb
		    	        				||COLUMNTYPE_SCIENTIFIC===newValue.rb
		    	        				||COLUMNTYPE_LIMIT===newValue.rb){//数字类型
		    	        			Ext.getCmp('width').show();
		    	        			Ext.getCmp('decimals').show();
		    	        			Ext.getCmp('char').hide();
		    	        			Ext.getCmp('date').hide();
		    	        			Ext.getCmp('dollar').hide();
		    	        		}else if(COLUMNTYPE_DOLLAR===newValue.rb){
		    	        			Ext.getCmp('width').show();
		    	        			Ext.getCmp('decimals').show();
		    	        			Ext.getCmp('char').hide();
		    	        			Ext.getCmp('date').hide();
		    	        			Ext.getCmp('dollar').show();
		    	        		}
		    	        	}
		    	        }
	        		},{fieldLabel: '长度',fieldWidth: 10,xtype: 'numberfield',x: 185,y: 65,value:100,id:'width',name: 'width',labelWidth:35},
	        		  {fieldLabel: '字符',fieldWidth: 10,xtype: 'numberfield',x: 185,y: 65,value:30,id:'char',name: 'char',labelWidth:35,hidden:true},
			          {fieldLabel: '小数', fieldWidth: 10,xtype: 'numberfield',x: 185,y: 95,value:0,id:'decimals',name: 'decimals',labelWidth:35},
			          {
			        	  fieldLabel: '日期格式',
			            	xtype: 'combo',
			            	id:'date',
			            	editable: false,
			                emptyText: "请选择...",
			                valueField: "abbr",
			                displayField: "name",
			                mode: 'local',
			                x: 185,y: 65,
			                labelWidth:60,
			                store: aligns,
			                allowBlank: false,
			                hidden:true
			                //vtype: 'email'
			            },
			            {
				        	  fieldLabel: '美元格式',
				            	xtype: 'combo',
				            	id:'dollar',
				            	editable: false,
				                emptyText: "请选择...",
				                valueField: "abbr",
				                displayField: "name",
				                mode: 'local',
				                x: 185,y: 125,
				                labelWidth:60,
				                store: dollar,
				                allowBlank: false,
				                hidden:true
				                //vtype: 'email'
				            }
	        ]
	    });

	    var win = Ext.create('Ext.window.Window', {
	    	id:'datatypeWin',
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
	            handler: onDatatypeSelect
	        },{
	            text: '取消',
	            handler: onDatatypeCancle
	        }]
	    });
}
//选择字段数据类型，并反写到grid
function onDatatypeSelect(){
	var datatype=Ext.getCmp('datatypeRadio').lastValue['rb'];
	if(COLUMNTYPE_DATE_1===datatype){
		datatype=Ext.getCmp('date').lastValue;
		if(undefined==datatype){
			Ext.MessageBox.alert("提示",'请选择一种日期格式');
			return;
		}
	}
	var width=Ext.getCmp('width').value;
	var decimals=Ext.getCmp('decimals').value;
	var charWidth=Ext.getCmp('char').value;
	
	var blparameter= Ext.getCmp('BLSTgrid').getSelectionModel();
	var selectRecord = blparameter.getSelection();
	blparameter.selectionStart.set('type',datatype+"asd");
	blparameter.selectionStart.set('type',datatype);
	
	var dataType=getTypeByUuid(selectRecord[0].data['type']);
	switch(dataType){
	case 1:
		blparameter.selectionStart.set('decimalWidth',decimals+"asd");
		blparameter.selectionStart.set('decimalWidth',decimals);
		blparameter.selectionStart.set('width',width+"asd");
		blparameter.selectionStart.set('width',width);
		break;
	case 2:
		blparameter.selectionStart.set('width',charWidth+"asd");
		blparameter.selectionStart.set('width',charWidth);
		blparameter.selectionStart.set('decimalWidth',0+"asd");
		blparameter.selectionStart.set('decimalWidth',0);
		break;
	case 3:
		blparameter.selectionStart.set('width',0+"asd");
		blparameter.selectionStart.set('width',0);
		blparameter.selectionStart.set('decimalWidth',0+"asd");
		blparameter.selectionStart.set('decimalWidth',0);
		break;
	}
	
	Ext.getCmp('datatypeWin').close();
	var plug = BLSTgrid.getPlugin();
    plug.startEdit(selectRecord[0].index, 2);
}
//取消选择，
function onDatatypeCancle(){
	Ext.getCmp('datatypeWin').close();
}

/**
 * 定义参数表在前台展示的model
 */

Ext.define('prameter', {
        extend: 'Ext.data.Model',
        fields: [
                 	'uuid',//序号
					'defineUuid',//
					'defineName',//
					'defineKeyword',//
					'value',//参数值
					'label',//参数标签
					'type'//
        ]
    });
var T_PARAM_TABLE='aa473745579144b383df76a4cd47a18b';
/**
 * 选择变量值标签
 */
function openWin(){
	if(Ext.getCmp('parameterWin')!=null){
		Ext.getCmp('parameterWin').close();
	}
	
    
	var blparameter= Ext.getCmp('BLSTgrid').getSelectionModel();
	var selectRecord = blparameter.getSelection();
	var type = selectRecord[0].data['type'];
	var paramDefine = selectRecord[0].data['name']===''?selectRecord[0].data['keyword']:selectRecord[0].data['name'];
	var typeValue=getTypeByUuid(type);
	var xtype=null;
	switch(typeValue)
	{
	case 1:
		xtype='numberfield';
		break;
	case 2:
		xtype='textfield';
		break;
	case 3:
		xtype='datefield';
		break;
	default:
		xtype='textfield';
		break;
	}
	var valueField={
            fieldLabel: '值',
            fieldWidth: 10,
            labelWidth:60,
            width:203,
            xtype:xtype,
            x: 5,
            y: 40,
            id:'values',
            name: 'values',
            //anchor: '-5',  // anchor width by percentage
            listeners: {
                'change': function(fb, v){
                	if(Ext.getCmp('label').getValue()!=null&&Ext.getCmp('label').getValue()!=''&&Ext.getCmp('values').getValue()!=null&&Ext.getCmp('values').getValue()!=''){
                		var sm = Ext.getCmp('parameterGrid').getSelectionModel();
	                	var ur = sm.getSelection();
	                	if(ur.length>0){
		                	var  labelCha=ur[0].data['label'];
		                	var valuesCha =ur[0].data['value'];
		                	if(Ext.getCmp('values').getValue()!=valuesCha||Ext.getCmp('label').getValue()!=labelCha){
		                		Ext.getCmp('add').enable();
		                		Ext.getCmp('update').enable();
		                	}else{
		                		Ext.getCmp('update').disable();
		                		Ext.getCmp('add').disable();
		                	}
	                	}else{
	                		Ext.getCmp('add').enable();
	                	}
                	}else{
                		Ext.getCmp('update').disable();
                		Ext.getCmp('add').disable();
                	}
                }
            }
        };
	if('varchar'.indexOf(type)==0){
		editorType='textfield';
	}else if('float'.indexOf(type)==0||'int'.indexOf(type)==0){
		editorType='numberfield';
	}
	
	var gridParamDefines = Ext.create('Ext.grid.Panel', {
		xtype: 'grid',
        //border: false,
		id:'paramDefineGrid',
        columns: [{
					header : 'defineUuid',
					hideable : false,
					hidden : true,
					dataIndex : 'defineUuid',
					width : 60
				},
	              { header: '组名',dataIndex: 'defineName',width: 80,align:'center'}
	             ],                 // One header just for show. There's no data,
        store: Ext.create('Ext.data.Store', {
       		id:'premeterStore',
       	    model: 'prameter',
       	    proxy: {
       	        type: 'ajax',
       	        url:encodeURI(encodeURI('../../../work-platform/queryParamsByDefineName.do?tblUuid='+T_PARAM_TABLE+'&&defineName='+paramDefine)),//此时留出tbl=是为了到时候修改表用的，如果要修改某给表的设计，可以传进来然后取出已有的字段
       	        reader: {
       	            type: 'json'/*,
       	            root:'aaData'*/
       	        }
       	    },
       	    autoLoad: true
       	}),
       	listeners: {
	            'selectionchange': function(view, records) {
	            	if(records.length>0){
		            	var storeModel= Ext.create('Ext.data.Store', {
		               		id:'premeterStore',
		               	    model: 'prameter',
		               	    proxy: {
		               	        type: 'ajax',
		               	        url:'../../../work-platform/queryParamsByDefineUUid.do?tblUuid='+T_PARAM_TABLE+'&&defineUuid='+records[0].data['defineUuid'],//此时留出tbl=是为了到时候修改表用的，如果要修改某给表的设计，可以传进来然后取出已有的字段
		               	        reader: {
		               	            type: 'json',
		               	            root:'aaData'
		               	        }
		               	    },
		               	    autoLoad: true
		               	});
		            	Ext.getCmp('parameterGrid').reconfigure( storeModel, null);
		            	Ext.getCmp('paramDefine').setValue(records[0].data['defineName']);
	            	}
//	            	Ext.getCmp('delete').setDisabled(false);
//	            	Ext.getCmp('update').setDisabled(true);
//	            	Ext.getCmp('add').setDisabled(true);
//	            	if(records.length>0){
//		            	Ext.getCmp('label').setValue(records[0].data['label']);
//		            	Ext.getCmp('values').setValue(records[0].data['value']);
//	            	}
	            }
        },
        x:230,
        y: 100,
        width:82,
        height:175
	});
	var gridParameters = Ext.create('Ext.grid.Panel', {
		xtype: 'grid',
   	 	id:'parameterGrid',
        //border: false,
        columns: [{
					header : 'uuid',
					hideable : false,
					hidden : true,
					dataIndex : 'uuid',
					width : 60,
					editor : {
						xtype : 'textfield'
					}
				},{
					header : 'defineUuid',
					hideable : false,
					hidden : true,
					dataIndex : 'defineUuid',
					width : 60,
					editor : {
						xtype : 'textfield'
					}
				},
				{
					header : 'defineName',
					hideable : false,
					hidden : true,
					dataIndex : 'defineName',
					width : 60,
					editor : {
						xtype : 'textfield'
					}
				},
				{
					header : 'type',
					hideable : false,
					hidden : true,
					dataIndex : 'type',
					width : 60,
					editor : {
						xtype : 'textfield'
					}
				},
	              { header: '值',dataIndex: 'value',width: 80,align:'center'},
	              { header: '标签',dataIndex: 'label',width: 80,align:'center'}
	             ],                 // One header just for show. There's no data,
        store: Ext.create('Ext.data.Store', {
       		id:'premeterStore',
       	    model: 'prameter',
       	    proxy: {
       	        type: 'ajax',
       	        url:'../../../work-platform/queryParamsByDefineUUid.do?tblUuid='+T_PARAM_TABLE+'&&defineUuid='+selectRecord[0].data['paramDefine'],//此时留出tbl=是为了到时候修改表用的，如果要修改某给表的设计，可以传进来然后取出已有的字段
       	        reader: {
       	            type: 'json',
       	            root:'aaData'
       	        }
       	    },
       	    autoLoad: true
       	}),
       	listeners: {
	            'selectionchange': function(view, records) {
	            	/*var sm= Ext.getCmp('paramDefineGrid').getSelectionModel();
	            	sm.deselectAll(false);*/
	            	Ext.getCmp('delete').setDisabled(false);
	            	Ext.getCmp('update').setDisabled(true);
	            	Ext.getCmp('add').setDisabled(true);
	            	//var r=records[0].data;
	            	
	            	/*if(Ext.getCmp('radio1').getValue()){
	            		Ext.getCmp('label').setValue(records[0].data[Ext.getCmp('column1').value]);
	            		Ext.getCmp('values').setValue(records[0].data[Ext.getCmp('column2').value]);
	            	}else{*/
	            	if(records.length>0){
		            	Ext.getCmp('label').setValue(records[0].data['label']);
		            	Ext.getCmp('values').setValue(records[0].data['value']);
	            	}
	            }
        },
        x:50,
        y: 100,
        width:162,
        height:175
	});
	
	 var form = Ext.create('Ext.form.Panel', {
	        layout: 'absolute',
	        defaultType: 'textfield',
	        border: false,
	        items: [{
	            fieldLabel: '参数组名',
	            fieldWidth: 30,
	            labelWidth:60,
	            width:203,
	            x: 5,
	            y: 10,
	            id:'paramDefine'
	            },valueField, {
		            fieldLabel: '标签',
		            fieldWidth: 30,
		            labelWidth:60,
		            width:203,
		            x: 5,
		            y: 70,
		            name: 'label',
		            id: 'label',
		            //anchor: '-5', // anchor width by percentage
		            listeners: {
		                'change': function(fb, v){
		                	if(Ext.getCmp('label').getValue()!=null&&Ext.getCmp('label').getValue()!=''&&Ext.getCmp('values').getValue()!=null&&Ext.getCmp('values').getValue()!=''){
		                		var sm = Ext.getCmp('parameterGrid').getSelectionModel();
			                	var ur = sm.getSelection();
			                	if(ur.length>0){
				                	var  labelCha=ur[0].data['label'];
				                	var valuesCha =ur[0].data['value'];
				                	if(Ext.getCmp('values').getValue()!=valuesCha||Ext.getCmp('label').getValue()!=labelCha){
				                		Ext.getCmp('add').enable();
				                		Ext.getCmp('update').enable();
				                	}else{
				                		Ext.getCmp('update').disable();
				                		Ext.getCmp('add').disable();
				                	}
			                	}else{
			                		Ext.getCmp('add').enable();
			                	}
		                	}else{
		                		Ext.getCmp('update').disable();
		                		Ext.getCmp('add').disable();
		                	}
		                	
		                }
		            }
		        },{
		            x:10,
		            y: 125,
		            xtype: 'button',
		            hideLabel: true,
		            text:'添加',
		            name: 'add',
		            id:'add',
		            disabled:true,
		            waitMsg: 'Saving Data...',
		            handler: onParameterAdd
		        },{
		            x:10,
		            y: 160,
		            xtype: 'button',
		            hideLabel: true,
		            text:'修改',
		            name: 'update',
		            id: 'update',
		            disabled:true,
		            handler: onParameterUpdate
		        },{
		            x:10,
		            y: 195,
		            xtype: 'button',
		            hideLabel: true,
		            text:'删除',
		            name: 'delete',
		            id: 'delete',
		            disabled:true,
		            handler: onParameterDel
		        }, gridParameters,gridParamDefines],
	        width:350,
            height:300
	    });
	 //Ext.getCmp('paramDefine').setValue(paramDefine);
	    var win = Ext.create('Ext.window.Window', {
	    	id:'parameterWin',
	        autoShow: true,
	        title: '值标签',
	        autoWidth: true,
	       autoHeight: true,
	        /*minWidth: 400,
	        minHeight: 200,*/
	        layout: 'fit',
	        plain:true,
	        items: form,
	        buttons: [/*{
	            text: '导入',
	            disabled:true,
	            id:'import',
	            handler: onParameterImport
	        },*/{
	            text: '确定',
	            handler: onParameterSelect
	        },{
	            text: '取消',
	            handler: onParameterCancle
	        }]
	    });
	

}
/**
 * 点击添加时的功能
 */
function onParameterAdd(){
	var blparameter= Ext.getCmp('BLSTgrid').getSelectionModel();
	var paramDefineGrid= Ext.getCmp('paramDefineGrid').getSelectionModel();
	var defineSelectRecord=paramDefineGrid.getSelection();
	var selectRecord = blparameter.getSelection();
	var columnUuid;
	var defineKeyword;
	var columnName;
	if(defineSelectRecord>0){
		columnUuid=defineSelectRecord[0].data['defineUuid'];
		defineKeyword=defineSelectRecord[0].data['defineKeyword'];
		columnName=defineSelectRecord[0].data['defineName'];

	}else{
		columnUuid=selectRecord[0].data['paramDefine']===''?selectRecord[0].data['uuid']:selectRecord[0].data['paramDefine'];
		defineKeyword=selectRecord[0].data['keyword'];
		columnName=selectRecord[0].data['name'];
	}
	if(undefined==columnUuid||''===columnUuid){
		var uuidId = new UUID().id; 
		blparameter.selectionStart.set('uuid',uuidId+"asd");
		blparameter.selectionStart.set('uuid',uuidId);
		columnUuid=selectRecord[0].data['uuid'];
	}
	var label = Ext.getCmp('label').getValue();
	var tempValue = Ext.getCmp('values').getValue();
	var value ='';
	var type = selectRecord[0].data['type'];
	var typeValue=getTypeByUuid(type);
	switch(typeValue){
		case 1:
			var format=getFormatByUuid(type);
			if(undefined!=format&&''!=format){
				value=Ext.util.Format.numberRenderer('0.000');
			}
			break;
		case 3:
			var format=getFormatByUuid(type);
			if(undefined!=format&&''!=format){
				value=Ext.Date.format(tempValue, format);
			}
			break;
		default:
			value=tempValue;
	}
	
	//var value = Ext.getCmp('values').getValue();
	
	var r = Ext.create('prameter', {
    	uuid : '',//序号
    	defineUuid : columnUuid,
    	defineName:columnName,
    	defineKeyword:defineKeyword,
    	value : value, 
    	label:label,
	 	type : '2'
    });
	
	var store = Ext.getCmp('parameterGrid').getStore();
	store.insert(store.getCount(), r);

	Ext.getCmp('add').disable();
	Ext.getCmp('label').setValue('');
	Ext.getCmp('values').setValue('');
}
/**
 * 点击更新时的功能
 */
function onParameterUpdate(){
	var sm = Ext.getCmp('parameterGrid').getSelectionModel();
	var pStroe =Ext.getCmp('parameterGrid').getStore();
	var ur = sm.getSelection();
	var  labelCha=Ext.getCmp('label').getValue();
	var valuesCha =Ext.getCmp('values').getValue();
	sm.selectionStart.set('value',valuesCha);
	sm.selectionStart.set('label',labelCha);
	Ext.getCmp('label').setValue('');
	Ext.getCmp('values').setValue('');
   // Ext.getCmp('parameterGrid').getStore().reload();

}
/**
 * 删除参数
 */
function onParameterDel(){
	var sm = Ext.getCmp('parameterGrid').getSelectionModel();
	var pStroe =Ext.getCmp('parameterGrid').getStore();
	pStroe.remove(sm.getSelection());
	var deletesJson=[];
	var head={tbluuid:T_PARAM_TABLE};
	var deletes =  pStroe.getRemovedRecords();
	
	 if(deletes.length>0){
	    	for(var i=0;i<deletes.length;i++){
	    		var record = deletes[i];
	    		deletesJson.push(record.data);
	    	}
	
		Ext.Ajax.request({
		    url: '../../../work-platform/deletedata.do',
		    params: {
		    	head: Ext.encode(head),
		    	delBLJson:Ext.encode([]), 
		    	delSJJson:Ext.encode(deletesJson)
		    },
		    success: function(response){
		    	var text = response.responseText;
		    	//Ext.MessageBox.alert("提示",text);
		    	Ext.example.msg('提示', '{0}', text);
		    },
		    failure : function(response) {
		    	Ext.example.msg('提示', '{0}',"保存失败");
			}
		});
	 }
	Ext.getCmp('label').setValue('');
	Ext.getCmp('values').setValue('');
}

/**
 * 将选中的参数回写到grid
 */
function onParameterSelect(){
	var pStroe =Ext.getCmp('parameterGrid').getStore();
	var blparameter= Ext.getCmp('BLSTgrid').getSelectionModel();
	
	if(pStroe.getCount()>0){
		var s=pStroe.getAt(0);
		var showStr=s.get('defineUuid');
		blparameter.selectionStart.set('paramDefine',showStr);
	}else{
		blparameter.selectionStart.set('paramDefine','');
	}
	var newsJson=[];
	var updatesJson=[];
	var deletesJson=[];
	var newrs = pStroe.getNewRecords();
	var updates =  pStroe.getUpdatedRecords();
	var deletes =  pStroe.getRemovedRecords();
	
	 if(deletes.length>0){
	    	for(var i=0;i<deletes.length;i++){
	    		var record = deletes[i];
	    		deletesJson.push(record.data);
	    	}
 	}
	 if(newrs.length>0){
	    	for(var i=0;i<newrs.length;i++){
	    		var record = newrs[i];
	    		newsJson.push(record.data);
	    	}
		}
		
	if(updates.length>0){
    	for(var i=0;i<updates.length;i++){
    		var record = updates[i];
    		updatesJson.push(record.data);
    	}
	}
	var head={tbluuid:T_PARAM_TABLE};
	Ext.Ajax.request({
	    url: '../../../work-platform/updateSj.do',
	    params: {
	    	head: Ext.encode(head),
	    	sjnewsJson:Ext.encode(newsJson),
	    	sjupdatesJson:Ext.encode(updatesJson)
	    },
	    success: function(response){
	    	Ext.getCmp('parameterWin').close();
	    	//Ext.MessageBox.alert("提示",text);
	    },
	    failure : function(response) {
	    	Ext.MessageBox.alert("提示","参数保存失败，请从新输入");
		}
	});	
}
/**
 * 取消参数选择
 */
function onParameterCancle(){
	Ext.getCmp('parameterWin').close();
}
/**
 * 将公用表中的数据导入，用于展示
 */
function onParameterImport(){
	/*var radio1 = Ext.getCmp('radio1');
	if (radio1.getValue()) {
		var tblUuid=Ext.getCmp('tblname').value;
		var c1 = Ext.getCmp('column1').value;
		var c2 = Ext.getCmp('column2').value;
		var columnModel= [{ header: '值',dataIndex: c1,width: 80},{ header: '标签',dataIndex: c2,width: 80}];
		
		Ext.define(tblname, {
	        extend: 'Ext.data.Model',
	        fields: [
	                 	c1,//序号
	                 	c2//对应的参数表
	        ]
	    }); 
		var url='../../../work-platform/querydata.do?uuid='+tblUuid;
		var storeModel=Ext.create('Ext.data.Store', {
	       		id:'premeterStore',
	       		fields: [
		                 	c1,//序号
		                 	c2//对应的参数表
		        ],
	       	    proxy: {
	       	        type: 'ajax',
	       	        url:url,
	       	        reader: {
	       	            type: 'json',
	       	            root:'aaData'
	       	        }
	       	    },
	       	    autoLoad: true
       	});
		Ext.getCmp('parameterGrid').reconfigure( storeModel, columnModel);
		
	}*/
}
/**
 * 初始化按钮或控件是否可用
 * @param flag
 */
function initBtnDisable(flag){
	 /*var radio1 = Ext.getCmp('radio1');
	 var radio2 = Ext.getCmp('radio2');
	 radio2.setValue(!flag);
	 radio1.setValue(flag);
	 
	 Ext.getCmp('import').setDisabled(!flag);
	 Ext.getCmp('tongyongbiao').setDisabled(!flag);
	 Ext.getCmp('tongyongbiao2').setDisabled(!flag);*/
	 /*Ext.getCmp('databasename').setDisabled(!flag);
	 Ext.getCmp('tblname').setDisabled(!flag);
	 Ext.getCmp('column1').setDisabled(!flag);
	 Ext.getCmp('column2').setDisabled(!flag);*/
}