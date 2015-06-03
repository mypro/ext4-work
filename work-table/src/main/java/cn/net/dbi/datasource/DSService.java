package cn.net.dbi.datasource;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import cn.net.dbi.boom.jdbc.CommonJdbcDao;
import cn.net.dbi.boom.property.PropertyUtils;
import cn.net.dbi.datasource.model.DatasourceModel;
import cn.net.dbi.datasource.service.AbstractDatabaseGetter;
import cn.net.dbi.datasource.utils.DBUtils;

public class DSService {
	
	public DatasourceModel getDatabaseModel(String datasource){
		DatasourceModel dbModel = new DatasourceModel();
		dbModel.setDriver(PropertyUtils.getValue("jdbc.driverClassName"));
		dbModel.setUrl(PropertyUtils.getValue("jdbc.url"));
		dbModel.setUsername(PropertyUtils.getValue("jdbc.username"));
		dbModel.setPassword(PropertyUtils.getValue("jdbc.password"));
		return dbModel;
	}
	
	public boolean isValid(DatasourceModel dbModel){
		Connection conn = null;
		try {
			Class.forName(dbModel.getDriver()).newInstance();
			conn = DriverManager.getConnection(
					dbModel.getUrl(),dbModel.getUsername(),dbModel.getPassword());
		} catch (Exception e) {
			return false;
		} finally{
			try {
				conn.close();
			} catch (SQLException e) {
			}
		}
		
		return true;
	}
	
	public List<Map<String, String>> showDatabase(DatasourceModel dbModel){
		CommonJdbcDao dao = DBUtils.getJdbcDao(dbModel);
		AbstractDatabaseGetter infoGetter = DBUtils.getDatabaseGetter(dbModel);
		infoGetter.setDao(dao);
		return infoGetter.getDatabases();
	}
	
	public List<Map<String, String>> showTable(DatasourceModel dbModel, String database){
		CommonJdbcDao dao = DBUtils.getJdbcDao(dbModel);
		AbstractDatabaseGetter infoGetter = DBUtils.getDatabaseGetter(dbModel);
		infoGetter.setDao(dao);
		return infoGetter.getTables(database);
	}
	
	public List<Map<String, String>> showColumn(DatasourceModel dbModel, String database, String table){
		CommonJdbcDao dao = DBUtils.getJdbcDao(dbModel);
		AbstractDatabaseGetter infoGetter = DBUtils.getDatabaseGetter(dbModel);
		infoGetter.setDao(dao);
		return infoGetter.getColumns(database, table);
	}
}
