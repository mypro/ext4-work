package cn.net.dbi.table.operator.table;

import java.util.Iterator;
import java.util.List;

import cn.net.dbi.boom.property.PropertyUtils;
import cn.net.dbi.database.DBUtils;
import cn.net.dbi.table.ConstantInfo;
import cn.net.dbi.table.model.ColumnModel;
import cn.net.dbi.table.model.TableModel;
import cn.net.dbi.table.operator.AbstractSqlGenerator;
import cn.net.dbi.table.operator.column.ColumnSql;

public class AlterTable extends AbstractSqlGenerator {
	
	public String getSql(TableModel tm, List<ColumnModel> columns){
		TableModel orignal = ConstantInfo.getTableCache().getTables().get(tm.getUuid());
		
		StringBuffer sqlBuffer = new StringBuffer();
		
		sqlBuffer.append(ConstantInfo.ALTER_TABLE);
		sqlBuffer.append(ConstantInfo.BLANK);
		sqlBuffer.append(DBUtils.getTablePrefix());
		sqlBuffer.append(orignal.getKeyword());
		sqlBuffer.append(ConstantInfo.BLANK);
		sqlBuffer.append(ConstantInfo.RENAME_TO);
		sqlBuffer.append(ConstantInfo.BLANK);
		sqlBuffer.append(DBUtils.getTablePrefix());
		sqlBuffer.append(tm.getKeyword());
		
		log.info(sqlBuffer.toString());
		
		return sqlBuffer.toString();
	}

}
