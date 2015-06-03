package cn.net.dbi.table.operator.table;

import java.util.Iterator;
import java.util.List;
import java.util.Map;

import cn.net.dbi.boom.cache.CacheUtils;
import cn.net.dbi.boom.property.PropertyUtils;
import cn.net.dbi.database.DBUtils;
import cn.net.dbi.table.ConstantInfo;
import cn.net.dbi.table.model.ColumnModel;
import cn.net.dbi.table.model.TableInfo;
import cn.net.dbi.table.model.TableModel;
import cn.net.dbi.table.operator.AbstractSqlGenerator;
import cn.net.dbi.table.operator.column.ColumnSql;

public class UpdateColumn extends AbstractSqlGenerator{
	
	@Override
	public String getSql(TableModel tm, List<ColumnModel> cms) {
		
		/* 获取数据库当前列信息，目的是拼alter语句时指定旧的列名*/
		TableInfo ti = (TableInfo)CacheUtils.getCacheInstance("tableCache");
		Map<String, ColumnModel> currentColumn = ti.getColumns(tm.getUuid());

		StringBuffer buf = new StringBuffer();
		
		Iterator<ColumnModel> it = cms.iterator();
		while(it.hasNext()){
			ColumnModel cm = it.next();
			buf.append(ConstantInfo.ALTER_TABLE);
			buf.append(ConstantInfo.BLANK);
			buf.append(DBUtils.getTablePrefix());
			buf.append(tm.getKeyword());
			buf.append(ConstantInfo.BLANK);
			buf.append(ConstantInfo.CHANGE);
			buf.append(ConstantInfo.BLANK);
			buf.append(currentColumn.get(cm.getUuid()).getKeyword());
			buf.append(ConstantInfo.BLANK);
			buf.append(new ColumnSql(cm).getInsertSyntax());
			buf.append(ConstantInfo.ENTER);
		}
		
		return buf.toString();
	}

}
