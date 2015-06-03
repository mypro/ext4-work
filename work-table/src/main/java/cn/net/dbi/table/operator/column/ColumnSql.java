package cn.net.dbi.table.operator.column;

import cn.net.dbi.boom.utils.NumberUtils;
import cn.net.dbi.table.ConstantInfo;
import cn.net.dbi.table.model.ColumnModel;

public class ColumnSql {
	
	private ColumnModel cm;
	
	private ColumnType columnType;

	public ColumnSql(ColumnModel cm) {
		this.cm = cm;
		this.columnType = ColumnType.getColumnType(cm);
	}
	
	/**
	 * 生成语法类似：  
	 *   name   varchar(20)     
	 * or
	 *   age    decimal(3,0)
	 * or
	 *   order  decimal(10)  unique
	 * 
	 * @return
	 */
	public String getInsertSyntax(){
		StringBuffer b = new StringBuffer();
		b.append(cm.getKeyword());
		b.append(ConstantInfo.BLANK);
		b.append(this.columnType.getInsertSyntax());
		b.append(ConstantInfo.BLANK);
		if(0!=NumberUtils.getInt(cm.getIsUnique())){
			b.append(ConstantSyntax.UNIQUE);
		}
		b.append(ConstantInfo.BLANK);
		return b.toString();
	}
	
}
