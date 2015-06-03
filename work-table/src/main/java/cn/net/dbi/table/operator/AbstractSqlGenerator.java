package cn.net.dbi.table.operator;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import cn.net.dbi.table.model.ColumnModel;
import cn.net.dbi.table.model.TableModel;

public abstract class AbstractSqlGenerator {
	
	protected static Log log = LogFactory.getLog(AbstractSqlGenerator.class);
	
	public abstract String getSql(TableModel tm,List<ColumnModel> cms);
}
