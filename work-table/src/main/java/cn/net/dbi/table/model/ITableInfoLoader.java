package cn.net.dbi.table.model;

import java.util.List;

/**
 * 加载数据库表和字段
 * 
 * @author hanheliang
 *
 */
public interface ITableInfoLoader {
	
	public List<ColumnModel> loadColumn();
	public List<TableModel> loadTable();
}
