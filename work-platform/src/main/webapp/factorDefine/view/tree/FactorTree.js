Ext.define('Factor.view.tree.FactorTree',{
    extend: 'Ext.tree.Panel',
    alias : 'widget.factorTree',
    
    store : "FactorTreeStore",
    mixins: {
        treeFilter: 'WMS.view.TreeFilter'
    },
    initComponent : function(){
    	
        this.rootVisible = false;
        this.multiSelect =true;
        this.useArrows = true;
        this.enableDD = true;
        this.viewConfig = {
        		plugins: {  
                    ptype: 'treeviewdragdrop',  
                    dragGroup: 'factorDefineDDGroup'  
                }
        };
        this.tbar=Ext.Toolbar({  
            buttonAlign : 'center',  
            items : [{
            	xtype : 'textfield',
            	emptyText : '根据表名检索预定义属性...',
            	id:'filter_input',
            	width: 245,
            	listeners:{
            	           'change':function(e){
            	        	   var text=e.value;
            	        	   var by='text';
            	        	   Factor.App.getTreeFactorTreeControllerController().getFactorTree().filterBy(text,by);
            	           }
            	}
            }] 
        });
        this.callParent(arguments);
    }
});