Ext.define('DataGrid.view.DataView',{
    extend: 'Ext.grid.Panel',
    alias : 'widget.dataView',
    
    initComponent : function(){
    	var barId = this.id;
    	var idPrefix = 'cmpt-variablegrid-'+barId+'_';
    	
    	this.store = Ext.create('VariableGrid.store.VariableGridStore', {
    		id : idPrefix+'variableStore'
        });
    	this.columnLines=true;
    	this.columns = [Ext.create('Ext.grid.RowNumberer'), {
			header : 'uuid',
			hideable : false,
			hidden : true,
			dataIndex : 'uuid',
			width : 105,
			editor : {
				xtype : 'textfield',
				allowBlank : false
			}
		}, {
			header : '名称',
			align:'center',
			hideable : false,
			hidden : false,
			id:idPrefix+'keyword',
			dataIndex : 'keyword',
			width : 105,
			editor : {
				xtype : 'textfield',
				allowBlank : false
			}
		},
		/*------------------------变量类型--------------------------*/
		{
			header : '类型',
			id:idPrefix+'type',
			dataIndex : 'type',
			align:'center',
			width : 105,
			renderer : function(dataIndex) {
				return getTypeNameByUuid(dataIndex);
			},
			editor : {
				xtype : 'triggerfield',
				triggerCls : 'background-image: url(dbi/images/form/test.gif) !important;',
				id : 'type',
				editable : false,
				onTriggerClick : this.callback.openDataTypeWin
			}
		}, 
		{
			header : '宽度',
			align:'center',
			id:idPrefix+'width',
			dataIndex : 'width',
			width : 105,
			editor : {
				xtype : 'numberfield',
				minValue : 1,
				maxValue : 255
			}
		}, {
			header : '小数',
			align:'center',
			id:idPrefix+'decimalWidth',
			dataIndex : 'decimalWidth',
			width : 105,
			editor : {
				xtype : 'numberfield',
				minValue : 1,
				maxValue : 255
			}
		}, {
			header : '标签',
			align:'center',
			id:idPrefix+'name',
			dataIndex : 'name',
			width : 105,
			editor : {
				xtype : 'textfield',
				allowBlank : false
			}
		}, {
			id : 'dataValue',
			align:'center',
			header : '值',
			id:idPrefix+'paramDefine',
			dataIndex : 'paramDefine',
			/*renderer : function(dataIndex) {
				return getParamNameByUuid('paramDefine', dataIndex);
			},*/
			width : 105,
			editor : {
				xtype : 'triggerfield',
				triggerCls : 'x-form-my-trigger',
				id : 'datas',
				editable : false,
				onTriggerClick : this.callback.openValueWin
			}
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
				xtype : 'numberfield',
				allowBlank : false
			}
		},
		/*------------------------对齐方式--------------------------*/
		{
			header : '对齐',
			align:'center',
			id:idPrefix+'showAlign',
			dataIndex : 'showAlign',
			width : 105,
//			renderer : function(dataIndex) {
//				return getParamNameByUuid(PARAM_DEFINE_ALIGN, dataIndex);
//			},
			editor : {
				xtype : 'combo',
				store : Ext.create('VariableGrid.store.DataAlignStore'),
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
//			renderer : function(dataIndex) {
//				return getParamNameByUuid(PARAM_DEFINE_METRIC, dataIndex);
//			},
			editor : {
				xtype : 'combo',
				store : Ext.create('VariableGrid.store.DataMetricStore'),
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
//			renderer : function(dataIndex) {
//				return getParamNameByUuid(PARAM_DEFINE_ROLE, dataIndex);
//			},
			editor : {
				xtype : 'combo',
				store : Ext.create('VariableGrid.store.DataRoleStore'),
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