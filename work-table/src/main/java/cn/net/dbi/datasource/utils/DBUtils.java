package cn.net.dbi.datasource.utils;

import javax.sql.DataSource;

import org.springframework.jdbc.datasource.DriverManagerDataSource;

import cn.net.dbi.boom.jdbc.CommonJdbcDao;
import cn.net.dbi.datasource.model.DatasourceModel;
import cn.net.dbi.datasource.service.AbstractDatabaseGetter;
import cn.net.dbi.datasource.service.dialect.MysqlDatabaseGetter;

public class DBUtils {
	
	public static CommonJdbcDao getJdbcDao(DatasourceModel dbModel){
		CommonJdbcDao dao = new CommonJdbcDao();
		DataSource ds = new DriverManagerDataSource(dbModel.getDriver(),
													dbModel.getUrl(),
													dbModel.getUsername(),
													dbModel.getPassword());
		dao.setDataSource(ds);
		return dao;
	}
	
	public static AbstractDatabaseGetter getDatabaseGetter(DatasourceModel dbModel){
		AbstractDatabaseGetter getter = null;
		if(-1 != dbModel.getDriver().indexOf("mysql")){
			getter = new MysqlDatabaseGetter();
		}
		return getter;
	}
}
