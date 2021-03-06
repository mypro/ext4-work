//显示参数
Ext.define('ValueLabel.store.ParamStore', {
    extend: 'Ext.data.Store',
    alias : 'widget.paramStore',
    
    model : 'ValueLabel.model.ValueLabelModel',
    
	autoLoad: false,

    proxy: {
        type: 'ajax',
        url :'../../../work-platform/queryParamsByDefineUUid.do',//此时留出tbl=是为了到时候修改表用的，如果要修改某给表的设计，可以传进来然后取出已有的字段
        reader: {
            type: 'json'
        }
    }
});