package cn.net.dbi.datasource.service.dialect;

import java.sql.CallableStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.CallableStatementCallback;

import cn.net.dbi.datasource.service.AbstractDatabaseGetter;




public class MysqlDatabaseGetter extends AbstractDatabaseGetter{

	public List<Map<String, String>> getDatabases() {
		return dao.getJdbcTemplate().execute("show databases", new CallableStatementCallback() {

			public Object doInCallableStatement(CallableStatement cs)
					throws SQLException, DataAccessException {
				ResultSet rs = cs.executeQuery();
				List<Map<String, String>> results = new ArrayList<Map<String,String>>();
				while(rs.next()){
					Map<String, String> m = new HashMap<String, String>();
					m.put("database", rs.getString(1));
					results.add(m);
				}
				return results;
			}
		});
	}

	public List<Map<String, String>> getTables(final String database) {
		return dao.getJdbcTemplate().execute("use "+database, new CallableStatementCallback() {

			public Object doInCallableStatement(CallableStatement cs)
					throws SQLException, DataAccessException {
				ResultSet rs = cs.executeQuery("show tables");
				List<Map<String, String>> results = new ArrayList<Map<String,String>>();
				while(rs.next()){
					Map<String, String> m = new HashMap<String, String>();
					m.put("table", rs.getString(1));
					results.add(m);
				}
				return results;
			}
		});
	}

	public List<Map<String, String>> getColumns(final String database, final String table) {
		return dao.getJdbcTemplate().execute("use "+database, new CallableStatementCallback() {

			public Object doInCallableStatement(CallableStatement cs)
					throws SQLException, DataAccessException {
				ResultSet rs = cs.executeQuery("desc "+table);
				List<Map<String, String>> results = new ArrayList<Map<String,String>>();
				while(rs.next()){
					Map<String, String> m = new HashMap<String, String>();
					m.put("field", rs.getString(1));
					results.add(m);
				}
				return results;
			}
		});
	}

}
