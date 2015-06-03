Ext.define('Layout.chart.Line', {
	extend : 'Layout.chart.CommonChart',

	animate : true,
	shadow : true,
	legend : {
		position : 'right'
	},
	insetPadding : 60,
	theme : 'Base:gradients',

	initComponent : function() {
		var me = this, valueFields = me.valueFields;
		if (valueFields.length > 1) {
			me.axes = [];
			Ext.Array.each(valueFields, function(field, index) {
				if (index == 0) {
					me.axes.push({
						type : 'Numeric',
						position : 'bottom',
						fields : [ field ],
						title : field,
						grid : true,
						minimum : 0

					});
				} else {
					me.axes.push({
						type : 'Numeric',
						position : 'left',
						fields : [ field ],
						title : field,
						grid : true,
						minimum : 0

					});
				}
			});

			me.series = [ {
				type : 'line',
				markerConfig : {
					type : 'cross',
					radius : 3,
					size : 5
				},
				tips : {
					trackMouse : false,
					width : 150,
					height : 28,
					renderer : function(storeItem, item) {
						this.setTitle(storeItem.get('name') + ': '
								+ storeItem.get(valueFields[0]) + ' '
								+ storeItem.get(valueFields[1]));
					}
				},
				axis : 'left',
				xField : valueFields[0],
				yField : valueFields[1]
			} ];
		} else {
			me.axes = [ {
				type : 'Numeric',
				minimum : 0,
				position : 'left',
				fields : valueFields,
				minorTickSteps : 1,
				grid : {
					odd : {
						opacity : 1,
						fill : '#ddd',
						stroke : '#bbb',
						'stroke-width' : 0.5
					}
				}
			}, {
				type : 'Category',
				position : 'bottom',
				fields : [ 'name' ],
				title : ''
			} ];
			me.series =[];
			Ext.Array.each(valueFields, function(field) {
				me.series.push({
					type : 'line',
					highlight : {
						size : 7,
						radius : 7
					},
					axis : 'left',
					xField : 'name',
					yField : field,
					markerConfig : {
						type : 'cross',
						size : 4,
						radius : 4,
						'stroke-width' : 0
					},
					tips : {
						trackMouse : true,
						width : 100,
						height : 28,
						renderer : function(storeItem, item) {
							this.setTitle(storeItem.get('name') + ': '
									+ storeItem.get(field));
						}
					}
				}

				);
			});
		}

		me.callParent(arguments);
	}
});