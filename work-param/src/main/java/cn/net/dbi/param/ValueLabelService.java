package cn.net.dbi.param;

import java.util.Iterator;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import cn.net.dbi.boom.cache.CacheUtils;
import cn.net.dbi.boom.jdbc.CommonHibernateDao;
import cn.net.dbi.boom.utils.BoomCollectionsUtils;
import cn.net.dbi.boom.utils.PKUtils;
import cn.net.dbi.param.bean.ParamValue;
import cn.net.dbi.param.bean.ValueLabel;

public class ValueLabelService {
	
	private CommonHibernateDao dao;
	
	public void setDao(CommonHibernateDao dao) {
		this.dao = dao;
	}
	
	@Transactional(propagation=Propagation.REQUIRED)
	public void saveOrUpdateParam(List<ValueLabel> addParamValues,
								List<ValueLabel> updateParamValues,
								List<ValueLabel> deleteParamValues){
	
		
		// 新增参数
		if(BoomCollectionsUtils.isNotEmptyCollection(addParamValues)){
			for(Iterator<ValueLabel> it=addParamValues.iterator();it.hasNext();){
				ValueLabel value = it.next();
				value.setUuid(PKUtils.getUUID());
			}
			dao.getHibernateTemplate().saveOrUpdateAll(addParamValues); 
		}
		
		// 更新参数
		if(BoomCollectionsUtils.isNotEmptyCollection(updateParamValues)){
			dao.getHibernateTemplate().saveOrUpdateAll(updateParamValues); 
		}
		
		// 删除参数
		if(BoomCollectionsUtils.isNotEmptyCollection(deleteParamValues)){
			dao.getHibernateTemplate().deleteAll(deleteParamValues); 
		}
		
	}
}
