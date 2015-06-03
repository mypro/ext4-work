package cn.net.dbi.param.load;

import java.util.List;

import cn.net.dbi.boom.jdbc.CommonHibernateDao;
import cn.net.dbi.param.bean.ParamDefine;
import cn.net.dbi.param.bean.ParamValue;

public class DBParamInfoLoader extends CommonHibernateDao{
	
	public List<ParamDefine> loadParamDefines(){
		return (List<ParamDefine>)this.getHibernateTemplate().find("from ParamDefine");
	}
	
	public List<ParamDefine> loadParamDefines(String defineUuid ){
		return (List<ParamDefine>)this.getHibernateTemplate().find(
				"from ParamDefine where uuid=?" , new Object[]{defineUuid});
	}
	
	public List<ParamValue> loadParamValues(){
		return (List<ParamValue>)this.getHibernateTemplate().find("from ParamValue order by seq");
	}
	
	public List<ParamValue> loadParamValues(String defineUuid ){
		return (List<ParamValue>)this.getHibernateTemplate().find(
				"from ParamValue where defineUuid=? order by seq", new Object[]{defineUuid});
	}
	
	
}
