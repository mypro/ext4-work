package cn.net.dbi.table.model;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.beanutils.BeanUtils;

import cn.net.dbi.boom.utils.BoomBeanUtils;


/**
 * @author hanheliang
 *
 */
public class TableInfo {
	
	private Map<String, TableModel> tableMap= new HashMap<String, TableModel>();
	private Map<String, TableModel> tableKeywordMap= new HashMap<String, TableModel>();
 	private Map<String, Map<String, ColumnModel>> columnMap = new HashMap<String, Map<String,ColumnModel>>(); 
	
	private ITableInfoLoader loader;
	
	private void buildTable(List<TableModel> tableList){
		tableMap.clear();
		for(Iterator<TableModel> it = tableList.iterator();it.hasNext();){
			TableModel table = it.next();
			tableMap.put(table.getUuid(), table);
		}
	}
	private void buildKeywordTable(List<TableModel> tableList){
		tableKeywordMap.clear();
		for(Iterator<TableModel> it = tableList.iterator();it.hasNext();){
			TableModel table = it.next();
			tableKeywordMap.put(table.getKeyword(), table);
		}
	}
	
	private void buildColumn(List<ColumnModel> columnList){
		columnMap.clear();
		for(Iterator<ColumnModel> it = columnList.iterator();it.hasNext();){
			ColumnModel column = it.next();
			Map<String, ColumnModel> columns  =columnMap.get(column.getTableUuid());
			if(null == columns){
				columns = new HashMap<String, ColumnModel>();
				columnMap.put(column.getTableUuid(), columns);
			}
			columns.put(column.getUuid(), column);
		}
	}
	
	//--------------------------------provide public method--------------------
	public void init(){
		buildTable(loader.loadTable());
		buildKeywordTable(loader.loadTable());
		buildColumn(loader.loadColumn());
	}
	
	/**
	 * 根据表的索引，获取所有字段
	 * 
	 * @param tableUuid
	 * @return
	 */
	public Map<String, ColumnModel> getColumns(String tableUuid){
		return (Map<String, ColumnModel>)BoomBeanUtils
				.cloneMap(this.columnMap.get(tableUuid), ColumnModel.class);
//		return (Map<String, ColumnModel>)this.columnMap.get(tableUuid);
	}
	
	/**
	 * 根据表的索引，以及字段的索引，定位到某个字段
	 * 
	 * @param tableUuid
	 * @param columnUuid
	 * @return
	 */
	public ColumnModel getColumn(String tableUuid, String columnUuid){
		ColumnModel cm = new ColumnModel();
		BoomBeanUtils.copyProperties(cm, this.columnMap.get(tableUuid).get(columnUuid));
		return cm;
	}
	
	/**
	 * 
	 * 获取所有表
	 * @return
	 */
	public Map<String, TableModel> getTables(){
		return (Map<String, TableModel>)BoomBeanUtils
					.cloneMap(this.tableMap, TableModel.class);
//		return this.tableMap;
	}
	
	/**
	 * 过滤map，返回结果为新分配的内存
	 * 
	 * @param tm
	 * @param src
	 * @return
	 */
	public Map<String, Object> filterMap(TableModel tm, Map<String, Object> src){
		Map<String, Object> dst = new HashMap<String, Object>();
		Map<String, ColumnModel> columns = this.getColumns(tm.getUuid());
		for(Iterator<String> uuidIt=columns.keySet().iterator();uuidIt.hasNext();){
			ColumnModel cm = columns.get(uuidIt.next());
			String keyword = cm.getKeyword();
			dst.put(keyword, src.get(keyword));
		}
		dst.put("uuid", src.get("uuid"));
		return dst;
	}
	
	public Map<String, TableModel> getkeywordTables(){
		return this.tableKeywordMap;
	}
	public void setLoader(ITableInfoLoader loader) {
		this.loader = loader;
	}
	
	/*
	 * 数据操作函数
	 */
	public int insert(String tableUuid, List<Map> datas){
		
		return 0;
	}
	
	public int update(String tableUuid, List<Map> datas){
		
		return 0;
	}
	
	public int delete(String tableUuid, List<Map> datas){
		
		return 0;
	}
	
	public List<Map> query(String tableUuid, List<Map> conditions, int start, int num, String order){
		
		return null;
	}

	
}
