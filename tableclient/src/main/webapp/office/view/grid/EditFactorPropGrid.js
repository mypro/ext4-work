Ext.define('Layout.view.grid.EditFactorPropGrid',{
	extend: 'EditGrid.view.EditGrid',
    alias : 'widget.editFactorPropGrid',
    mixins :['Layout.view.grid.CommonFactorGrid'],
    
    isAutoLoad : false,
    
    initComponent : function(){
    	var me = this;
    	
    	me.addEvents(
    			'afterLoadProperty'
    	);
    	
    	var store = new Layout.store.CommonPropStore({
		    groupField: 'prototype'
    	});
    	
    	var columns = [{
    						hideable : false,
    						hidden : true,
    						dataIndex : 'uuid'
    					}, {
    						header : '属性名',
    						hideable : false,
    						hidden : false,
    						dataIndex : 'name',
    						filter: {
    			                type: 'string'
    			            },
    						tdCls: this.nameColumnCls,
    		                innerCls: this.nameColumnInnerCls,
    						width : 80,
    					}, {
    						header : '属性值',
    						hideable : false,
    						hidden : false,
    						dataIndex : 'value',
    						isEdit : true,
    						editorListeners : {
    							'startedit' : Layout.EditFactorPropController
											.beginEdit,
    							'complete':Layout.EditFactorPropController
    										.completeEditProp
    						},
    						width : 105
    					}
    	];
    	
    	Ext.apply(me, { 
    		store : store,
    		columns : columns,
    		features: [{  
                ftype: 'filters',  
                encode: false, 
                local: true
            },{
                groupHeaderTpl: [
                                 '<div>{name:this.formatName}</div>',
                                 {
                                     formatName: function(name) {
                                         return name==1?'固有属性':'自定义属性';
                                     }
                                 }
                             ],
                ftype: 'grouping',
                startCollapsed:  false
            }]
    	});
        this.callParent(arguments);
    },
    
    getSelectType : function(){
    	return Layout.Select.TYPE_FACTOR_PROP;
    }
    

});