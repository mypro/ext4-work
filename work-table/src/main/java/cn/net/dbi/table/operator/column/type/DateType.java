package cn.net.dbi.table.operator.column.type;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Date;

import cn.net.dbi.boom.utils.DateUtils;
import cn.net.dbi.table.model.ColumnModel;
import cn.net.dbi.table.operator.column.ColumnType;
import cn.net.dbi.table.operator.column.ConstantSyntax;

public class DateType extends ColumnType{
	
	public DateType() {
	}
	
	public DateType(ColumnModel cm) {
		super(cm);
	}

	@Override
	public String getInsertSyntax() {
		return ConstantSyntax.DATETIME;
	}

	public Object convert(Object src){
		if(src instanceof Date){
			return src;
		}else if(src instanceof String){
			return DateUtils.tryConverStr2Date((String)src); 
		}
		return null;
	}

	@Override
	public void setPreparedStatement(PreparedStatement ps, int i, Object val)
			throws SQLException {
		java.sql.Date date = null;
		if(val instanceof Date){
			date = new java.sql.Date(((Date) val).getTime());
		}else if(val instanceof String){
			date =  new java.sql.Date(DateUtils.tryConverStr2Date((String)val).getTime());
		}
		ps.setDate(i, date);
	}
	
}
