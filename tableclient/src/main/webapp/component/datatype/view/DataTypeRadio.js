Ext.define('DataType.view.DataTypeRadio',{
    extend: 'Ext.form.RadioGroup',
    alias : 'widget.dataTypeRadio',
    
    initComponent : function(){
    		
            this.columns = 1;
            this.x = 5;
            this.y = 0;
            this.layout = 'vbox';
            this.items = [
                    {boxLabel: '数值(N)', 				name: this.idPrefix+'type',inputValue: COLUMNTYPE_DECIMAL, checked: true},
                    {boxLabel: '逗号(C)',					name: this.idPrefix+'type',inputValue: COLUMNTYPE_COMMA},
                    {boxLabel: '点(D)',					name: this.idPrefix+'type',inputValue: COLUMNTYPE_POINT},
                    {boxLabel: '科学计数法(S)',				name: this.idPrefix+'type',inputValue: COLUMNTYPE_SCIENTIFIC},
                    {boxLabel: '日期(A)', 				name: this.idPrefix+'type',inputValue: COLUMNTYPE_DATE_1},
                    {boxLabel: '美元(L)',					name: this.idPrefix+'type',inputValue: COLUMNTYPE_DOLLAR},
                    {boxLabel: '设定货币(U)', 				name: this.idPrefix+'type',inputValue: COLUMNTYPE_CURRENCY},
                    {boxLabel: '字符串(R)',				name: this.idPrefix+'type',inputValue: COLUMNTYPE_CHAR},
                    {boxLabel: '受限数值(具有前导零的整数)(E)',	name: this.idPrefix+'type',inputValue: COLUMNTYPE_LIMIT}
            ];
            
            this.callParent(arguments);
    }
});