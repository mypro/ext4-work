package cn.net.dbi.database;

import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import cn.net.dbi.boom.cache.CacheUtils;
import cn.net.dbi.boom.jdbc.CommonHibernateDao;
import cn.net.dbi.boom.jdbc.CommonJdbcDao;
import cn.net.dbi.boom.utils.BoomBeanUtils;
import cn.net.dbi.boom.utils.BoomCollectionsUtils;
import cn.net.dbi.boom.utils.PKUtils;
import cn.net.dbi.database.dao.DatabaseDao;
import cn.net.dbi.database.model.DatabaseModel;
import cn.net.dbi.table.model.ColumnModel;
import cn.net.dbi.table.model.TableInfo;
import cn.net.dbi.table.model.TableModel;
import cn.net.dbi.table.service.TableService;

public class DBService{
	
	@Autowired
	private CommonJdbcDao jdbcDao;
	
	@Autowired
	private DatabaseDao databaseDao;
	
	@Autowired
	private TableService tableService;
	
	public void setJdbcDao(CommonJdbcDao jdbcDao) {
		this.jdbcDao = jdbcDao;
	}

	@Transactional(propagation=Propagation.REQUIRED)
	public void createDatabase(final String database){
		jdbcDao.getJdbcTemplate().execute("create database "+database);
		// 维护t_base_database
		DatabaseModel databaseModel = new DatabaseModel();
		databaseModel.setKeyword(database);
		databaseModel.setName(database);
		this.databaseDao.createDatabase(databaseModel, null);
	}
	
	@Transactional(propagation=Propagation.REQUIRED)
	public void dropDatabase(final String database){
		jdbcDao.getJdbcTemplate().execute("drop database "+database);
		DatabaseModel databaseModel = this.databaseDao.queryDatabase(database); 
		this.databaseDao.delete(databaseModel);
		
		// 删除相关的表和列
		List<TableModel> tables = this.tableService.queryTableModel(databaseModel.getUuid());
		for(Iterator<TableModel> tableIt=tables.iterator();tableIt.hasNext();){
			TableModel table = tableIt.next();
			this.tableService.deleteTable(table, false);
		}
		
	}
	
	@Transactional(propagation=Propagation.REQUIRED)
	public void copyData(final String dstDatabase, final String srcDatabase, List<String> tables){
		TableInfo ti = (TableInfo)CacheUtils.getCacheInstance("tableCache");
		
		DatabaseModel databaseModel = this.databaseDao.queryDatabase(dstDatabase);
		
		String[] sqlArray = new String[tables.size()*3];
		int j = 0;
		for(int i=0;i<tables.size();i++){
			String table = tables.get(i);
			TableModel tm = ti.getkeywordTables().get(table);
			if(null == tm){
				continue;
			}
			// 维护t_base_table和t_base_column
			TableModel newTableModel = new TableModel();
			BoomBeanUtils.copyProperties(newTableModel, tm);
			newTableModel.setUuid(PKUtils.getUUID());
			newTableModel.setSetUuid(databaseModel.getUuid());
			
			Map<String, ColumnModel> columns = ti.getColumns(tm.getUuid());
			tableService.createTable(newTableModel, BoomCollectionsUtils.mapValue2List(columns), false);
			
			// 拼sql创建新表
			sqlArray[j++] = "use "+dstDatabase;
			sqlArray[j++] = "drop table if exists "+table;
			sqlArray[j++] = "create table "+dstDatabase+"."+table+" select * from "+srcDatabase+"."+table;
		}
		jdbcDao.getJdbcTemplate().batchUpdate(sqlArray);
	}
	
}
