Ext.define('Layout.view.grid.EditRelationPropGrid',{
	
    extend: 'EditGrid.view.EditGrid',
    alias : 'widget.editRelationPropGrid',
    mixins :['Layout.view.grid.CommonFactorGrid'],
    
    isAutoLoad : false,
    
    initComponent : function(){
    	var me = this;
    	
    	me.store = new Layout.store.CommonPropStore({
    	    groupField: 'prototype'
    	});
    	
    	me.addEvents(
                'clickRelation'
            );
    	
    	me.columns = [{
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
    						width : 80
    					}, {
    						header : '属性值',
    						hideable : false,
    						hidden : false,
    						dataIndex : 'value',
    						isEdit : true,
    						editorListeners : {
    							'startedit' : Layout.EditRelationPropController
											.beginEdit,
    							'complete':Layout.EditRelationPropController
    										.completeEditProp
    						},
    						width : 105
    					}
    	];
    	
    	Ext.apply(me, { 
    		features: [{  
                ftype: 'filters',  
                encode: false, 
                local: true
            },{
                groupHeaderTpl: [
                                 '<div>{name:this.formatName}</div>',
                                 {
                                     formatName: function(name) {
                                         return name==2?'固有属性':'自定义属性';
                                     }
                                 }
                             ],
                ftype: 'grouping'
            }]
    	});
        this.callParent(arguments);
    },
    
	getSelectType : function(){
		return Layout.Select.TYPE_RELATION_PROP;
	}
});