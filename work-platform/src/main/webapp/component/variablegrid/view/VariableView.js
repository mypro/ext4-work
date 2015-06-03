Ext.Loader.setConfig({enabled: true});

Ext.Loader.setPath('Ext.ux', 'examples/ux/');
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.tip.QuickTipManager',
    'Ext.ux.LiveSearchGridPanel'
]);
Ext.QuickTips.init();
Ext.define('VariableGrid.view.VariableView',{
    extend: 'Ext.ux.LiveSearchGridPanel',
    alias : 'widget.variableView',
    
    initComponent : function(){
    	var barId = this.id;
    	VARIABLE_GRID_ID=this.id;
    	TABLE_UUID=this.data.tblUuid;
    	var idPrefix = 'cmpt-variablegrid-'+barId+'_';
    	
    	this.store = Ext.create('VariableGrid.store.VariableGridStore', {
    		id : idPrefix+'variableStore'
        });
    	this.store.load({
			params:{
				uuid : TABLE_UUID
			}
		});
    	this.store.sort({
            property: 'seq',
            direction: 'ASC'
        });
    	
    	this.selType= 'checkboxmodel';
    	this.columnLines=true;
    	this.frame = true;
    	this.columns = [{
    		xtype: 'rownumberer',
    		width:40,
    		align:'center'
    	}, {
			header : 'uuid',
//			hideable : false,
//			hidden : true,
			dataIndex : 'uuid',
			width : 105
		}, {
			header : 'seq',
//			hideable : false,
//			hidden : true,
			dataIndex : 'seq',
			width : 105
		}, {
			header : '名称',
			align:'center',
			hideable : false,
			hidden : false,
			id:idPrefix+'keyword',
			renderer:function(dataIndex){
				dataIndex= dataIndex.substring(0,1).toUpperCase( ) +dataIndex.substring(1);
				return dataIndex;
			},
			dataIndex : 'keyword',
			width : 105,
			editor : {
				xtype : 'textfield',
				allowBlank : false
			}
		},
		/*------------------------变量类型--------------------------*/
		{
			header : '数据类型',
			id:idPrefix+'type',
			dataIndex : 'type',
			align:'center',
			width : 105,
			renderer : function(dataIndex) {
				return getTypeNameByUuid(dataIndex);
			},
			editor : {
				xtype : 'triggerfield',
				triggerCls : 'x-form-my-trigger',
				id : 'type',
				editable : false,
				onTriggerClick : this.callback.openDataTypeWin
			}
		}, 
		{
			header : '数据宽度',
			align:'center',
			id:idPrefix+'width',
			dataIndex : 'width',
			width : 105,
			editor : {
				xtype : 'numberfield',
				minValue : 0,
				maxValue : 255
			}
		}, {
			header : '小数位数',
			align:'center',
			id:idPrefix+'decimalWidth',
			dataIndex : 'decimalWidth',
			width : 105,
			editor : {
				xtype : 'numberfield',
				minValue : 0,
				maxValue : 255
			}
		}, {
			header : '名称标签',
			align:'center',
			id:idPrefix+'name',
			dataIndex : 'name',
			width : 105,
			editor : {
				xtype : 'textfield'
			}
		}, {
			id : 'dataValueName',
			align:'center',
			header : '值',
			id:idPrefix+'paramDefineName',
			dataIndex : 'paramDefineName',
//			renderer : function(dataIndex) {
//				return getParamNameByUuid('paramDefine', dataIndex);
//			},
			width : 105,
			editor : {
				xtype : 'triggerfield',
				triggerCls : 'x-form-my-trigger',
				id : 'datas',
				editable : false,
				onTriggerClick : this.callback.openValueWin
			}
		},{
			id : 'dataValue',
			align:'center',
			header : '索引',
			id:idPrefix+'paramDefine',
			dataIndex : 'paramDefine',
//			renderer : function(dataIndex) {
//				return getParamNameByUuid('paramDefine', dataIndex);
//			},
			width : 105/*,
			editor : {
				xtype : 'triggerfield',
				triggerCls : 'x-form-my-trigger',
				id : 'datas',
				editable : false,
				onTriggerClick : this.callback.openValueWin
			}*/
		}, {
			header : '缺失',
			align:'center',
			id:idPrefix+'missing',
			dataIndex : 'missing',
			width : 105,
			editor : {
				xtype : 'triggerfield',
				triggerCls : 'x-form-my-trigger',
				id : 'missing',
				editable : false,
				onTriggerClick : this.callback.openMissingWin
			}
		}, {
			header : '列',
			align:'center',
			id:idPrefix+'showWidth',
			dataIndex : 'showWidth',
			width : 105,
			editor : {
				xtype : 'numberfield'
			}
		},
		/*------------------------对齐方式--------------------------*/
		{
			header : '对齐',
			align:'center',
			id:idPrefix+'showAlign',
			dataIndex : 'showAlign',
			width : 105,
			renderer : function(dataIndex) {
				return getParamNameByUuid(PARAM_DEFINE_ALIGN, dataIndex);
			},
			editor : {
				xtype : 'combo',
//				store : Ext.create('VariableGrid.store.DataAlignStore'),
				store:getParamStore(PARAM_DEFINE_ALIGN),
				editable : false,
				emptyText : "请选择...",
				valueField : "uuid",
				displayField : "name",
				mode : 'remote',
				triggerAction : 'all',
				allowBlank : false,
				anchor : '95%'
			}
		},
		/*------------------------度量标准--------------------------*/
		{
			header : '度量标准',
			id:idPrefix+'metric',
			dataIndex : 'metric',
			align:'center',
			width : 105,
			renderer : function(dataIndex) {
				return getParamNameByUuid(PARAM_DEFINE_METRIC, dataIndex);
			},
			editor : {
				xtype : 'combo',
//				store : Ext.create('VariableGrid.store.DataMetricStore'),
				store:getParamStore(PARAM_DEFINE_METRIC),
				editable : false,
				emptyText : "请选择...",
				valueField : "uuid",
				displayField : "name",
				mode : 'remote',
				triggerAction : 'all',
				allowBlank : false,
				anchor : '95%'
			}
		},
		/*------------------------角色--------------------------*/
		{
			header : '角色',
			align:'center',
			id:idPrefix+'role',
			dataIndex : 'role',
			width : 105,
			renderer : function(dataIndex) {
				return getParamNameByUuid(PARAM_DEFINE_ROLE, dataIndex);
			},
			editor : {
				xtype : 'combo',
//				store : Ext.create('VariableGrid.store.DataRoleStore'),
				store : getParamStore(PARAM_DEFINE_ROLE),
				editable : false,
				emptyText : "请选择...",
				valueField : "uuid",
				displayField : "name",
				mode : 'remote',
				triggerAction : 'all',
				allowBlank : false,
				anchor : '95%'
			}
		}];
    	
    	this.plugins = [Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1,
			errorSummary : false
		}) ];
    	
    	this.callParent(arguments);
    }
    
});