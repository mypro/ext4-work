Ext.define('Layout.controller.SetChartController', {
    extend: 'Ext.app.Controller',
    refs : [{  
        selector: '#factorfcGrid',  
        ref: 'factorfcGrid'  
    },{
        selector: '#data-factor',  
        ref: 'datafactor'  
    },{  
        selector: '#datax-factorprop',  
        ref: 'dataxfactorprop'  
    },{
    	selector : '#datay-factorprop',
    	ref: 'datayfactorprop'
    }], 
    
    init: function() {
    	this.control({
            '#column_chart' : {
            	click : function(e){
            			Ext.getCmp('panel1').hide();
            			Ext.getCmp('panel2').show();
            		}
            },
            '#factorfcGrid' : {
            	'itemclick' : function  (view, record, item, index, e, eOpts){	
			            		
            					var text=record.get('name');
			                	e.preventDefault();
            					var tips=Ext.getCmp('tips');
            			    	if(tips){
            			    		tips.destroy( );
            			    	}
            			    	new Ext.menu.Menu({  
            			            floating : true,
            			            id:'tips',
            			            items : [{
            			           	 text : text,
            			           	 id:'tips-text'
            			            }]}).showAt([170,e.browserEvent.clientY-25]);
            			        var icons = Ext.DomQuery.select('.x-action-col-icon', node);
            			        if(view.getRecord(node).get('uuid') !='') {
            			            Ext.each(icons, function(icon){
            			                Ext.get(icon).removeCls('x-hidden');
            			            });
            			        }
            			        
            			        this.selectRow = rowIndex;
            				}
            	}
        
            
    	});
    },
    
    //显示菜单
    showActions: function(view, list, node, rowIndex, e) {//节点获得焦点显示删除图标
    	var text=list.get('value');
    	
    	e.preventDefault();
    	var tips=Ext.getCmp('tips');
    	if(tips){
    		tips.destroy( );
    	}
    	new Ext.menu.Menu({  
            floating : true,
            id:'tips',
            items : [{
           	 text : text,
           	 id:'tips-text'
            }]}).showAt([170,e.browserEvent.clientY-25]);
        var icons = Ext.DomQuery.select('.x-action-col-icon', node);
        if(view.getRecord(node).get('uuid') !='') {
            Ext.each(icons, function(icon){
                Ext.get(icon).removeCls('x-hidden');
            });
        }
        
        this.selectRow = rowIndex;
    },
    /**
     * 显示数据选择面板
     */
    showDatasetPanel : function(){
    	Ext.getCmp('panel1').hide();
		Ext.getCmp('panel2').show();
    },
    /**
     * 判断数组中是否有改元素
     */
    isContain : function(source ,find){
    	if(null == source || source == undefined){
    		return true;
    	}else{
    		for(var i= 0 ;i< source.length;i++){
    			if(source[i].id==find.id){
    				return true;
    			}
    		}
    		return false;
    	}
    	
    },
    setFactor  :  function(o, e, eOpts){
    	
    	var records = Layout.DrawController.getSelectRecord(),
    	 	grid = Ext.getCmp("factorfcGrid"),
    	 	store =grid.getStore();
    	 	
        Ext.Array.each(records, function(arr){
        	var model = Ext.create('Layout.model.CommonFactorModel',arr.record.data);
        	if(!Layout.SetChartController.isContain(store.data.items,model)){
            	 store.add(model);
             }
         });
    },
  
    /**
     * 显示生成的图形
     */
    showChartPanel : function(type){
    	Ext.getCmp('chartPanel').show();
    	switch(type){
    	case 1:
    		Layout.ChartFunc.showChart_column();
    		break;
    	case 2:
    		Layout.ChartFunc.showChart_pie();
    		break;
    	case 3:
    		Layout.ChartFunc.showChart_line();
    		break;
    	case 4:
    		Layout.ChartFunc.showChart_radar();
    		break;
    	case 5:
    		Layout.ChartFunc.showChart_stacked();
    		break;
    	case 6:
    		Layout.ChartFunc.showChart_scatter();
    		break;
    	case 7:
    		Layout.ChartFunc.showChart_bubble();
    		break;
    	case 8:
    		Layout.ChartFunc.showChart_pyramid();
    		break;
    	default:
    		break;
    	
    	}
    },
    
    
    
    
});