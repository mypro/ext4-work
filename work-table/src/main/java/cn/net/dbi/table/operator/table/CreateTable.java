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

/**
 * @author hanheliang
 *
 */
public class CreateTable extends AbstractSqlGenerator {
	
	public String getSql(TableModel tm, List<ColumnModel> columns){
		
		Iterator<ColumnModel> it = columns.iterator();
		StringBuffer sqlBuffer = new StringBuffer();
		
		sqlBuffer.append(ConstantInfo.CREATE_TABLE);
		sqlBuffer.append(ConstantInfo.BLANK);
		sqlBuffer.append(DBUtils.getTablePrefix());
		sqlBuffer.append(tm.getKeyword());
		sqlBuffer.append(ConstantInfo.PARENTHESIS_LEFT);
		sqlBuffer.append(ConstantInfo.UUID);
		sqlBuffer.append(ConstantInfo.BLANK);
		sqlBuffer.append(ConstantInfo.UUID_INFO);
		sqlBuffer.append(",");
		sqlBuffer.append(ConstantInfo.SEQ);
		sqlBuffer.append(ConstantInfo.BLANK);
		sqlBuffer.append(ConstantInfo.SEQ_INFO);
		while(it.hasNext()){
			ColumnModel cm = it.next();
			sqlBuffer.append(",");
			sqlBuffer.append(new ColumnSql(cm).getInsertSyntax());
		}
		sqlBuffer.append(ConstantInfo.PARENTHESIS_RIGHT);
		sqlBuffer.append("default charset=utf8");
		
		log.info(sqlBuffer.toString());
		
		return sqlBuffer.toString();
	}
	
	public String getColumn(List<ColumnModel> columns){
		StringBuffer sqlBuffer = new StringBuffer();
		
		Iterator<ColumnModel> it = columns.iterator();
		
		sqlBuffer.append(ConstantInfo.UUID);
		sqlBuffer.append(",");
		sqlBuffer.append(ConstantInfo.SEQ);
		while(it.hasNext()){
			ColumnModel cm = it.next();
			sqlBuffer.append(",");
			sqlBuffer.append(cm.getKeyword());
		}

		return sqlBuffer.toString();
				
	}

}
