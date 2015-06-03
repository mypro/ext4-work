package cn.net.dbi.database.dao;

import java.util.List;

import cn.net.dbi.boom.jdbc.CommonHibernateDao;
import cn.net.dbi.boom.utils.PKUtils;
import cn.net.dbi.database.model.DatabaseModel;

public class DatabaseDao extends CommonHibernateDao {
	
	public void createDatabase(DatabaseModel databaseModel, String parentUuid){
		databaseModel.setUuid(PKUtils.getUUID());
		databaseModel.setParentUuid(parentUuid);
		this.getHibernateTemplate().saveOrUpdate(databaseModel);
	}
	
	public void delete(DatabaseModel databaseModel){
		this.getHibernateTemplate().delete(databaseModel);
		this.getHibernateTemplate().bulkUpdate(
				"delete from TableModel where setUuid=?", new Object[]{databaseModel.getUuid()});
		
	}
	
	public DatabaseModel queryDatabase(String keyword){
		List<DatabaseModel> l = this.getHibernateTemplate().find("from DatabaseModel where keyword=?",
										new Object[]{keyword});
		if(0 < l.size()){
			return l.get(0);
		}
		return null;
	}
	
	public void deleteByName(String keyword){
		this.getHibernateTemplate().bulkUpdate("delete from DatabaseModel where keyword=?",
										new Object[]{keyword});
	}
}
