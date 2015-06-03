package cn.net.dbi.factor.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.MultiHashMap;
import org.apache.commons.collections.MultiMap;
import org.apache.commons.collections.Predicate;
import org.apache.log4j.Logger;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import cn.net.dbi.table.model.TableModel;
import cn.net.dbi.table.operator.data.query.BranchNode;
import cn.net.dbi.table.operator.data.query.LeaveNode;
import cn.net.dbi.table.service.DataService;
import cn.net.dbi.boom.utils.BoomBeanUtils;
import cn.net.dbi.boom.utils.BoomCollectionsUtils;
import cn.net.dbi.boom.utils.BoomStringUtils;
import cn.net.dbi.factor.FactorConstant;
import cn.net.dbi.factor.service.FactorOperatorService;

public class ProjectInfo {
	
	private Logger log = Logger.getLogger(this.getClass());
	
	private FactorOperatorService factorService;
	
	// key为定义，value为所有实例
	private MultiMap defines = new MultiHashMap();
	
	// key为属性，value包含属性的所有因子
	private MultiMap props = new MultiHashMap();
	
	// 因子
	private List<Map<String, Object>> factors;
	private Map<String, Map<String, Object>> factorMap = new HashMap<String, Map<String,Object>>();
	
	// 因子关系
	private List<Map<String, Object>> factorRelations;
	private Map<String, Map<String, Object>> relationMap = new HashMap<String, Map<String,Object>>();
	
	// 因子布局
	private MultiMap layouts = new MultiHashMap();
	
	public ProjectInfo(FactorOperatorService factorService){
		this.factorService = factorService;
	}
	
	public List<Map<String, Object>> getLayout(String uuid){
		return (List<Map<String, Object>>)this.layouts.get(uuid);
	}
	
	public Map<String, Object> getFactor(String uuid){
		return this.factorMap.get(uuid);
	}
	
	public Map<String, Object> getRelation(String uuid){
		return this.relationMap.get(uuid);
	}
	
	public List<Map<String, Object>> getProp(String uuid){
		return (List<Map<String, Object>>)this.props.get(uuid);
	}
	
	public List<Map<String, Object>> getFactorByDefine(String uuid){
		return (List<Map<String, Object>>)this.defines.get(uuid);
	}
	
	/**
	 * 根据因子获取所有的因子关系（不包括属性关系）
	 * @param uuid
	 * @return
	 */
	public List<Map<String, Object>> getRelationByFactor(String uuid){
		List<Map<String, Object>> relations = new ArrayList<Map<String,Object>>();
		
		for(Iterator<Map<String, Object>> it=this.factorRelations.iterator();it.hasNext();){
			Map<String, Object> relation = it.next();
			if(uuid.equals(relation.get("factor1Uuid"))
					|| uuid.equals(relation.get("factor2Uuid"))){
				relations.add(relation);
			}
		}
		return relations;
	}
	
	public List<Map<String, Object>> getFactors() {
		return new ArrayList<Map<String,Object>>(this.factors);
	}
	
	public List<Map<String, Object>> getFactorRelations() {
		return new ArrayList<Map<String,Object>>(this.factorRelations);
	}
	

	public void init(){
		long startTimestamp = new Date().getTime();
		
		// load factor
		this.factors = this.factorService.loadFactorInstance(null);
		for(Iterator<Map<String, Object>> it = factors.iterator();it.hasNext();){
			Map<String, Object> factor = it.next();
			this.factorMap.put((String)factor.get("uuid"), factor);
			this.defines.put((String)factor.get("defineUuid"), factor);
		}
		
		// load all relation(include prop relation)
		List<Map<String, Object>> allRelations = this.factorService.loadProperty(null);
		
		// filter factor relation
		factorRelations = this.filterRelation(allRelations, FactorConstant.RELATION_TYPE_FACTOR);
		for(Iterator<Map<String, Object>> it = factorRelations.iterator();it.hasNext();){
			Map<String, Object> factorRelation = it.next();
			relationMap.put((String)factorRelation.get("relationUuid"), factorRelation);
		}
		
		// load factor prop
		List<Map<String, Object>> factorProps = this.filterRelation(allRelations, FactorConstant.RELATION_TYPE_FACTORPROP);
		
		// mapping factor prop
		assemblyProp(factors, factorProps);
		
		// init factorRelation name
		for(Iterator<Map<String, Object>> it = factorRelations.iterator();it.hasNext();){
			Map<String, Object> factorRelation = it.next();
			
			String factor1Uuid = (String)factorRelation.get("factor1Uuid");
			factorRelation.put("factor1Name", factorMap.get(factor1Uuid).get("name"));
			
			String factor2Uuid = (String)factorRelation.get("factor2Uuid");
			factorRelation.put("factor2Name", factorMap.get(factor2Uuid).get("name"));
			
			factorRelation.put("uuid", factorRelation.get("relationUuid"));
		}
		
		// load relation prop
		List<Map<String, Object>> relationProps = this.filterRelation(allRelations, FactorConstant.RELATION_TYPE_RELATIONPROP);
		
		// mapping relation prop
		assemblyProp(factorRelations, relationProps);
		
		// load factor Layout
		List<Map<String, Object>> factorLayouts = this.factorService.loadLayout();
		for(Iterator<Map<String, Object>> it = factorLayouts.iterator();it.hasNext();){
			Map<String, Object> factorLayout = it.next();
			this.layouts.put(factorLayout.get("factorUuid"), factorLayout);
		}
		
		log.info("project init :"+(new Date().getTime()-startTimestamp));
	}
	
	/**
	 * 将属性挂到因子下，关系属性同样适用
	 * 
	 * @param factors
	 * @param factorProps
	 * @return
	 */
	private Map<String, Map<String, Object>> assemblyProp(List<Map<String, Object>> factors, List<Map<String, Object>> factorProps){
		
		Map<String, Map<String, Object>> tempFactorMap = new HashMap<String, Map<String,Object>>();
		
		for(Iterator<Map<String, Object>> it = factors.iterator();it.hasNext();){
			Map<String, Object> factor = it.next();
			tempFactorMap.put((String)factor.get("uuid"), factor);
		}
		for(Iterator<Map<String, Object>> it=factorProps.iterator();it.hasNext();){
			Map<String, Object> prop = it.next();
			String factorUuid = (String)prop.get("factor1Uuid");
			Map<String, Object> factor = tempFactorMap.get(factorUuid);
			JSONArray childs = (JSONArray)factor.get("childs");
			if(null == childs){
				childs = new JSONArray();
				factor.put("childs", childs);
			}
			childs.put(JSONObject.fromMap(prop));
			
			this.props.put(prop.get("factor2Uuid"), prop);
		}
		
		return tempFactorMap;
	}
	
	public List<Map<String, Object>> filterRelation(List<Map<String, Object>> allRelations,final String type){
		List<Map<String, Object>> relations = new ArrayList<Map<String,Object>>(allRelations);
		
		CollectionUtils.filter(relations, new Predicate() {
			public boolean evaluate(Object object){
				Map<String, Object> prop = (Map<String, Object>) object;
				return type.equals(prop.get("type").toString());
			}
		});
		
		return relations;
	}
}
