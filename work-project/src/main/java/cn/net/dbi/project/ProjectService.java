package cn.net.dbi.project;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import cn.net.dbi.boom.cache.CacheUtils;
import cn.net.dbi.boom.jdbc.CommonHibernateDao;
import cn.net.dbi.boom.property.PropertyUtils;
import cn.net.dbi.boom.utils.BoomCollectionsUtils;
import cn.net.dbi.boom.utils.ThreadUtils;
import cn.net.dbi.database.DBUtils;
import cn.net.dbi.table.model.TableInfo;
import cn.net.dbi.table.model.TableModel;
import cn.net.dbi.table.operator.table.CreateTable;
import cn.net.dbi.table.operator.table.DeleteTable;

public class ProjectService {
	
	@Autowired
	private CommonHibernateDao commonHibernateDao;
	
	public void deleteTable(String projectUuid){
		String originalProject = ThreadUtils.get("project");
		ThreadUtils.set("project",projectUuid);
		
		TableInfo ti = (TableInfo)CacheUtils.getCacheInstance("tableCache");
		
		List<TableModel> tables = new ArrayList<TableModel>();
		tables.add(ProjectConstant.getFactorDefineTM());
		tables.add(ProjectConstant.getFactorInstTM());
		tables.add(ProjectConstant.getFactorRelationTM());
		tables.add(ProjectConstant.getFactorValueLabelTM());
		tables.add(ProjectConstant.getFactorLayoutDefine());
		tables.add(ProjectConstant.getFactorLayout());
		
		for(Iterator<TableModel> tableIt = tables.iterator();tableIt.hasNext();){
			TableModel table = tableIt.next();
			String deleteProjectTableSql = new DeleteTable().getSql(table, null);
			commonHibernateDao.runSql(deleteProjectTableSql) ;
		}
		
		ThreadUtils.set("project",originalProject);
	}
	
	@Transactional(propagation=Propagation.REQUIRED)
	public void copyTable(String dstPojectUuid, String srcProjectUuid){
		TableInfo ti = (TableInfo)CacheUtils.getCacheInstance("tableCache");
		
		List<TableModel> tables = new ArrayList<TableModel>();
		tables.add(ProjectConstant.getFactorDefineTM());
		tables.add(ProjectConstant.getFactorInstTM());
		tables.add(ProjectConstant.getFactorRelationTM());
		tables.add(ProjectConstant.getFactorValueLabelTM());
		tables.add(ProjectConstant.getFactorLayoutDefine());
		tables.add(ProjectConstant.getFactorLayout());
		
		for(Iterator<TableModel> tableIt = tables.iterator();tableIt.hasNext();){
			TableModel table = tableIt.next();
			String columns = new CreateTable().getColumn(BoomCollectionsUtils.mapValue2List(ti.getColumns(table.getUuid())));
			String deleteSql = "delete from "+PropertyUtils.getValue("mysql.dbname.project")+"."+dstPojectUuid+"_"+table.getKeyword();
			String insertSql = "insert into "+PropertyUtils.getValue("mysql.dbname.project")+"."+dstPojectUuid+"_"+table.getKeyword()+"("
					+columns+") select "+columns+" from "+PropertyUtils.getValue("mysql.dbname.project")
					+"."+srcProjectUuid+"_"+table.getKeyword();
			commonHibernateDao.runSql(deleteSql);
			commonHibernateDao.runSql(insertSql);
		}
		
	}
	
	public void createTable(String projectUuid){
		String originalProject = ThreadUtils.get("project");
		ThreadUtils.set("project",projectUuid);
		
		TableInfo ti = (TableInfo)CacheUtils.getCacheInstance("tableCache");
		
		List<TableModel> tables = new ArrayList<TableModel>();
		tables.add(ProjectConstant.getFactorDefineTM());
		tables.add(ProjectConstant.getFactorInstTM());
		tables.add(ProjectConstant.getFactorRelationTM());
		tables.add(ProjectConstant.getFactorValueLabelTM());
		tables.add(ProjectConstant.getFactorLayoutDefine());
		tables.add(ProjectConstant.getFactorLayout());
		
		for(Iterator<TableModel> tableIt = tables.iterator();tableIt.hasNext();){
			TableModel table = tableIt.next();
			String createProjectTableSql = new CreateTable()
						.getSql(table, 
						BoomCollectionsUtils.mapValue2List(ti.getColumns(table.getUuid())));
			commonHibernateDao.runSql(createProjectTableSql) ;
		}
		
		// import t_param_value
		String columns = new CreateTable().getColumn(BoomCollectionsUtils.mapValue2List(ti.getColumns(ProjectConstant.getFactorValueLabelTM().getUuid())));
		String sql = "insert into "+DBUtils.getTablePrefix()+"t_param_value("
				+columns+") select "+columns+" from "+PropertyUtils.getValue("mysql.dbname.business")
				+"."+"t_param_value";
		commonHibernateDao.runSql(sql);
		
		// import t_factor_layoutdefine
		columns = new CreateTable().getColumn(BoomCollectionsUtils.mapValue2List(ti.getColumns(ProjectConstant.getFactorLayoutDefine().getUuid())));
		sql = "insert into "+DBUtils.getTablePrefix()+"t_factor_layoutdefine("
				+columns+") select "+columns+" from "+PropertyUtils.getValue("mysql.dbname.business")
				+"."+"t_factor_layoutdefine";
		commonHibernateDao.runSql(sql);
		
		
		ThreadUtils.set("project",originalProject);
	}
	
}
