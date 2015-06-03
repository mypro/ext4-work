package cn.net.dbi.table.operator.column;

import java.sql.PreparedStatement;
import java.sql.SQLException;

import cn.net.dbi.boom.utils.NumberUtils;
import cn.net.dbi.table.ConstantInfo;
import cn.net.dbi.table.DataTypeConstantInfo;
import cn.net.dbi.table.model.ColumnModel;
import cn.net.dbi.table.operator.column.type.CharType;
import cn.net.dbi.table.operator.column.type.DateType;
import cn.net.dbi.table.operator.column.type.DecimalType;

public abstract class ColumnType {
	
	protected ColumnModel cm;
	
	public ColumnType(){
	}
	
	public ColumnType(ColumnModel cm){
		this.cm = cm;
	}

	abstract public String getInsertSyntax(); 
	
	abstract public Object convert(Object src);
	
	abstract public void setPreparedStatement(PreparedStatement ps, int i, Object val) throws SQLException;
	
	/**
	 * 获取不同字段类型的实例
	 */
	public static ColumnType getColumnType(ColumnModel cm){
		
		String type = cm.getType();
		if(DataTypeConstantInfo.COLUMNTYPE_DECIMAL.equals(type)
				||DataTypeConstantInfo.COLUMNTYPE_POINT.equals(type)
				||DataTypeConstantInfo.COLUMNTYPE_COMMA.equals(type)
				||DataTypeConstantInfo.COLUMNTYPE_CURRENCY.equals(type)
				||DataTypeConstantInfo.COLUMNTYPE_DOLLAR.equals(type)
				||DataTypeConstantInfo.COLUMNTYPE_SCIENTIFIC.equals(type)
				||DataTypeConstantInfo.COLUMNTYPE_LIMIT.equals(type)){
			return new DecimalType(cm);
		}else if(DataTypeConstantInfo.COLUMNTYPE_DATE_1.equals(type)
				||DataTypeConstantInfo.COLUMNTYPE_DATE_2.equals(type)
				||DataTypeConstantInfo.COLUMNTYPE_DATE_3.equals(type)
				||DataTypeConstantInfo.COLUMNTYPE_DATE_4.equals(type)
				||DataTypeConstantInfo.COLUMNTYPE_DATE_5.equals(type)){
			return new DateType(cm);
		}else if(DataTypeConstantInfo.COLUMNTYPE_CHAR.equals(type)){
			return new CharType(cm);
		}else{
			return new DecimalType(cm);
		}
	}
	
	public static ColumnType getColumnType(int type){
		switch (type) {
		case 1:
			return new DecimalType();
		case 2:
			return new CharType();
		case 3:
			return new DateType();
		default:
			return new DecimalType();
		}
	}
}
