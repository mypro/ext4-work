package cn.net.dbi.param.load;

import java.util.List;

import cn.net.dbi.boom.jdbc.CommonHibernateDao;
import cn.net.dbi.param.bean.ParamDefine;
import cn.net.dbi.param.bean.ParamValue;
import cn.net.dbi.param.bean.Type;

public class DBTypeInfoLoader extends CommonHibernateDao{
	
	public List<Type> loadTypes(){
		return (List<Type>)this.getHibernateTemplate().find("from Type");
	}
	
}
