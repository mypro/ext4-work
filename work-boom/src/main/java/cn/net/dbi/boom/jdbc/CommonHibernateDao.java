package cn.net.dbi.boom.jdbc;

import java.sql.SQLException;

import org.apache.commons.lang.StringUtils;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

public class CommonHibernateDao extends HibernateDaoSupport {
	
	public Object runSql(String[] sqls){
		return this.getHibernateTemplate().execute(new RunSqlHibernateCallback(sqls));
	}

	public Object runSql(String sql){
		return this.getHibernateTemplate().execute(new RunSqlHibernateCallback(new String[]{sql}));
	} 
	
	/**
	 * 运行sql语句hibernate回调工具.
	 * 
	 * 注意，仅仅可用于执行非查询操作，由于查询操作的复杂性及变化性，需要单独自行实现hibernateCallback
	 * 
	 * @author hanheliang
	 *
	 */
	class RunSqlHibernateCallback implements HibernateCallback{
		
		private String[] sqls = null;
		
		public RunSqlHibernateCallback(String sql){
			this.sqls = new String[]{sql};
		}
		
		public RunSqlHibernateCallback(String[] sqls){
			this.sqls = sqls;
		}
		
		public Object doInHibernate(Session session)
				throws HibernateException, SQLException {
			if(null != sqls){
				for(int i=0;i<sqls.length;i++){
					if(StringUtils.isNotBlank(sqls[i])){
						session.createSQLQuery(sqls[i]).executeUpdate();
					}
				}
			}
			return null;
		}
	}
}
