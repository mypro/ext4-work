package cn.net.dbi.table.operator.column.type;

import java.sql.PreparedStatement;
import java.sql.SQLException;

import net.sf.json.JSONNull;
import cn.net.dbi.boom.property.PropertyUtils;
import cn.net.dbi.boom.utils.NumberUtils;
import cn.net.dbi.table.ConstantInfo;
import cn.net.dbi.table.model.ColumnModel;
import cn.net.dbi.table.operator.column.ColumnType;
import cn.net.dbi.table.operator.column.ConstantSyntax;

public class DecimalType extends ColumnType{
	
	public DecimalType(){
	}
	
	public DecimalType(ColumnModel cm) {
		super(cm);
	}

	@Override
	public String getInsertSyntax(){
		int maxM = Integer.valueOf(PropertyUtils.getValue("mysql.decimal.M.max"));
		int maxD = Integer.valueOf(PropertyUtils.getValue("mysql.decimal.D.max"));
		int valueM = NumberUtils.getInt(cm.getWidth())>maxM?
					maxM:NumberUtils.getInt(cm.getWidth());
		int valueD = NumberUtils.getInt(cm.getDecimalWidth());
		if(valueD > maxD){
			valueD = maxD;
		}
		if(valueD > valueM){
			valueD = valueM;
		}
		
		StringBuffer buf = new StringBuffer();
		buf.append(ConstantSyntax.DECIMAL);
		buf.append(ConstantInfo.PARENTHESIS_LEFT);
		buf.append(valueM);
		buf.append(ConstantInfo.COMMA);
		buf.append(valueD);
		buf.append(ConstantInfo.PARENTHESIS_RIGHT);
		return buf.toString();
	}
	
	public Object convert(Object src){
		if(src instanceof Number){
			return src;
		}else if(src instanceof String){
			return Double.parseDouble((String)src);
		}
		return null;
	}
	
	public void setPreparedStatement(PreparedStatement ps, int i, Object val) throws SQLException{
		if(null == val){
			ps.setDouble(i, 0);
		}else if(val instanceof JSONNull){
			ps.setDouble(i, 0);
		}else if(val instanceof Double){
			ps.setDouble(i, NumberUtils.getDouble((Double)val));
		}else if(val instanceof Float){
			ps.setFloat(i, NumberUtils.getFloat((Float)val));
		}else if(val instanceof Long){
			ps.setLong(i, NumberUtils.getLong((Long)val));
		}else if(val instanceof Short){
			ps.setShort(i, NumberUtils.getShort((Short)val));
		}else if(val instanceof Integer){
			ps.setInt(i, NumberUtils.getInt((Integer)val));
		}else if(val instanceof String){
			double n = 0;
			try {
				n = Double.parseDouble((String)val);
			} catch (NumberFormatException e) {
				// TODO Auto-generated catch block
			}
			ps.setDouble(i, n);
		}else{
			throw new IllegalArgumentException("value is not number !");
		}
		
	}
}
