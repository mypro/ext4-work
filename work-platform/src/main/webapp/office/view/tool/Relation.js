Ext.define('Layout.view.tool.Relation',{
	extend: 'Ext.panel.Panel',
    alias : 'widget.relationTool',
    
    layout: 'absolute',
    width: 190,
    
    initComponent : function(){
    	var me = this;
    	
    	me.id = 'relationGroup';
    	var items = [{
	       		xtype: 'label',
			    text: '关系区域',
			    width:30,
			    style:{
			    	'font-weight':'bold'
			    },
			    x:10,
			    y:10
	       	},{
			    xtype: 'button',
			    text: '———>',
			    value: '3',
			    x:53,
			    y:2,
			    height:20,
			    margin: '0 0 0 0',
			    handler : Layout.TopTool.clickRelationShape
			},{
			    xtype: 'button',
			    text: '<———>',
			    value: '4',
			    width: 60,
			    x:120,
			    y:2,
			    height:20,
			    margin: '0 0 0 0',
			    handler : Layout.TopTool.clickRelationShape
			},{
			    xtype: 'button',
			    text: '<———',
			    value: '2',
			    x:53,
			    y:26,
			    height:20,
			    margin: '0 0 0 0',
			    handler : Layout.TopTool.clickRelationShape
			},{
			    xtype: 'button',
			    text: '————',
			    value: '1',
			    width: 60,
			    x:120,
			    y:26,
			    height:20,
			    margin: '0 0 0 0',
			    handler : Layout.TopTool.clickRelationShape
			}
//			,{
//				xtype :'button',
//	       	    text      : '更改关系',
//	       	    arrowAlign: 'right',
//	       	    x : 190,
//	       	    y : 10,
//	       	    width : 80,
//	       	    height : 40,
//	       	    menu : [
//	       	        {text:'——>', value: '3',listeners:
//	   	        		{
//	   	        			'click': Layout.TopTool.changeShape
//	   	        		}
//	       	        },
//	       	        {text:'<——', value: '2',listeners:
//	   	        		{
//	   	        			'click': Layout.TopTool.changeShape
//	   	        		}
//	       	        },
//	       	        {text:'———', value: '1',listeners:
//	   	        		{
//	   	        			'click': Layout.TopTool.changeShape
//	   	        		}
//	       	        },
//	       	        {text:'<—>', value: '4',listeners:
//	   	        		{
//	   	        			'click': Layout.TopTool.changeShape
//	   	        		}
//	       	        }
//	       	    ]
//	       	}
		];
    	
    	Ext.apply(me,{
    		items : items
    	});
    	me.callParent(arguments);
    }
});