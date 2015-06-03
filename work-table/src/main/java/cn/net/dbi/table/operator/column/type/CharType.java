package cn.net.dbi.table.operator.column.type;

import java.sql.PreparedStatement;
import java.sql.SQLException;

import cn.net.dbi.boom.property.PropertyUtils;
import cn.net.dbi.boom.utils.NumberUtils;
import cn.net.dbi.table.ConstantInfo;
import cn.net.dbi.table.model.ColumnModel;
import cn.net.dbi.table.operator.column.ColumnType;
import cn.net.dbi.table.operator.column.ConstantSyntax;

public class CharType extends ColumnType {
	
	public CharType() {
	}
	
	public CharType(ColumnModel cm) {
		super(cm);
	}

	@Override
	public String getInsertSyntax() {
		int max = Integer.valueOf(PropertyUtils.getValue("mysql.varchar.width.max"));
		StringBuffer buf = new StringBuffer();
		if(NumberUtils.getInt(cm.getWidth())>max){
			buf.append(ConstantSyntax.TEXT);
		}else{
			buf.append(ConstantSyntax.VARCHAR);
			buf.append(ConstantInfo.PARENTHESIS_LEFT);
			buf.append(NumberUtils.getInt(cm.getWidth()));
			buf.append(ConstantInfo.PARENTHESIS_RIGHT);
		}
		return buf.toString();
	}

	public Object convert(Object src){
		if(src instanceof String){
			return src;
		}else{
			return src.toString();
		}
	}

	@Override
	public void setPreparedStatement(PreparedStatement ps, int i, Object val)
			throws SQLException {
		ps.setString(i, null==val?"":val.toString());
	}
}
