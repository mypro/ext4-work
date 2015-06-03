package cn.net.dbi.table.service;

import java.sql.SQLException;
import java.util.*;

import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import antlr.StringUtils;
import cn.net.dbi.boom.cache.CacheUtils;
import cn.net.dbi.boom.jdbc.CommonHibernateDao;
import cn.net.dbi.boom.property.PropertyUtils;
import cn.net.dbi.boom.utils.BoomCollectionsUtils;
import cn.net.dbi.boom.utils.BoomStringUtils;
import cn.net.dbi.boom.utils.IMapIteratorCallback;
import cn.net.dbi.boom.utils.PKUtils;
import cn.net.dbi.table.ConstantInfo;
import cn.net.dbi.table.model.ColumnModel;
import cn.net.dbi.table.model.TableInfo;
import cn.net.dbi.table.model.TableModel;
import cn.net.dbi.table.operator.table.AddColumn;
import cn.net.dbi.table.operator.table.AlterTable;
import cn.net.dbi.table.operator.table.CreateTable;
import cn.net.dbi.table.operator.table.DeleteColumn;
import cn.net.dbi.table.operator.table.DeleteTable;
import cn.net.dbi.table.operator.table.UpdateColumn;

@Transactional
public class TableService {
	
	private CommonHibernateDao dao;
	
	@Transactional(propagation=Propagation.REQUIRED)
	public String createTable(TableModel table, List<ColumnModel> columns, boolean isRunSql){
		String uuid=PKUtils.getUUID();
		table.setUuid(uuid);
		Iterator<ColumnModel> it = columns.iterator();
		while(it.hasNext()){
			ColumnModel cm = it.next();
			cm.setUuid(PKUtils.getUUID());
			// 每个column表设置外键 ！ 
			cm.setTableUuid(table.getUuid());
		}
		
		dao.getHibernateTemplate().save(table);
		dao.getHibernateTemplate().saveOrUpdateAll(columns);
		
		if(isRunSql){
			String createBusinessTableSql = new CreateTable()
									.getSql(table, columns);
			dao.runSql(createBusinessTableSql) ;
		}
		
		CacheUtils.setNeedReload(ConstantInfo.TABLECACHE_NAME, true);
		return uuid;
	}
	
	@Transactional(propagation=Propagation.REQUIRED)
	public void updateTable(TableModel table, 
							List<ColumnModel> addColumns,
							List<ColumnModel> updateColumns,
							List<ColumnModel> deleteColumns){
		/* 修改表名*/
		String alterTableSql = new AlterTable().getSql(table, null);
		dao.runSql(alterTableSql);
		dao.getHibernateTemplate().update(table);
		
		/* 新增字段*/
		if(BoomCollectionsUtils.isNotEmptyCollection(addColumns)){
			Iterator<ColumnModel> it = addColumns.iterator();
			while(it.hasNext()){
				ColumnModel cm = it.next();
				if(!"".equals(cm.getUuid())&&null!=cm.getUuid()){
					
				}else{
					cm.setUuid(PKUtils.getUUID());
				}
				// 每个column表设置外键 ！ 
				cm.setTableUuid(table.getUuid());
			}
			dao.getHibernateTemplate().saveOrUpdateAll(addColumns);
			
			String addColumnSql = new AddColumn().getSql(table, addColumns);
			dao.runSql(addColumnSql.split(ConstantInfo.ENTER));
		}
		
		/* 更新字段*/
		if(BoomCollectionsUtils.isNotEmptyCollection(updateColumns)){
			dao.getHibernateTemplate().saveOrUpdateAll(updateColumns);
			
			String updateColumnSql = new UpdateColumn().getSql(table, updateColumns);
			dao.runSql(updateColumnSql.split(ConstantInfo.ENTER));
		}
		
		/* 删除字段*/
		if(BoomCollectionsUtils.isNotEmptyCollection(deleteColumns)){
			dao.getHibernateTemplate().deleteAll(deleteColumns);
			
			String deleteColumnSql = new DeleteColumn().getSql(table, deleteColumns);
			dao.runSql(deleteColumnSql.split(ConstantInfo.ENTER));
		}
		
		CacheUtils.setNeedReload(ConstantInfo.TABLECACHE_NAME, true);
	}
	
	@Transactional(propagation=Propagation.REQUIRED)
	public void deleteTable(TableModel table, boolean isRunSql){

		List<ColumnModel> columns = dao.getHibernateTemplate().find("from ColumnModel where tableUuid=?",
				new Object[]{table.getUuid()});
		
		dao.getHibernateTemplate().delete(table);
		dao.getHibernateTemplate().deleteAll(columns);
		
		if(isRunSql){
			String deleteBusinessSql = new DeleteTable().getSql(table, null);
			dao.runSql(deleteBusinessSql);
		}
		
		CacheUtils.setNeedReload(ConstantInfo.TABLECACHE_NAME, true);
	}
	
	public List<TableModel> queryTableModel(final String setUuid){
		return dao.getHibernateTemplate().find("from TableModel where setUuid=?"
										, setUuid);		
	}
	
	/**
	 * 根据表名，找到表模型
	 * @param tableName
	 * @return
	 */
	public TableModel getTableModelByName(final String tableName){
		
		TableInfo ti = (TableInfo)CacheUtils.getCacheInstance("tableCache");
		
		/* final tablemodel */
		TableModel tm = (TableModel)BoomCollectionsUtils.iterMap(ti.getTables(), new IMapIteratorCallback<String, TableModel>() {
			public Object iteratorCallback(String key, TableModel value) {
				return value;
			}
			public boolean stopIterator(String key, TableModel value) {
				return value.getKeyword().equalsIgnoreCase(tableName);
			}
		});
		
		return tm;
	}

	public void setDao(CommonHibernateDao dao) {
		this.dao = dao;
	}
	
}
