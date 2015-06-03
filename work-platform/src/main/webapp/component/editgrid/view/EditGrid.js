Ext.define('EditGrid.view.EditGrid',{
	
    extend: 'Ext.grid.Panel',
    alias : 'widget.editGrid',
    
    inferTypes : true,
    valueField : "value",
    enableColumnMove : false,
	columnLines : true,
	stripeRows : false,
	trackMouseOver : false,
	clicksToEdit : 1,
	enableHdMenu : false,
	gridCls : Ext.baseCSSPrefix + 'property-grid',
    nameColumnCls: Ext.baseCSSPrefix + 'grid-property-name',
    nameColumnInnerCls: Ext.baseCSSPrefix + 'grid-cell-inner-property-name',
    
    textRenderFn : function(val){return val;},
    numberRenderFn : function(val){return val;},
    dateRenderFn : function(val){
    	if(typeof val === 'string'){
    		return val;
    	}
    	return Ext.Date.format(val,'Y-m-d');
    },
    
    initComponent : function(){
    	
    	var me = this;
    	
    	me.addCls(me.gridCls);
    	
    	me.plugins = me.plugins || [];
    	me.plugins.push(new Ext.grid.plugin.CellEditing({
            clicksToEdit: me.clicksToEdit
        }));
    	
    	me.selModel = {
                selType: 'cellmodel',
                onCellSelect: function(position) {
                	me.selectPosition = position;
                }
        };
    	
    	me.sourceConfig = Ext.apply({}, me.sourceConfig);  
    	
    	me.configure(me.sourceConfig);
    	
    	// set editor
    	if(me.isAutoLoad){
	    	me.store.load({
	    		scope: me,
	    		callback: function(){
	    			me.loadEditor.apply(this, arguments);
	    			if(me.loadCallback){
	    				me.loadCallback.apply(this, arguments);
	    			}
	    		},
	    	    params: me.loadParams
	    	});
    	}
    	
    	if(!me.columns){
    		throw new Error("please set columns ! ");
    	}
    	
    	Ext.Array.each(me.columns, function(column){
    		var me = this;
    		if(column.isEdit){
    			column.getEditor = Ext.Function.bind(me.getCellEditor, me);
    			column.renderer = Ext.Function.bind(me.renderCell, me);
    		}
    	}, me);
    	
    	me.editors = {
                'date'    : new Ext.grid.CellEditor({ field: new Ext.form.field.Date({selectOnFocus: true})}),
                'string'  : new Ext.grid.CellEditor({ field: new Ext.form.field.Text({selectOnFocus: true})}),
                'number'  : new Ext.grid.CellEditor({ field: new Ext.form.field.Number({selectOnFocus: true})}),
                'boolean' : new Ext.grid.CellEditor({ field: new Ext.form.field.ComboBox({
                    editable: false,
                    store: [[ true, 'true' ], [false, 'false' ]]
                })})
            };
    	
        this.callParent(arguments);
    },
    
    configure: function(config){
        var me = this,
            store = me.store,
            i = 0,
            len = me.store.getCount(),
            valueField = me.valueField,
            uuid, value, rec, type;
        
        if (me.inferTypes) {
            for (; i < len; ++i) {
                rec = store.getAt(i);
                uuid = rec.get("uuid");
                if (!me.getConfig(uuid, 'type')) {
                    value = rec.get(valueField);
                    if (Ext.isDate(value)) {
                        type = 'date';
                    } else if (Ext.isNumber(value)) {
                        type = 'number';
                    } else if (Ext.isBoolean(value)) {
                        type = 'boolean';
                    } else {
                        type = 'string';
                    }
                    me.setConfig(uuid, 'type', type);
                }
            }
        }
    },
    
    getConfig: function(uuid, key, defaultValue) {
        var config = this.sourceConfig[uuid],
            out;
            
        if (config) {
            out = config[key];
        }    
        return out || defaultValue;
    },
    
    setConfig: function(uuid, key, value) {
        var sourceCfg = this.sourceConfig,
            o = sourceCfg[uuid];
            
        if (!o) {
            o = sourceCfg[uuid] = {
                __copied: true
            };
        } else if (!o.__copied) {
            o = Ext.apply({
                __copied: true
            }, o);
            sourceCfg[uuid] = o;
        }
        o[key] = value;
        return value;
    },
    
    copyLegacyObject: function(config, o, keyName){
        var key, value;
        
        for (key in o) {
            if (o.hasOwnProperty(key)) {
                if (!config[key]) {
                    config[key] = {};
                }
                config[key][keyName] = o[key];
            }    
        }
    },
    
    loadEditor : function(records, operation, success) {
		var customEditors = {};
		
		Ext.Array.each(records, function(record){
			var uuid = record.get("uuid");
			customEditors[uuid] = [];
			Ext.Array.each(this.columns, function(column){
				if(!column.hidden){
					var editor = column.isEdit ?
							this.getCellEditorByDatatype(record):null;
					if(editor){
						editor.listeners = column.editorListeners; 
					}
					customEditors[uuid].push(editor);
				}
			}, this);
		}, this);
		
		this.copyLegacyObject(this.sourceConfig, customEditors, 'editor');
    },
    
    getCellRenderByDatatype : function(record){
    	if(record.get('valueLabelUuid')){
    		var labels = ValueLabel.App.getController('ValueLabelController').
    					getValueLabel(record.get('valueLabelUuid'));
    		
    		return function(val){
    			var i = Ext.Array.each(labels, function(item){
    				if(item.value == val){
    					return false;
    				}
    			});
    			if(Ext.isNumber(i)){
    				return labels[i].label;
    			}
    			return val;
    		};
    	}
    	
    	switch(parseInt(record.get('dataType'))){
    	case 2:
    		return this.textRenderFn;
    	case 3:
    		return this.dateRenderFn;
    	default:
    		return this.numberRenderFn;
    	}
    },
    
    getCellEditorByDatatype : function(record){
    	
    	if(record.get('valueLabelUuid')){
    		
			var combo = new Ext.form.field.ComboBox({
                displayField :'label',
                valueField :'value',
                queryMode: 'local'
            });
			
			ValueLabel.App.getController('ValueLabelController').
				getValueLabel(record.get('valueLabelUuid'), function(response){
					this.valueLableCache[record.get('valueLabelUuid')] = Ext.decode(response.responseText);
					var labels = this.valueLableCache[record.get('valueLabelUuid')];
					var data = [];
					
					Ext.Array.each(labels, function(item){
						data.push({
							value:item.value,
							label:item.label
						});
					});
					
					store = Ext.create('Ext.data.Store', {
						fields: ['value', 'label'],
		    		     data : data
		    		});
					
					combo.bindStore(store);
				});
			
			return combo;
    	}
    	
    	var datatype = record.get("dataType");
    	
    	switch(parseInt(datatype)){
    	case 2:
    		return new Ext.form.field.Text();
    	case 3:
    		return new Ext.form.field.Date({format: 'Y-m-d'});
    	default:
//    		if(FACTORDEFINE_FACTOR_COLOR === record.get('defineUuid')
//    				|| FACTORDEFINE_RELATION_COLOR === record.get('defineUuid')){
//    			return new Ext.form.field.ColorField({
//    					defaultColor : !record.get("value") ? '0xFFFFFF':
//    						parseInt(record.get("value")).toString(16)
//    			});
//    		}else{
    			return new Ext.form.field.Number();
//    		}
    	}
    },
    
    renderCell : function(val,cell,record,row,column){
    	var renderFn = this.getCellRenderByDatatype(record);
    	return renderFn.apply(this, arguments);;
    },
    
    getCellEditor : function(record) {
        var me = this,
            position = me.selectPosition,
            uuid = record.get('uuid'),
            val = record.get(me.valueField),
            editor = me.getConfig(uuid, 'editor')[position.column],
            type = me.getConfig(uuid, 'type'),
            editors = me.editors;

        
        
        if (editor) {
            if (!(editor instanceof Ext.grid.CellEditor)) {
                if (!(editor instanceof Ext.form.field.Base)) {
                    editor = Ext.ComponentManager.create(editor, 'textfield');
                }
                var listeners = editor.listeners;
                editor = new Ext.grid.CellEditor({field: editor });
                if(listeners){
	                Ext.iterate(editor.events, function(event){
	                	if(listeners[event]){
	                		editor.on(event, listeners[event]);
	                	}
	                });
                }
                me.getConfig(uuid, 'editor')[position.column] = editor;
            }
        } else if (type) {
            switch (type) {
                case 'date':
                    editor = editors.date;
                    break;
                case 'number':
                    editor = editors.number;
                    break;
                case 'boolean':
                    editor = me.editors['boolean'];
                    break;
                default:
                    editor = editors.string;
            }
        } else if (Ext.isDate(val)) {
            editor = editors.date;
        } else if (Ext.isNumber(val)) {
            editor = editors.number;
        } else if (Ext.isBoolean(val)) {
            editor = editors['boolean'];
        } else {
            editor = editors.string;
        }
        
        editor.editorId = uuid;
        return editor;
    },

    beforeDestroy: function() {
        var me = this;
        me.callParent();
        me.destroyEditors(me.editors);
        me.destroyEditors(me.customEditors);
    },

    destroyEditors: function (editors) {
        for (var ed in editors) {
            if (editors.hasOwnProperty(ed)) {
                Ext.destroy(editors[ed]);
            }
        }
    }

});



/**
 * color field component
 */
Ext.define('Ext.form.field.ColorField', {
	extend: 'Ext.form.field.Trigger',  
    /**
     * @cfg {Boolean} showHexValue
     * True to display the HTML Hexidecimal Color Value in the field
     * so it is manually editable.
     */
    showHexValue : false,
    
    /**
     * @cfg {String} triggerClass
     * An additional CSS class used to style the trigger button.  The trigger will always get the
     * class 'x-form-trigger' and triggerClass will be <b>appended</b> if specified (defaults to 'x-form-color-trigger'
     * which displays a calendar icon).
     */
    triggerClass : 'x-form-color-trigger',
    
    /**
     * @cfg {String/Object} autoCreate
     * A DomHelper element spec, or true for a default element spec (defaults to
     * {tag: "input", type: "text", size: "10", autocomplete: "off"})
     */
    // private
    defaultAutoCreate : {tag: "input", type: "text", size: "10",
                         autocomplete: "off", maxlength:"6"},
    
    /**
     * @cfg {String} lengthText
     * A string to be displayed when the length of the input field is
     * not 3 or 6, i.e. 'fff' or 'ffccff'.
     */
    lengthText: "Color hex values must be either 3 or 6 characters.",
    
    //text to use if blank and allowBlank is false
    blankText: "Must have a hexidecimal value in the format ABCDEF.",
    
    /**
     * @cfg {String} color
     * A string hex value to be used as the default color.  Defaults
     * to 'FFFFFF' (white).
     */
    defaultColor: 'FFFFFF',
    
    maskRe: /[a-f0-9]/i,
    // These regexes limit input and validation to hex values
    regex: /[a-f0-9]/i,
 
    //private
//    curColor: 'ffffff',
    initComponent:function(){   
    	this.callParent(arguments);  
        this.addEvents('click','change', 'select');  
    },        
    onChange: function (field, newVal, oldVal) {
    },
    onRender : function(ct, position){
    	this.callParent(arguments); 
        this.handleRender();
    },
    // private
    validateValue : function(value){
    	console.log('validateValue:'+value);
        this.setColor(value);
        return true;
    },
 
    // private
    validateBlur : function(){
        return !this.menu || !this.menu.isVisible();
    },
    
    // Manually apply the invalid line image since the background
    // was previously cleared so the color would show through.
    markInvalid : function( msg ) {
        Ext.form.ColorField.superclass.markInvalid.call(this, msg);
        this.el.setStyle({
            'background-image': 'url(../lib/resources/images/default/grid/invalid_line.gif)'
        });
    },
 
    /**
     * Returns the current color value of the color field
     * @return {String} value The hexidecimal color value
     */
    getValue : function(){
    	console.log('getValue '+this.curColor);
        return this.curColor;
    },
 
    /**
     * Sets the value of the color field.  Format as hex value 'FFFFFF'
     * without the '#'.
     * @param {String} hex The color value
     */
    setValue : function(hex){
        this.callParent(arguments); 
        this.setColor(hex);
        console.log('setValue '+hex);
    },
    
    /**
     * Sets the current color and changes the background.
     * Does *not* change the value of the field.
     * @param {String} hex The color value.
     */
    setColor : function(hex) {
        this.curColor = '0x'+hex;
        console.log('this.curColor '+this.curColor);
    },
    
    handleRender: function() {
        this.setDefaultColor();
    },
    
    setDefaultColor : function() {
        this.setValue(this.defaultColor.substring(2,this.defaultColor.length));
    },
 
    // private
    menuListeners : {
        select: function(m, d){
            this.setValue(d);
        },
        show : function(){ // retain focus styling
            this.onFocus();
            Ext.get(this.menu.id).setLocalXY(this.x,this.y);
        },
        hide : function(){
            this.focus();
            var ml = this.menuListeners;
            this.menu.un("select", ml.select,  this);
            this.menu.un("show", ml.show,  this);
            this.menu.un("hide", ml.hide,  this);
        }
    },
    
    //private
    handleSelect : function(palette, selColor) {
        this.setValue(selColor);
        this.fireEvent("click", this, selColor);        
        this.fireEvent("change", this, selColor);        
        this.fireEvent("select", this, selColor); 
    },
 
    // private
    // Implements the default empty TriggerField.onTriggerClick function to display the ColorPicker
    onTriggerClick : function(e){
        if(this.disabled){
            return;
        }
        if(this.menu == null){
            this.menu = new Ext.menu.ColorPicker();
            this.menu.on('select', this.handleSelect, this );
        }
        this.menu.on(Ext.apply({}, this.menuListeners, {
            scope:this
        }));
        this.menu.show(this.el, "tl-bl?");
        this.x = e.browserEvent.clientX;
        this.y = e.browserEvent.clientY;
    }
});