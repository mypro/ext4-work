//因子关系明细
function onItemDetail(item, pressed){
	 Ext.example.msg('Button Click','You clicked the "{0}" button.', btn.displayText || btn.text);
}
//点击新建之后的操作
function onCreateClick(){
	 ExtJsPrompt = function(){
  	   Ext.MessageBox.prompt("新建表","请输入表名：",function(bu,txt){
  		   if(bu=='ok'){
  			   document.getElementById("currentTbl").value=txt;
  			   document.getElementById("isSaved").value='new';
  			 sjstTempStore='';
  			   setTabPanel();
  		   }
  	});
  }
  new ExtJsPrompt();
}
//保存
function onSaveClick(item){
	var tabPanel =Ext.getCmp('centerTab');
	var s = tabPanel.getActiveTab();
	var tabId = s.id;
	var tblname = document.getElementById("currentTbl").value;
    var isSave = document.getElementById("isSaved").value;
    var tbluuid=document.getElementById("tbluuid").value;
    var head ={tbluuid:tbluuid};//表名，以及是否是新建表
    if('blst'.indexOf(tabId)==0){
    	saveBL(head);
    }else if('sjst'.indexOf(tabId)==0){
    	saveSJ(head);
    }
	
	
}
//保存变量
function saveBL(head,blstStore){
	
	var blnewrs = blstStore.getNewRecords();
	var blupdates =  blstStore.getUpdatedRecords();
	var blnewsJson=[];//新增加的字段
	var blupdatesJson=[];//更新的字段
	if(blnewrs.length>0){
    	for(var i=0;i<blnewrs.length;i++){
    		var record = blnewrs[i];
    		if(record.get('keyword')===''){
    			
    		}else{
    			blnewsJson.push(record.data);
    		}
    	}
	}
	
	if(blupdates.length>0){
    	for(var i=0;i<blupdates.length;i++){
    		var record = blupdates[i];
    		blupdatesJson.push(record.data);
    	}
	}
	if(blnewsJson.length>0||blupdatesJson.length>0){
		Ext.Ajax.request({
		    url: '../../../work-platform/updateBl.do',
		    params: {
		    	head: Ext.encode(head),
		    	blnewsJson:Ext.encode(blnewsJson),
		    	blupdatesJson:Ext.encode(blupdatesJson)
		    },
		    success: function(response){
		    	blstStore.reload();
		    	var text = response.responseText;
//		    	var messageBox = Ext.getCmp('message');
//		    	messageBox.setValue(messageBox.getValue()+"\n"+(MESSAGE_NUMBER++)+'、'+text);
		    	Ext.example.msg('提示', '{0}', text);
		    	blstStore.commitChanges();
		    },
		    failure : function(response) {
		    	alert("保存失败");
			}
		});
	}
}
//保存数据
function saveSJ(head,SJSTstoreData,BLSTstore){
	
	var sjnewrs = SJSTstoreData.getNewRecords();
	var sjupdates =  SJSTstoreData.getUpdatedRecords();
	var sjnewsJson=[];//新添加的数据
	var sjupdatesJson=[];//修改的数据
	var keys = new Array();
	if(sjnewrs.length>0){
		for (var i = 0; i < BLSTstore.getCount(); i++) {
    		var record = BLSTstore.getAt(i);
    		keys[i]=record.get('keyword');
    	}
		keys[i+1]='seq';
		for(var i=0;i<sjnewrs.length;i++){
    		var record = sjnewrs[i];
    		var temp={};
    		//循环得到字段
    		var nullNum=0;
    		for(var j=0;j<keys.length;j++){
    			var t =keys[j];
    			var s=record.get(keys[j]);
    			if(record.get(keys[j])===''||null==record.get(keys[j])){
    				++nullNum;
    			}
    			temp[t]=record.get(keys[j]);
    		}
    		if(nullNum!=(keys.length-1))
    		sjnewsJson.push(temp);
    	}
	}
	
	var keyss = new Array();
	if(sjupdates.length>0){
		for (var i = 0; i < BLSTstore.getCount(); i++) {
    		var record = BLSTstore.getAt(i);
    		keyss[i]=record.get('keyword');
    	}
		keyss[i+1]='seq';
		for(var i=0;i<sjupdates.length;i++){
    		var record = sjupdates[i];
    		var temp={uuid:record.get('uuid')};
    		//循环得到字段
    		for(var j=0;j<keyss.length;j++){
    			var t =keyss[j];
    			temp[t]=record.get(t);
    		}
    		sjupdatesJson.push(temp);
    	}
	}
	if(sjnewsJson.length>0||sjupdatesJson.length>0){
		Ext.Ajax.request({
		    url: '../../../work-platform/updateSj.do',
		    params: {
		    	head: Ext.encode(head),
		    	sjnewsJson:Ext.encode(sjnewsJson),
		    	sjupdatesJson:Ext.encode(sjupdatesJson)
		    },
		    success: function(response){
		    	SJSTstoreData.reload();
		    	SJSTstoreData.commitChanges();
		    	var text = response.responseText;
		    	/*Ext.MessageBox.alert("提示",text);*/
//		    	var messageBox = Ext.getCmp('message');
//		    	messageBox.setValue(messageBox.getValue()+"\n"+(MESSAGE_NUMBER++)+'、'+text);
		    	Ext.example.msg('提示', '{0}', text);
		    },
		    failure : function(response) {
//		    	var messageBox = Ext.getCmp('message');
//		    	messageBox.setValue(messageBox.getValue()+"\n"+(MESSAGE_NUMBER++)+'、'+response.responseText);
		    	alert("保存失败");
			}
		});
	}
}

//添加新纪录
function onAddClick(item){
	var tabPanel =Ext.getCmp('centerTab');
	var s = tabPanel.getActiveTab();
	var tabId = s.id;
    if('blst'.indexOf(tabId)==0){
    	BLSTgrid.getPlugin().cancelEdit();
        var keyword = 'var00'+BLSTstore.getCount();
        
        var r = Ext.create('Basetbl', {
        	uuid : '',//序号
        	tableUuid : document.getElementById("tbluuid").value,
            keyword : keyword, //变量名 应该设置成自增的，不输入就是默认的
            name:'',
		 	type : '0942221e69d14bfba39ac501380b3665',//变量类型）
			width:65,//变量长度
			decimalWidth:0,//小数位数
			label:'',//变量标签
			data:'无',//变量值标签
			missing: 0,//缺省值
			showWidth: 8,//变量显示宽度
			showAlign: 0,//对齐方式  先写上左对齐，等查完api再改成相应的
			isUnique:0,
			paramColumnUuid:'',
			paramDefine:''
        });
        BLSTstore.insert(BLSTstore.getCount(), r);
	        var plug = BLSTgrid.getPlugin();
	        plug.startEdit(BLSTstore.getCount()-1, 6);
       }else if('sjst'.indexOf(tabId)==0){
    	   SJSTgrid.getPlugin().cancelEdit();
	   		var fields = [];
	   		fields.push('uuid');
	   		var defaultColumns = '{';
	   		var s='';
	   		var editorType='';
	   		for (var i = 0; i < BLSTstore.getCount(); i++) {
	   			var record = BLSTstore.getAt(i);
	   				
	   			fields.push(record.get('name'));
	   			
	   			defaultColumns +='"'+record.get('name')+'":"'+record.get('missing')+'",';
	   		}
	   		if(BLSTstore.getCount()>0){
	   			defaultColumns=defaultColumns.substring(0, defaultColumns.length-1);
	   			defaultColumns+='}';
	   			s = Ext.decode(defaultColumns);
	   		}
	   		Ext.define('tbl', {
		        extend: 'Ext.data.Model',
		        fields: fields
		    });
	   		var r = Ext.create('tbl',s);

            SJSTstoreData.insert(SJSTstoreData.getCount(), r);
            var plug = SJSTgrid.getPlugin();
	        plug.startEdit(SJSTstoreData.getCount()-1, 2);
       }
}
//插入新纪录
function onItemInsert(item){
	var tabPanel = Ext.getCmp('centerTab');
	var s = tabPanel.getActiveTab();
	var tabId = s.id;
    if('blst'.indexOf(tabId)==0){
        var keyword = 'var00'+BLSTstore.getCount();
        var baseid = BLSTstore.getCount()+1;
        var r = Ext.create('Basetbl', {
        	baseid : baseid,//序号
        	tableUuid : document.getElementById("tbluuid").value,
            keyword : keyword, //变量名 应该设置成自增的，不输入就是默认的
		 	type : 1,//变量类型）
			width:65,//变量长度
			decimalWidth:0,//小数位数
			label:'',//变量标签
			data:'无',//变量值标签
			missing: 0,//缺省值
			showWidth: 8,//变量显示宽度
			showAlign: 0,//对齐方式  先写上左对齐，等查完api再改成相应的
			isUnique:0
        });
        var sm = BLSTgrid.getSelectionModel();
   		var s =sm.getSelection();
   		var index=s[0].index; 
        BLSTstore.insert(index, r);
        var plug = BLSTgrid.getPlugin();
        plug.startEdit(index, 6);
        sm.select(index);
        //Ext.getCmp('BLSTgrid').setScrollTop(index);
    }else if('sjst'.indexOf(tabId)==0){
   		var fields = [];
   		fields.push('id');
   		var defaultColumns = '{';
   		var s='';
   		var editorType='';
   		for (var i = 0; i < BLSTstore.getCount(); i++) {
   			var record = BLSTstore.getAt(i);
   				
   			fields.push(record.get('name'));
   			
   			defaultColumns +='"'+record.get('name')+'":"'+record.get('missing')+'",';
   		}
   		if(BLSTstore.getCount()>0){
   			defaultColumns=defaultColumns.substring(0, defaultColumns.length-1);
   			defaultColumns+='}';
   			s = Ext.decode(defaultColumns);
   		}
   		Ext.define('tbl', {
	        extend: 'Ext.data.Model',
	        fields: fields
	    });
   		var r = Ext.create('tbl',s);
   		var sm = SJSTgrid.getSelectionModel();
   		var s =sm.getSelection();
   		var index=s[0].index;  
        SJSTstoreData.insert(index, r);
        var plug = SJSTgrid.getPlugin();
        plug.startEdit(index, 2);
        var sm = SJSTgrid.getSelectionModel();
   		var s =sm.getSelection();
   		var index=s[0].index;  
   }
}
//删除选中记录
function onItemDel(item){
	Ext.MessageBox.confirm('确认', '你确定要删除?', function(e){
		   if(e=='yes'){
				var tabPanel = Ext.getCmp('centerTab');
				var s = tabPanel.getActiveTab();
				var tabId = s.id;
				
				var delBLJson=[];
				var delSJJson=[];
				var tblname = document.getElementById("currentTbl").value;
				var isSave = document.getElementById("isSaved").value;
				var tbluuid=document.getElementById("tbluuid").value;
				var head ={tbluuid:tbluuid,isSaved:isSave};//表名，以及是否是新建表
				
				if('blst'.indexOf(tabId)==0){
			    	var sm = BLSTgrid.getSelectionModel();
			        //rowEditing.cancelEdit();
			    	
				   			BLSTstore.remove(sm.getSelection());
				   	        if (BLSTstore.getCount() > 0) {
				   	            sm.select(0);
				   	        }
				   		    if('saved'.indexOf(isSave)==0){
				   		        var delstores= BLSTstore.getRemovedRecords();
				   		        if(delstores.length>0){
				   			    	for(var i=0;i<delstores.length;i++){
				   			    		var record = delstores[i];
				   			    		delBLJson.push(record.data);
				   			    	}
				   		    	}
				   		    }
			   		  
			        
				}else if('sjst'.indexOf(tabId)==0){
					var sm = SJSTgrid.getSelectionModel();
			        //rowEditing.cancelEdit();
			        SJSTstoreData.remove(sm.getSelection());
			        if (SJSTstoreData.getCount() > 0) {
			            sm.select(0);
			        }
			        if('saved'.indexOf(isSave)==0){
				        var delstores= SJSTstoreData.getRemovedRecords();
				        if(delstores.length>0){
					    	for(var i=0;i<delstores.length;i++){
					    		var record = delstores[i];
					    		delSJJson.push(record.data);
			//		    		delSJJson.push({
			//						tblname:tblname,
			//						uuid:record.get('uuid'),
			//						name:record.get('name')
			//					  });
					    	}
				    	}
			        }
				}
				Ext.Ajax.request({
				    url: '../../../work-platform/deletedata.do',
				    params: {
				    	head: Ext.encode(head),
				    	delBLJson: Ext.encode(delBLJson),
				    	delSJJson:Ext.encode(delSJJson)
				    },
				    success: function(response){
				    	var text = response.responseText;
				    	Ext.example.msg('提示', '{0}', text);
				    },
				    failure : function(response) {
				    	Ext.example.msg('提示', '{0}', '保存失败');
		}
	});
	BLSTstore.commitChanges();
	SJSTstoreData.commitChanges();
		   }
	});
}
//上传导入
function onItemUpload(item){
	if(Ext.getCmp('saveButton')!=undefined)
	Ext.getCmp('saveButton').destroy( );
	if(AddfileForm!=undefined)
	AddfileForm.close();
	Ext.getCmp('card-panel').add({
        autoScroll: true,
        xtype: "tabpanel",
        id: "uploadPanel",
        cls: "iScroll",
        html:'导入excel'
    });
	Ext.getCmp("card-panel").layout.setActiveItem("uploadPanel");
	var FileRname = new Ext.form.TextField({
		name : 'FileRname',
		fieldLabel : '文件名',
		allowBlank : false,
		emptyText : '发布用于显示的文件名',
		anchor:'95%'
	});
	var AddfileForm=new Ext.FormPanel(
	{
		name : 'AddfileForm',
		id:'AddfileForm',
		frame : true,
		labelWidth : 90,
		url : '../../../work-platform/upload.do',
		fileUpload : true,
		width : 420,
		autoDestroy : true,
		bodyStyle : 'padding:0px 10px 0;',
		items : [{
					id:'fileName',
					xtype : 'filefield',
					emptyText : '选择上传文件',
					fieldLabel : '文件',
					name : 'upfile',
					buttonText : '',
					anchor : '95%',
					buttonText: 'Select excel...',
					listeners : {
						'change':function(fb,v){
							var allowfiletype='.xls';
							var temp = v.replace(
									/^.*(\.[^\.\?]*)\??.*$/, '$1');
							var temp1 = temp.toLocaleLowerCase();
							if (allowfiletype.indexOf(temp1) != -1) {
								FileRname.setValue(v.replace(/^.+?\\([^\\]+?)(\.[^\.\\]*?)?$/gi,"$1"));
								Ext.getCmp('saveButton').setDisabled(false);
							} else {
								Ext.getCmp('saveButton').setDisabled(true);
								Ext.getCmp('fileName').setValue("");
								FileRname.setValue("");
								Ext.Msg.alert("错误","不允许选择该类型文件，请重新选择！");
							}
						}
					}
				}]
	});
	var AddfileWin=new Ext.Window(
	{
		name : 'AddfileWin',
		width : '450',
		height : '180',
		layout : 'fit',
//		closeAction : 'close',
		closeable:false,
		title : '上传文件',
		buttonAlign : 'center',
		resizable : false,
		modal : true,
		autoDestroy : true,
		items : AddfileForm,
		buttons :[{
					text : '保存',
					id:'saveButton',
					disabled:true,
					handler : function() {
						if (AddfileForm.getForm().isValid()) {
							Ext.MessageBox.show({
								title : '请稍等...',
								msg : '文件上传中...',
								progressText : '',
								width : 300,
								progress : true,
								closable : false,
								animEl : 'loding'
							});

							AddfileForm.getForm().submit(
									{
										success : function(form, action) {
											Ext.getCmp("guidetree").getStore().reload();
		                            		Ext.getCmp("card-panel").layout.setActiveItem("uploadPanel");
											var Result = action.result.flag;
											if (Result != 0) {
												
												Ext.MessageBox.alert("提示",action.result.message);
												Ext.getCmp('saveButton').destroy( );
												AddfileForm.close();
												AddfileWin.close();
											} else if (Result == 0) {
												Ext.MessageBox.alert("提示",action.result.message);
												ds.load({
													params : {
														start : start,
														limit : limit
													}
												});
												AddfileForm.getForm().reset();
											}
										},
										failure : function(form, action) {
											var Result = action.result.flag;
											Ext.MessageBox.alert("提示",action.result.message);
										}
									});
						}
					}
				}, {
					text : '重置',
					handler : function() {
						AddfileForm.getForm().reset();
					}
				}, {
					text : '关闭',
					handler : function() {
						Ext.getCmp('saveButton').destroy( );
						AddfileForm.close();
						AddfileWin.close();
					}
				} ]
	});
	AddfileWin.show();

}
