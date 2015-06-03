package cn.net.dbi.table.operator;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.jdbc.core.RowMapper;

public class TableRowMapper implements RowMapper<Map<String, Object>> {
	
	public static TableRowMapper tableRowMapper = new TableRowMapper();

	public Map<String, Object> mapRow(ResultSet rs, int rowNum)
			throws SQLException {
		HashMap<String, Object> record = new HashMap<String, Object>();
		ResultSetMetaData rsd = rs.getMetaData();
		for (int i = 1; i <= rsd.getColumnCount(); i++) {
			record.put(rsd.getColumnLabel(i),
					String.valueOf(rs.getObject(rsd.getColumnLabel(i))));
		}
		return record;
	}
	
	public static RowMapper getTableRowMapper(){
		return tableRowMapper;
	}
}
