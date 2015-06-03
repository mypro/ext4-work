package cn.net.dbi.param.load;

import java.util.List;

import cn.net.dbi.boom.jdbc.CommonHibernateDao;
import cn.net.dbi.param.bean.ValueLabel;

public class DBValueLabelInfoLoader extends CommonHibernateDao{
	
	public List<ValueLabel> loadValueLabels(){
		return (List<ValueLabel>)this.getHibernateTemplate().find("from ValueLabel");
	}
	
}
