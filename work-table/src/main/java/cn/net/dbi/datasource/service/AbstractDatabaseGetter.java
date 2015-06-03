package cn.net.dbi.datasource.service;

import java.util.List;
import java.util.Map;

import cn.net.dbi.boom.jdbc.CommonJdbcDao;

public abstract class AbstractDatabaseGetter {
	
	protected CommonJdbcDao dao;
	
	public void setDao(CommonJdbcDao dao) {
		this.dao = dao; 
	}

	public abstract List<Map<String, String>> getDatabases();
	
	public abstract List<Map<String, String>> getTables(String database);
	
	public abstract List<Map<String, String>> getColumns(String database, String table);
}
