package cn.net.dbi.table.operator.data;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import cn.net.dbi.boom.jdbc.CommonJdbcDao;
import cn.net.dbi.table.ConstantInfo;
import cn.net.dbi.table.model.ColumnModel;
import cn.net.dbi.table.model.TableInfo;
import cn.net.dbi.table.model.TableModel;

public class OperatorTool {
	
	protected Logger logger = Logger.getLogger(this.getClass().getName());
	
	/**
	 * 存储sql串及运行所需参数
	 */
	protected StringBuffer buffer = new StringBuffer();
	protected List<Object> params = new ArrayList<Object>();
	
	protected CommonJdbcDao jdbcDao ; 
	
	protected TableModel tm;
	
	protected Map<String, ColumnModel> columns;
	
	/**
	 * keyword为字段关键字
	 */
	protected Map<String, ColumnModel> columnInfos = new HashMap<String, ColumnModel>();
	
	public OperatorTool(TableModel tm){
		this.tm = tm;
		TableInfo ti = ConstantInfo.getTableCache();
		this.columns = ti.getColumns(this.tm.getUuid());
		rebuildColumnInfos();
	}

	public CommonJdbcDao getJdbcDao() {
		return jdbcDao;
	}
	
	/**
	 *  将缓存的以uuid为索引的map,转换成以key为索引的map
	 */
	protected void rebuildColumnInfos(){
		
		if(null == this.columns){
			return ;
		}
		Iterator<String> uuidIt = columns.keySet().iterator();
		while(uuidIt.hasNext()){
			String uuid = uuidIt.next();
			ColumnModel cm = columns.get(uuid);
			this.columnInfos.put(cm.getKeyword(), cm);
		}
	}

	public void setJdbcDao(CommonJdbcDao jdbcDao) {
		this.jdbcDao = jdbcDao;
	}

	public TableModel getTm() {
		return tm;
	}

	public void setTm(TableModel tm) {
		this.tm = tm;
	}

	public Map<String, ColumnModel> getColumns() {
		return columns;
	}

	public void setColumns(Map<String, ColumnModel> columns) {
		this.columns = columns;
	}
	
	
}
