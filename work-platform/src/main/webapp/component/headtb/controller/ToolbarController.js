Ext.define('Toolbar.controller.ToolbarController', {
    extend: 'Ext.app.Controller',
    stores: [
    ],
    models: [
    ],
    
    init: function() {
    	this.control({
    		'toolbarView button[action=new]' : {
            	click:  this.newSth
            },
            'toolbarView button[action=save]' : {
            	click:  this.save
            },
            'toolbarView button[action=add]' : {
            	click:  this.add
            },
            'toolbarView button[action=insert]' : {
            	click:  this.insert
            },
            'toolbarView button[action=remove]' : {
            	click:  this.remove
            },
            'toolbarView button[action=import]' : {
            	click:  this.import
            },
            'toolbarView button[action=export]' : {
            	click:  this.exportExcel
            }
        });
    },
    newSth:function(btn){
    	var toolbar = btn.up('toolbar');
    	if(toolbar.callback && toolbar.callback.save){
    		toolbar.callback.newSth.call(toolbar, toolbar,btn);
    	}
    },
    save:function(btn){
    	var toolbar = btn.up('toolbar');
    	if(toolbar.callback && toolbar.callback.save){
    		toolbar.callback.save.call(toolbar, toolbar,btn);
    	}
    },
    add:function(btn){
    	var toolbar = btn.up('toolbar');
    	if(toolbar.callback && toolbar.callback.save){
    		toolbar.callback.add.call(toolbar, toolbar);
    	}
    },
    insert:function(btn){
    	var toolbar = btn.up('toolbar');
    	if(toolbar.callback && toolbar.callback.save){
    		toolbar.callback.insert.call(toolbar, toolbar);
    	}
    },
    remove:function(btn){
    	var toolbar = btn.up('toolbar');
    	if(toolbar.callback && toolbar.callback.save){
    		toolbar.callback.remove.call(toolbar, toolbar);
    	}
    },
    import:function(btn){
    	var toolbar = btn.up('toolbar');
    	if(toolbar.callback && toolbar.callback.save){
    		toolbar.callback.import.call(toolbar, toolbar);
    	}
    },exportExcel:function(btn){
    	var toolbar = btn.up('toolbar');
    	if(toolbar.callback && toolbar.callback.save){
    		toolbar.callback.exportExcel.call(toolbar, toolbar);
    	}
    },
    /** 获取ext所属父组件的前缀ID
     * @param parentId   
     * @returns
     */
    getPrefix : function(parentId){
    	if(typeof parentId === "object"){
    		parentId = parentId.id;
    	}
    	var prefix = parentId.substring(0,parentId.indexOf('_')+1);
    	if(!prefix){
    		prefix = 'cmpt-datatype-'+parentId+'_';
    	}
    	return prefix;
    },
    
});