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
import cn.net.dbi.param.bean.ParamDefine;
import cn.net.dbi.param.bean.ParamValue;

public class ParamService {
	
	private CommonHibernateDao dao;
	
	public void setDao(CommonHibernateDao dao) {
		this.dao = dao;
	}
	
	@Transactional(propagation=Propagation.REQUIRED)
	public void saveOrUpdateParam(ParamDefine paramDefine, 
								List<ParamValue> addParamValues,
								List<ParamValue> updateParamValues,
								List<ParamValue> deleteParamValues){
		String defineUuid = "";
		if(null != paramDefine){
			if(null == paramDefine.getUuid()){
				paramDefine.setUuid(PKUtils.getUUID());
			}
			defineUuid = paramDefine.getUuid();
			dao.getHibernateTemplate().saveOrUpdate(paramDefine);
		}
		
		// 新增参数
		if(BoomCollectionsUtils.isNotEmptyCollection(addParamValues)){
			for(Iterator<ParamValue> it=addParamValues.iterator();it.hasNext();){
				ParamValue value = it.next();
				value.setUuid(PKUtils.getUUID());
				if(StringUtils.isBlank(value.getDefineUuid())){
					value.setDefineUuid(paramDefine.getUuid());
				}
			}
			defineUuid = addParamValues.get(0).getDefineUuid();
			dao.getHibernateTemplate().saveOrUpdateAll(addParamValues); 
		}
		
		// 更新参数
		if(BoomCollectionsUtils.isNotEmptyCollection(updateParamValues)){
			defineUuid = updateParamValues.get(0).getDefineUuid();
			dao.getHibernateTemplate().saveOrUpdateAll(updateParamValues); 
		}
		
		// 删除参数
		if(BoomCollectionsUtils.isNotEmptyCollection(deleteParamValues)){
			defineUuid = deleteParamValues.get(0).getDefineUuid();
			dao.getHibernateTemplate().deleteAll(deleteParamValues); 
		}
		
		// reload cache
		if(StringUtils.isNotBlank(defineUuid)){
			ParamInfo pi = (ParamInfo)CacheUtils.getCacheInstance("paramCache");
			pi.reload(defineUuid);
		}
	}
}
