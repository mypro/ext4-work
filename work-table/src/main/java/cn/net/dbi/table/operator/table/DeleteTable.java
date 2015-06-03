package cn.net.dbi.table.operator.table;

import java.util.List;

import cn.net.dbi.boom.property.PropertyUtils;
import cn.net.dbi.database.DBUtils;
import cn.net.dbi.table.ConstantInfo;
import cn.net.dbi.table.model.ColumnModel;
import cn.net.dbi.table.model.TableModel;
import cn.net.dbi.table.operator.AbstractSqlGenerator;

/**
 * @author hanheliang
 *
 */
public class DeleteTable extends AbstractSqlGenerator{

	public String getSql(TableModel tm, List<ColumnModel> cms){
		
		StringBuffer buf = new StringBuffer();
		buf.append(ConstantInfo.DROP_TABLE);
		buf.append(ConstantInfo.BLANK);
		buf.append(DBUtils.getTablePrefix());
		buf.append(tm.getKeyword());
		
		return buf.toString();
	}
}
