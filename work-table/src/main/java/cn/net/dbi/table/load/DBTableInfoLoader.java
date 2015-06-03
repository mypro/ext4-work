package cn.net.dbi.table.load;

import java.util.List;

import cn.net.dbi.boom.jdbc.CommonHibernateDao;
import cn.net.dbi.table.model.ColumnModel;
import cn.net.dbi.table.model.ITableInfoLoader;
import cn.net.dbi.table.model.TableModel;

public class DBTableInfoLoader extends CommonHibernateDao implements ITableInfoLoader {
	
	public List<ColumnModel> loadColumn(){
		return this.getHibernateTemplate().find("from ColumnModel");
	}
	
	public List<TableModel> loadTable(){
		return this.getHibernateTemplate().find("from TableModel");
	}
	
	
}
