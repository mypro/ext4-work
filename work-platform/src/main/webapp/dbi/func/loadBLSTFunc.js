Ext.require([ 'Ext.grid.*', 'Ext.data.*', 'Ext.util.*', 'Ext.state.*',
		'Ext.form.*',
		// 'Ext.ux.RowExpander',
		'Ext.selection.CheckboxModel' ]);

createParamStore(PARAM_DEFINE_COLUMNTYPE);
createParamStore(PARAM_DEFINE_ALIGN);
createParamStore(PARAM_DEFINE_METRIC);
createParamStore(PARAM_DEFINE_ROLE);
createParamStore('paramDefine');
createTypeStore();
var grid;
function loadBLST() {
	var tbluuid=document.getElementById("tbluuid").value;
	if(SJSTstoreData!=undefined&&SJSTstoreData.getModifiedRecords().length>0){
//		if(''!=SJSTstoreData.getAt(SJSTstoreData.getCount()-1).get('uuid')){
//		 Ext.MessageBox.confirm('确认', '是否要保存数据？', function(bt){
//			 if(bt=='yes'){
				 var head ={tbluuid:tbluuid};
				 saveSJ(head,SJSTstoreData,grid.getStore());
//			 }
//		 });
//		}
	}
	document.getElementById("center2").innerHTML = "";// 清除原来加载进来的元素
	var toolbar = Ext.getCmp('toolbar');
//	toolbar.down('#removeBl').setDisabled(true);// 把顶端工具栏的删除按钮屏蔽，选中记录时激活
//	toolbar.down('#addBl2').setDisabled(true);
	/**
	 * 将所有用户建立的表当做参数表，然后建表时在变量视图中作为数据类型的一种出现在下拉框里
	 */
	var center2=Ext.get("center2");
//	window.onresize=function(){
//		grid.setWidth(0);
//		grid.setWidth(center2.getComputedWidth());
//	};
	 grid = Ext.create("VariableGrid.view.VariableView",{
    	id : 'variablegrid',
    	renderTo: 'center2',
    	width : center2.getComputedWidth(),
		frame : true,
		height : center2.getComputedHeight(),
    	data:{
    		tblUuid:tbluuid
    	},
    	callback : {
    		afterlayout:function(){
    			if(!grid.getStore().getCount()>0)
    				addRecord();
    		},
    		containerclick:function(grid2){
    			addRecord();
    		},
			openValueWin : function(e){
				var sm = grid.getSelectionModel();
				var defineName = sm.selectionStart.get('paramDefineName')===''?sm.selectionStart.get('name'):sm.selectionStart.get('paramDefineName');
//				var type=sm.selectionStart.get('type');
				
				var valueLabelwin = Ext.create('ValueLabel.view.ValueLabelWindow',{
					id : 'valueLabel',
					data : {
						xtype:"textfield",
						defineName:defineName
					},
					 callback : {
						save : function(win, defineUuid,defineName,isNew, head, newsJson,updatesJson){
							console.log(win+' '+defineUuid+' '+head+' '+newsJson+' '+updatesJson);
							var sm = grid.getSelectionModel();
							sm.selectionStart.set('paramDefine',defineUuid);
							sm.selectionStart.set('paramDefineName',defineName);
							if(isNew){
								Ext.Ajax.request({
								    url: '../../../work-platform/updateSj.do',
								    params: {
								    	head: Ext.encode(head),
								    	sjnewsJson:Ext.encode(newsJson),
								    	sjupdatesJson:Ext.encode(updatesJson)
								    },
								    success: function(response){
								    	valueLabelwin.close();
								    },
								    failure : function(response) {
								    	Ext.MessageBox.alert("提示","参数保存失败，请从新输入");
									}
								});	
							}
//							valueLabelwin.close();
						},
						onPanelRendered:function( win,eOpts){
//							alert('onPanelRendered');
						}
					} 
				}).show();
			},
			openMissingWin:function(){
				var missingwin = Ext.create('Missing.view.MissingWindow',{
					id : 'missingWindow'
				}).show();
			},
			openDataTypeWin:function(){
				var dataTypewin = Ext.create('DataType.view.DataTypeWindow',{
					id : 'datatypeWindow',
					// 初始化数据
					data : {
						dataType : 'd96620a7749b477d9a23e1e36a56ab19',
						width : 8,
						decimalWidth : 2
					},
					callback : {
						// 点击保存
						save : function(win, dataTypeValue, widthValue, decimalValue){
							console.log(win+' '+dataTypeValue+' '+widthValue+' '+decimalValue);
							var sm = grid.getSelectionModel();
							sm.selectionStart.set('type',dataTypeValue);
							
							var dataType=getTypeByUuid(dataTypeValue);
							switch(dataType){
								case 1:
									sm.selectionStart.set('decimalWidth',decimalValue);
									sm.selectionStart.set('width',widthValue);
									break;
								case 2:
									sm.selectionStart.set('width',widthValue);
									sm.selectionStart.set('decimalWidth',0);
									break;
								case 3:
									sm.selectionStart.set('width',0);
									sm.selectionStart.set('decimalWidth',0);
									break;
							}
							dataTypewin.close();
						},
						changeRadio : function(win, field, newValue){
//							console.log(win+' '+field+' '+newValue);
						}
					}
				}).show();
			}
		}
    });
	
	 function addRecord(keyword){
		 var store = grid.getStore();
			var index =store.getCount();
	    	if(index>0){
		    	if(store.getAt(index-1).get('keyword')===''){
		    		return;
		    	}
	    	}
	    	var seq=0;
	        if(store.getCount()>=1){
	        	seq=store.getAt(store.getCount()-1).get('seq')+1024;
	        }
	        var vs=0;
	        for(var i=0;i<store.getCount();i++){
	        	var record=store.getAt(i);
	        	if(record.get('keyword').indexOf('var00')){
	        		vs++;
	        	}
	        }
//	        var keyword = 'var00'+vs;
	        var r = Ext.create('VariableGrid.model.VariableModel', {
	        	uuid:'',//序号
	        	seq:seq,
	            tableUuid:'',
	            keyword:keyword,
	            name:'', //变量名
	    	 	type:'85806344e6354482822f28ff055bcdd0',//变量类型）
	    		width:30,//变量长度
	    		decimalWidth:'',//小数位数
	    		label:'',//变量标签
	    		data:'',//变量值标签
	    		missing:'',//缺省值
	    		showWidth:80,//变量显示宽度
	    		showAlign:'',//对齐方式
	    		isUnique:'',
	    		paramTableUuid:'',
	    		paramColumnUuid:'',
	    		paramColumnLabelUuid:'',
	    		paramDefine:'',
	    		paramDefineName:'',
	    		metric:'',
	    		role:''
	        });
			var head ={tbluuid:tbluuid};
			if(store.getModifiedRecords().length>0){
				saveBL(head,store);
 			
			}else{
				store.insert(index, r);
			}
	 }
}

