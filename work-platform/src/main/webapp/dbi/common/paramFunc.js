/**
 * 选择变量值标签
 *//*
var saveOrno=true;
function openParamWin(){
	if(Ext.getCmp('parameterWin')!=null){
		Ext.getCmp('parameterWin').close();
	}
	
	var grid = Ext.getCmp('BLSTgrid');
	var blparameter= grid.getSelectionModel();
	var selectRecord = blparameter.getSelection();
	//defineUuid=selectRecord[0].data['paramDefine'];
	
	var s=[];
	for (var i = 0; i < myStore.getCount(); i++) {
		var record = myStore.getAt(i);
		s.push({"abbr":record.get('tbl'),"name":record.get('tbl')});
	}
	//用户用到的公用表表名
    var tbls = Ext.create('Ext.data.Store', {
        fields: ['abbr', 'name'],
        data : s
    });
    var cs=[];
    //用到的字段
    var columns = Ext.create('Ext.data.Store', {
        fields: ['abbr', 'name'],
        data : cs
    });
    var combotbl=Ext.create('Ext.form.ComboBox', {
           xtype: "combo",
           labelWidth:35,
           width:120,
           fieldLabel: "表名",
           id:'tblname',
           disabled:true,
           triggerAction: "all",
           store: tbls,
           emptyText: "请选择表名..",
           valueField: "abbr",
           displayField: "name",
           queryMode: "local",
           forceSelection: true
    });
    combotbl.on('change', function(combotbl, newvar, oldvar){  
    	  //alert('click');
    	var tbl=combotbl.value;
    	Ext.Ajax.request({
            url: '../../../ws/columns.json?tbl='+tbl,
            params: {
                //id: 1
            },
            success: function(response){
                text = response.responseText;
                var columns = text.split(',');
                for (var i = 0; i < columns.length; i++) {
                	cs.push({"abbr":columns[i],"name":columns[i]});
                }
                combo1.getStore().reload();
                
               // gridParameters.reconfigure( null, [{ header: '标签',dataIndex: 'label',width: 75},{ header: '值',dataIndex: 'valued',width: 134}] )
            }
    	});
    });  
    var combo1= Ext.create('Ext.form.ComboBox', {
        fieldLabel: '字段1',
        id:'column1',
        emptyText: "字段2..",
        store: columns,
        labelWidth:40,
        disabled:true,
        width:120,
        queryMode: 'local',
        displayField: 'name',
        valueField: 'abbr'
    });
    var combo2=Ext.create('Ext.form.ComboBox', {
        fieldLabel: '字段2',
        id:'column2',
        disabled:true,
        emptyText: "字段2..",
        store: columns,
        labelWidth:40,
        width:120,
        queryMode: 'local',
        displayField: 'name',
        valueField: 'abbr'
    });
    
	
	
	var gridParameters = Ext.create('Ext.grid.Panel', {
		xtype: 'grid',
   	 	id:'parameterGrid',
        //border: false,
        columns: [
                  	{xtype: 'rownumberer',header:'序号',width:105,align:'center'},{
						header : '参数定义id',
						hideable : false,
						hidden : true,
						dataIndex : 'defineUuid',
						width : 105,
						editor : {
							xtype : 'textfield',
							allowBlank : false
						}
                  	},{
						header : 'uuid',
						hideable : false,
						hidden : true,
						dataIndex : 'uuid',
						width : 105,
						editor : {
							xtype : 'textfield',
							allowBlank : false
						}
                  	},{
                  		header: '值',
                  		dataIndex: 'name',
                  		align:'center',
                  		width: 134,
                  		editor : {
							xtype : 'textfield',
							allowBlank : false
						}
                  	}],                 // One header just for show. There's no data,
        store: Ext.data.Store(
    			{
    				id : 'paramStore'+defineUuid,
    				xtype : 'store',
    				model : 'paramList',
    				autoLoad : true,
    				proxy : {
    					type : 'ajax',
    					url : '../../../work-platform/paramList.do?defineUuid='+defineUuid,
    					actionMethods : {
    						read : 'POST'
    					}
    				}
    			}),
       	listeners: {
	            'selectionchange': function(view, records) {
	            	
	            	Ext.getCmp('delete').enable();
	            }
        },
        x:5,
        y: 155,
        width:300,
        anchor: '-5',
        height:175,
        dockedItems: [{
            xtype: 'toolbar',
            items: [ {
                text:'保存',
                tooltip:'保存修改',
//                iconCls:'option',
                handler: paramSave
            },{
                text:'添加',
                tooltip:'添加新纪录',
//                iconCls:'add',
                handler: paramAdd
            }, {
                itemId: 'delete',
                id:'delete',
                text:'删除',
                tooltip:'删除选中行',
//                iconCls:'remove',
                disabled: true,
                handler: paramDel
            }]
        }],
        plugins: [
	  				Ext.create('Ext.grid.plugin.CellEditing', {
	  					clicksToEdit: 1,
	  					errorSummary:false
	  				})
	  			]
	      
	});
	
	 var form = Ext.create('Ext.form.Panel', {
	        layout: 'absolute',
	        defaultType: 'textfield',
	        border: false,
	        items: [{
	        	x: 5,
	            y: 5,
	            xtype:"radio",
	           name:"sex",
	           boxLabel:"通用表",
	           id:'radio1',
	           listeners: {
		              click: {
		                  element: 'el', 
		                  fn: function(){
		                	  var radio1 = Ext.getCmp('radio1');
		                	 if (radio1.getValue()) {
		                		 initBtnDisable(true);
		                	 }
		                	 
		                  }
		              }
		          }
        	},{
	        	xtype: 'fieldcontainer',
	        	id:'tongyongbiao',
	            combineErrors: true,
	            x: 5,
	            y: 35,
	            layout: 'hbox',
	            items: [combotbl,combo1,combo2]
	        },{
		        	x: 5,
		            y: 65,
		           xtype:"radio",
		           name:"sex",
		           //fieldLabel:"性别",
		           boxLabel:"不通用表",
		           id:'radio2',
		           checked:true,
		           listeners: {
			              click: {
			                  element: 'el', 
			                  fn: function(){
			                	 var radio1 = Ext.getCmp('radio1');
			                	 var radio2 = Ext.getCmp('radio2');
			                	 if (radio2.getValue()) {
			                		 initBtnDisable(false);
				                	 
				                	 
				                	 var columnModel= [{ header: '序号',
				    	                 dataIndex: 'pnumber',
				    	                 width: 35},
				    	                 { header: '标签',
				    	                 dataIndex: 'label',
				    	                 width: 75},
				    	                 { header: '值',
				    	                 dataIndex: 'valued',
				    	                 width: 134}];
				             		
				             		
				             		var storeModel=Ext.create('Ext.data.Store', {
				                   		id:'premeterStore',
				                   	    model: 'prameter',
				                   	    proxy: {
				                   	        type: 'ajax',
				                   	        url:'../../../ws/getParameter.json?column='+column+'&&tbl='+document.getElementById("currentTbl").value,//此时留出tbl=是为了到时候修改表用的，如果要修改某给表的设计，可以传进来然后取出已有的字段
				                   	        reader: {
				                   	            type: 'json',
				                   	            root:'aaData'
				                   	        }
				                   	    },
				                   	    autoLoad: true
				                   	});
				             		Ext.getCmp('parameterGrid').reconfigure( storeModel, columnModel);
			                	 }
			                	 
			                  }
			              }
			          }
	        },{
		            fieldLabel: '参数名',
		            fieldWidth: 10,
		            xtype: 'textfield',
		            x: 5,
		            y: 95,
		            id:'defineName',
		            name: 'defineName',
		            anchor: '-5',  // anchor width by percentage
		            listeners: {
		                'change': function(fb, v){
		                	saveOrno=false;
		                }
		            }
		        },{
		            xtype: 'textfield',
		            id:'defineUuid',
		            name: 'label',
		            hidden:true
		        }, gridParameters],
	        width:400,
            height:360
	    });
	 
	 var selectRecord = BLSTgrid.getSelectionModel().selected.items[0];
	 //if(!''===selectRecord.get('paramDefine'))
	    defineName=getParamNameByUuid('paramDefine',selectRecord.get('paramDefine'));
	 Ext.getCmp('defineUuid').setValue(defineUuid);
	 Ext.getCmp('defineName').setValue(defineName);
	 saveOrno=true;
	    var win = Ext.create('Ext.window.Window', {
	    	id:'parameterWin',
	        autoShow: true,
	        title: '值标签',
	        autoWidth: true,
	       autoHeight: true,
	        minWidth: 400,
	        minHeight: 200,
	        layout: 'fit',
	        plain:true,
	        items: form,
	        buttons: [{
	            text: '导入',
	            disabled:true,
	            id:'import',
	            //handler: onParameterImport
	        },{
	            text: '确定',
	           handler: onParamSelect
	        },{
	            text: '取消',
	            handler: onParameterCancle
	        }]
	    });
}
//保存

function paramSave(){
	var paramStore=Ext.getCmp('parameterGrid').getStore();
	var newrs = paramStore.getNewRecords();
	var updates =  paramStore.getUpdatedRecords();
	var newsJson=[];
	var updatesJson=[];
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
	Ext.Ajax.request({
	    url: '../../../work-platform/saveOrUpdateParam.do',
	    params: {
	    	defineUuid: Ext.getCmp('defineUuid').value,
	    	defineName: Ext.getCmp('defineName').value,
	    	newsJson:Ext.encode(newsJson),
	    	updatesJson:Ext.encode(updatesJson)
	    },
	    success: function(response){
	    	var text = response.responseText;
	    	var index=text.indexOf("uuid", 0);
	    	if(text.substring(index+4).length>0){
	    		Ext.getCmp('defineUuid').setValue(text.substring(index+4)); 
	    		defineUuid=text.substring(index+4);
	    	}
	    	Ext.getCmp('parameterGrid').getStore().reload();
	    	Ext.getCmp('parameterGrid').reconfigure(Ext.data.Store(
	    			{
	    				id : 'paramStore'+defineUuid,
	    				xtype : 'store',
	    				model : 'paramList',
	    				autoLoad : true,
	    				proxy : {
	    					type : 'ajax',
	    					url : '../../../work-platform/paramList.do?defineUuid='+defineUuid,
	    					actionMethods : {
	    						read : 'POST'
	    					}
	    				}
	    			}),null);
	    	createParamStore('paramDefine');
	    	saveOrno=true;
	    	Ext.MessageBox.alert("提示",text.substring(0, index));
	    },
	    failure : function(response) {
	    	alert("保存失败");
		}
	});
	
	paramStore.commitChanges();
}
//添加参数
function paramAdd(){
	var r = Ext.create('paramList', {
		uuid : '',
		defineUuid : '',
		name :''
    });
	var paramStore=Ext.getCmp('parameterGrid').getStore();
	paramStore.insert(paramStore.getCount(), r);
    var plug = Ext.getCmp('parameterGrid').getPlugin();
    plug.startEdit(paramStore.getCount()-1, 2);
    saveOrno=false;
}
//删除参数
function paramDel(){
	var paramStore=Ext.getCmp('parameterGrid').getStore();
	var sm = Ext.getCmp('parameterGrid').getSelectionModel();
    rowEditing.cancelEdit();
    paramStore.remove(sm.getSelection());
    if (paramStore.getCount() > 0) {
        sm.select(0);
    }
    var removeRecords=paramStore.getRemovedRecords();
    if(removeRecords.length>0){
    	var delParamJson=[];
    	for(var i=0;i<removeRecords.length;i++){
    		var record = removeRecords[i];
    		delParamJson.push(record.data);
    	}
    	Ext.Ajax.request({
    	    url: '../../../work-platform/deleteParam.do',
    	    params: {
    	    	defineUuid: Ext.getCmp('defineUuid').value,
    	    	delParamJson: Ext.encode(delParamJson)
    	    },
    	    success: function(response){
    	    	var text = response.responseText;
    	    	Ext.MessageBox.alert("提示",text);
    	    },
    	    failure : function(response) {
    	    	alert("保存失败");
    		}
    	});
    	
    }
    paramStore.commitChanges();
}
//选中参数，回写
function onParamSelect(){
	//paramSave();
	//var sm = Ext.getCmp('parameterGrid').getSelectionModel();
	//var pStroe =Ext.getCmp('parameterGrid').getStore();
	//var ur = sm.getSelection();
	if(saveOrno){
		var blparameter= Ext.getCmp('BLSTgrid').getSelectionModel();
		var selectRecord = blparameter.getSelection();
		var defineUuid=Ext.getCmp('defineUuid').value;
		//createParamStore(defineUuid);
		blparameter.selectionStart.set('paramDefine',defineUuid+'asd');
		blparameter.selectionStart.set('paramDefine',defineUuid);
		//selectRecord[0].data['paramDefine']=defineUuid;
		
		Ext.getCmp('parameterWin').close();
		var grid=Ext.getCmp('BLSTgrid');
		var plug = grid.getPlugin();
	    plug.startEdit(selectRecord[0].index, 7);
	    defineUuid='';
	    defineName='';
	}else{
		Ext.MessageBox.alert("提示",'请先进行保存！');
	}
}*/