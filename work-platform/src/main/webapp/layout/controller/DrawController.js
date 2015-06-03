Ext.define('Layout.controller.DrawController', {
    extend: 'Ext.app.Controller',
    
    stores: [
             "CommonFactorStore"
    ],
    
    refs : [{  
        selector: '#factorPropEditGrid',  
        ref: 'factorPropEditGrid'  
    },{
    	selector : '#factor-tab',
    	ref: 'factorTab'
    },{
    	selector : '#relationGrid',
    	ref: 'relationGrid'
    },{
    	selector : '#drawPanel',
    	ref: 'drawPanel'
    },{
    	selector : '#westArea',
    	ref: 'westArea'
    },{
    	selector : '#northArea',
    	ref: 'northArea'
    }],
    
    init: function() {
    	this.control({
    		'#drawPanel' : {
//    			'afterlayout':this.initDrawPaper,
    			'afterrender':function(){console.log('afterrender')}
    		}
    	});
    	
    },
    
    initDrawPaper : function(panel){
		var id = panel.id;
		Ext.Array.each(Ext.get(id+'-body').el.dom.childNodes, function(child,i){
			Ext.get(id+'-body').el.dom.removeChild(child);
		});
		$('#'+id+'-body').unbind("mousedown");
		var me = this;
		me.graph = new joint.dia.Graph;
		if(me.paper){
			me.paper.svg.remove();
		}
    	me.paper = new joint.dia.Paper({
    	    el: $('#'+id+'-body'),
    	    width: 1200,
    	    height: 900,
    	    gridSize: 1,
    	    model: me.graph
    	});
	},
	
	dragRelationFromBase : function(target,e){
		console.log(arguments);
		var trDom = this.getEl(),
			uuid = trDom.getAttribute('data-recordid'),
			row = trDom.getAttribute('data-recordindex'),
			me = Layout.App.getController('DrawController'),
			x = e.xy[0]-me.getWestArea().width,
			y = e.xy[1]-me.getNorthArea().height,
			dataStore = this.grid.getStore(),
			record = Ext.clone(dataStore.getAt(row)),
			poolController = Layout.App.getController('PoolFactorController');
		
		// 判断该因子是否已加入pool
		if(poolController.relationStore.contain(uuid)){
			console.log('relation has been in pool already!');
			return;
		}
		
		// 判断两个因子是否都已经存在
		var isFactor1Exist = poolController.factorStore.contain(record.get('factor1Uuid'));
		var isFactor2Exist = poolController.factorStore.contain(record.get('factor2Uuid'));
		
		if(!isFactor1Exist){
			Layout.FactorOperator.readFactor(record.get('factor1Uuid'), function(response){
				var factor = Ext.decode(response.responseText)[0];
				
				var record = new Layout.model.CommonFactorModel();  
				Ext.apply(record.data, factor);
				
				if(isFactor2Exist){
					record.setX(x);
					record.setY(y);
				}else{
					record.setX(x<100?0:x-100);
					record.setY(y);
				}
				
				poolController.factorStore.add(record);
			}, true, true);
		}
		
		if(!isFactor2Exist){
			Layout.FactorOperator.readFactor(record.get('factor2Uuid'), function(response){
				var factor = Ext.decode(response.responseText)[0];
				
				var record = new Layout.model.CommonFactorModel();  
				Ext.apply(record.data, factor);
				
				if(isFactor1Exist){
					record.setX(x);
					record.setY(y);
				}else{
					record.setX(x+100);
					record.setY(y);
				}
				
				poolController.factorStore.add(record);
			}, true, true);
		}
		
		// add relation
		Layout.FactorOperator.readRelation(uuid, function(response){
			var relation = Ext.decode(response.responseText)[0];
			
			var record = new Layout.model.RelationModel();  
			Ext.apply(record.data, relation);
			
			poolController.relationStore.add(record);
		}, true);
		
	},
	
	dragFactorFromBase : function(target,e){
		console.log(arguments);
		var trDom = this.getEl().parentNode,
			uuid = trDom.getAttribute('data-recordid'),
			row = trDom.getAttribute('data-recordindex'),
			me = Layout.App.getController('DrawController'),
			x = e.xy[0]-me.getWestArea().width,
			y = e.xy[1]-me.getNorthArea().height,
			dataStore = this.grid.getStore(),
			record = Ext.clone(dataStore.getAt(row)),
			poolController = Layout.App.getController('PoolFactorController');
		
		// 判断该因子是否已加入pool
		if(poolController.factorStore.contain(uuid)){
			console.log('factor has been in pool already!');
			return;
		}
		
		// 判断是否存在同名因子
		if(poolController.factorStore.findRecordByKey('name', record.get('name'))){
			console.log('factor name duplicate!');
			return;
		}
		
		Layout.FactorOperator.readFactor(uuid, function(response){
			var factor = Ext.decode(response.responseText)[0];
			
			var record = new Layout.model.CommonFactorModel();  
			Ext.apply(record.data, factor);
			
			record.setX(x);
			record.setY(y);
			
			poolController.factorStore.add(record);
		}, true);
	}
    
});