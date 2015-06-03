Ext.define('Project.view.ProjectTree',{
    extend: 'Ext.tree.Panel',
    alias : 'widget.projectTree',
    
    hideHeaders : true,
    mixins: {
        treeFilter: 'WMS.view.TreeFilter'
    },
    initComponent : function(){
    	var me = this;
    	me.rootVisible = false;
    	me.useArrows = true;
        /*me.tbar=[
                  { xtype: 'button', 
                	  text: '数据录入',
                	  handler :Project.App.getProjectTreeControllerController().btnShowTableArea },
                  { xtype: 'button', 
                	  text: '布局映射',
                	  handler :Project.App.getProjectTreeControllerController().btnShowLayoutArea
                	    }
                  ];*/
    	me.columns = [{
            xtype: 'treecolumn',
            dataIndex: 'value',
            width:50,
            flex: 0.8,
            editor: {
                xtype: 'textfield',
                selectOnFocus: true,
                allowOnlyWhitespace: false,
                listeners:{
                	'focus':function(item){
                		me.projectName=item.value;
                	},
                	'blur' : function(item,t,eopt){
                		var text = item.value;
                		var uuid = me.getSelectionModel().selected.getAt(0).get('uuid');
                		
                		if(!uuid){
                			return;
                		}
                		var flag=true;
                		Ext.Array.each(me.store.getRootNode().childNodes, function(project){
                    		if(text === project.get('text')&&uuid!==project.get('uuid')){
                    			flag= false;
                    			project.set('text',me.projectName);
                    			return;
                    		}
                    	});
                		if(!flag){
                			 Ext.MessageBox.alert('提示', '已存在该项目，请重新命名.');
                			 me.store.reload();
                		}else{
	                		Ext.Ajax.request({
	    			    		url: '../work-platform/saveProject.do',    
	    			    	    params: { 
	    			    	    	projectUuid : uuid,
	    			    	    	projectName : text
	    			    	    },    
	    			    	    success: function(response){ 
	    			    	    	me.store.reload();
	    			    	    }
	    			    	});
                		}
                		
                	}
                }
            }
        },{
            xtype: 'actioncolumn',
            width: 50,
            flex: 0.2,
            icon: 'dd/resources/images/delete.png',
            iconCls: 'x-hidden',
            tooltip: 'Delete',
            handler: Project.App.getController('ProjectTreeController').deleteProject
        }];
        
    	me.plugins = [
	        this.cellEditingPlugin = Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit : 2,
				errorSummary : false
			})
		];
    	
    	me.on('itemclick', function(){
    		window.frames[0].focus();
    	});
        
    	me.store = new Project.store.ProjectTreeStore();
        
    	me.store.on('load' ,function(){
        	var lastUuid = Project.Cookie.get('project');
        	var tree = Ext.getCmp('projectTree');
        	var store = tree.getStore();
        	var projectUuid;
        	
        	var i = Ext.Array.each(store.getRootNode().childNodes, function(project){
        		projectUuid = project.get('uuid');

        		if(lastUuid == projectUuid){
        			return false;
        		}
        	});
        	
        	if(projectUuid){
        		me.selectRow = Ext.isNumber(i)?i:store.getRootNode().childNodes.length-1;
        		me.selectProject = projectUuid;
        	}
        	Project.App.getProjectTreeControllerController().getProjectTree().getSelectionModel().select(me.selectRow);
        });
        
    	me.store.on('expand', function(){
    		new Ext.util.DelayedTask(function(){  
    			if(!me.selectProject){
            		return;
            	}
        		/*var sm=me.getSelectionModel( ) ;
        		sm.select(me.selectRow);*/
        		
//        		Ext.select('#projectTree tr[data-recordindex='+me.selectRow+']').addCls('x-grid-row-selected');
    			Project.App.getProjectTreeControllerController().getProjectTree().getSelectionModel().select(me.selectRow);
        		Ext.getCmp('projectTree').store.tree.root.findChildBy(function(node){
    				if(me.selectProject == node.get('uuid')){
    					document.title = node.get('value');
    				}
    			});
        		
        		if(IS_DATA_AREA){
	        		Ext.getCmp("dataArea").body.update(
	                    	'<iframe width="100%" height="100%" frameborder=0 src=factor.html?project='
	        								+me.selectProject+'></iframe>'
	                    		);
        		}else{
        			Ext.getCmp("layoutArea").body.update(
        					'<iframe width="100%" height="100%" frameborder=0 src=office.html?project='
        					+me.selectProject+'></iframe>'
        			);
        		}
        		Ext.getCmp('projectArea').collapse();
    		
    		}).delay(1000);  
    		
    	});
    	
    	me.store.getRootNode().expand();
    	me.tbar=Ext.Toolbar({  
            buttonAlign : 'center',  
            items : [{
            	xtype : 'textfield',
            	emptyText : '根据项目名检索项目...',
            	id:'project_filter_input',
            	width: 198,
            	listeners:{
            	           'change':function(e){
            	        	   var text=e.value;
            	        	   var by='text';
            	        	   Project.App.getProjectTreeControllerController().getProjectTree().filterBy(text,by);
            	           }
            	}
            }] 
        });
    	me.callParent(arguments);
    }
});