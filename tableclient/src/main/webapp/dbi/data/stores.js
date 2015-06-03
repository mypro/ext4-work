/**
 * 用于数据视图和变量视图切换时，数据视图的列名根据变量视图中的数据显示
 */


/* 基本表的Model*/
Ext.define('Basetbl', {
        extend: 'Ext.data.Model',
        fields: [
            'uuid',//序号
            'tableUuid',
            'keyword',
            'name', //变量名
		 	'type',//变量类型）
			'width',//变量长度
			'decimalWidth',//小数位数
			'label',//变量标签
			'data',//变量值标签
			'missing',//缺省值
			'showWidth',//变量显示宽度
			'showAlign',//对齐方式
			'isUnique',
			'paramTableUuid',
			'paramColumnUuid',
			'paramColumnLabelUuid',
			'paramDefine',
			'metric',
			'role',
        ]
    });    
var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
    clicksToMoveEditor: 1,
    autoCancel: false
});
// create the Data Store
var SJSTstoreData;
var SJSTgrid;
var BLSTgrid;
var sjstTempStore;
/* 变量视图中的根据传入的表名显示该表的字段，用于新建表或修改表*/
    
  
    Ext.define('tables', {
        extend: 'Ext.data.Model',
        fields: [
            'uuid',
            'setUuid',
            'keyword',
            'name', 
			'type',
			'modifyTime'
        ]
    });
	 var myStore = Ext.create('Ext.data.Store', {
		 model:'tables',
	     proxy: {
	         type: 'ajax',
	         url: '../../../work-platform/getTables.do',
	         reader: {
	             type: 'json',
	             root:'items'
	         }
	     },
	     autoLoad: true
	 }); 
   
   
 //三、定义Store  
   
   /*var getLocalStore = function() {  
       return Ext.create('Ext.data.ArrayStore', {  
           model: GPSInfoModel, 
           data: Ext.grid.dummyData  
       });  
   };  */