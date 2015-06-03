package cn.net.dbi.factor.controller;

import java.util.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.Predicate;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.wltea.expression.ExpressionEvaluator;
import org.wltea.expression.datameta.BaseDataMeta.DataType;
import org.wltea.expression.datameta.Variable;

import cn.net.dbi.boom.controller.BaseController;
import cn.net.dbi.boom.utils.BoomBeanUtils;
import cn.net.dbi.boom.utils.BoomCollectionsUtils;
import cn.net.dbi.boom.utils.IMap2JsonCallback;
import cn.net.dbi.boom.utils.NumberUtils;
import cn.net.dbi.boom.utils.ThreadUtils;
import cn.net.dbi.factor.FactorConstant;
import cn.net.dbi.factor.model.ProjectInfo;
import cn.net.dbi.factor.service.FactorOperatorService;

@Controller
public class FactorController extends BaseController{
	
	@Autowired
	private FactorOperatorService factorOperatorService;
	
	@RequestMapping("/loadLayoutDefine.do")
	public void loadLayoutDefine(HttpServletRequest req, HttpServletResponse rep){
		
		out2site(this.factorOperatorService.loadLayoutDefine(), rep);
	}
	
	@RequestMapping("/loadLayout.do")
	public void loadLayout(HttpServletRequest req, HttpServletResponse rep){
		
		out2site(this.factorOperatorService.loadLayout(), rep);
	}
	
	@RequestMapping("/loadFactorDefine.do")
	public <T> void loadFactorDefine(HttpServletRequest req, HttpServletResponse rep){

		final Map<String, Object> condition = BoomBeanUtils.str2Map(req.getParameter("condition"));
		
		List<Map<String, Object>> results = factorOperatorService.loadFactorDefine(condition);
		
		JSONArray ja = BoomBeanUtils.list2JsonArray(results, new IMap2JsonCallback<Object>() {
			public JSONObject convert(Map<String, Object> map) {
				JSONObject jo  = JSONObject.fromMap(map);
				jo.put("text", jo.get("name"));
				jo.put("leaf", true);
				return jo;
			}
		});
		
		out2site(ja.toString(), rep);
	}
	
	@RequestMapping("/loadFactor.do")
	public void loadFactor(HttpServletRequest req, HttpServletResponse rep){
		
		ProjectInfo pi = this.factorOperatorService.loadProjectInfo();
		
		final Map<String, Object> conditionMap = BoomBeanUtils.str2Map(req.getParameter("condition"));
		conditionMap.put("createLevel", "1");
		
		List<Map<String, Object>> factors = pi.getFactors();
		CollectionUtils.filter(factors, BoomCollectionsUtils.getMapPredicate(conditionMap));
		
		out2site(factors, rep);
	}
	
	@RequestMapping("/loadRelation.do") 
	public void loadRelation(HttpServletRequest req,
							HttpServletResponse rep){
		String condition = req.getParameter("condition");
		Map<String, Object> conditionMap = BoomBeanUtils.str2Map(condition);
		
		ProjectInfo pi = new ProjectInfo(this.factorOperatorService);
		pi.init();
		List<Map<String, Object>> relations = pi.getFactorRelations();
		
		Predicate predicate = null;
		final String factorUuid = (String)conditionMap.get("factorUuid");
		if(StringUtils.isNotBlank(factorUuid)){
			conditionMap.remove("factorUuid");
		}
		predicate = BoomCollectionsUtils.getMapPredicate(conditionMap);
		CollectionUtils.filter(relations, predicate);
		
		if(StringUtils.isNotBlank(factorUuid)){
			CollectionUtils.filter(relations, new Predicate() {
				public boolean evaluate(Object object) {
					Map<String, Object> result = (Map<String, Object>)object;
					return factorUuid.equals(result.get("factor1Uuid")) 
							|| factorUuid.equals(result.get("factor2Uuid")) ;
				}
			});
		}
		
		out2site(relations, rep);
	}
	
	@RequestMapping("/loadProperty.do") 
	public void loadProperty(HttpServletRequest req,
									HttpServletResponse rep){
		String condition = req.getParameter("condition");
		Map<String, Object> conditionMap = BoomBeanUtils.str2Map(condition);
		
		List<Map<String, Object>> properties = this.factorOperatorService.loadProperty(
															(String)conditionMap.get("parentUuid"), 
															conditionMap.get("parentType").toString());
		
		out2site(properties, rep);
	}
	
	@RequestMapping("/importFactor.do")
	public void importFactor(@RequestParam String record,
			HttpServletRequest req,
	   		HttpServletResponse rep){
		
		Map<String, Object> factor = BoomBeanUtils.str2Map(record);
		
		this.factorOperatorService.importFactorByCascade(factor);
		
		out2site(JSONObject.fromMap(factor).toString(), rep);
	}
	
	@RequestMapping("/importRelation.do")
	public void importRelation(@RequestParam String record,
			HttpServletRequest req,
	   		HttpServletResponse rep){
		
		Map<String, Object> relation = BoomBeanUtils.str2Map(record);
		
		this.factorOperatorService.importRelationByCascade(relation);
		
		out2site(JSONObject.fromMap(relation).toString(), rep);
	}
	
	@RequestMapping("/addLayoutDefine.do")
	public void addLayoutDefine(@RequestParam String record,
			HttpServletRequest req,
	   		HttpServletResponse rep){
		Map<String, Object> layoutDefine = BoomBeanUtils.str2Map(record);
		
		this.factorOperatorService.addLayoutDefine(layoutDefine);
		
		out2site(JSONObject.fromMap(layoutDefine).toString(), rep);
	}
	
	@RequestMapping("/addLayout.do")
	public void addLayout(@RequestParam String records,
			HttpServletRequest req,
	   		HttpServletResponse rep){
		List<Map<String, Object>> positions = BoomBeanUtils.jsonArray2List(JSONArray.fromString(records));
		
		this.factorOperatorService.addLayout(positions);
		
		out2site(positions, rep); 
	}
	
	@RequestMapping("/saveFactor.do")
	public void saveFactor(HttpServletRequest req,
						   		HttpServletResponse rep){
		Map<String, Object> addFactor = BoomBeanUtils.str2Map((String)req.getParameter("addRecord"));
		
		String defineUuid = (String)addFactor.get("defineUuid");
		
		boolean existDefine = false;
		// 同一项目中，因子名称不允许重复
		String factorDefineName = ((String)addFactor.get("name")).trim();
		List<Map<String, Object>> factorDefines = this.factorOperatorService.loadFactorDefine(null);
		for(Iterator<Map<String, Object>> defineIt=factorDefines.iterator();defineIt.hasNext();){
			Map<String, Object> define = defineIt.next();
			if(define.get("defineUuid").equals(defineUuid)){
				existDefine = true;
			}
			if(((String)define.get("name")).trim().equalsIgnoreCase(factorDefineName)
					&& !define.get("defineUuid").equals(defineUuid)){
//				String factorUuid = (String)addFactor.get("uuid");
//				if(StringUtils.isNotBlank(factorUuid)){
//					addFactor.put("defineUuid", define.get("defineUuid"));
//					this.factorOperatorService.updateFactorDefineUuid(factorUuid, (String)define.get("defineUuid")); 
//					
//					out2site(JSONObject.fromMap(addFactor).toString(), rep); 
//					return;
//				}else{
//					JSONObject jo = new JSONObject();
//					jo.put("duplicate", true);
//					out2site(jo.toString(), rep); 
//					return;
//				}
			}
		}

		String parentUuid = req.getParameter("parentUuid");
		String parentType = req.getParameter("parentType");
		
		if((StringUtils.isNotBlank(defineUuid) && !existDefine)
				|| StringUtils.isBlank(defineUuid)){		//创建
			/*
			 * create new factor
			 */
			addFactor.put("uuid", defineUuid);
			this.factorOperatorService.addFactorDefine(addFactor);
			addFactor.put("uuid", "");
			this.factorOperatorService.saveFactorInstance(addFactor, parentUuid, parentType);
			
		}else{
			/*
			 * update factor define OR create factor instance
			 */
			this.factorOperatorService.updateFatorDefine(addFactor);
			if(addFactor.keySet().contains("value")){
				this.factorOperatorService.saveFactorInstance(addFactor, parentUuid, parentType);
			}
			if(addFactor.keySet().contains("queryUuid")){
				this.factorOperatorService.updateFactorQuery(addFactor);
			}
		}
		
		out2site(JSONObject.fromMap(addFactor).toString(), rep); 
	}
	
	
	@RequestMapping("/saveRelation.do") 
	public void saveRelation(HttpServletRequest req,
							HttpServletResponse rep){
		Map<String, Object> addRelation = BoomBeanUtils.str2Map(
						(String)req.getParameter("addRecord"));
		
		List<Map<String, Object>> existRelations = this.factorOperatorService.loadRelation((String)addRelation.get("factor1Uuid"),
				(String)addRelation.get("factor2Uuid"));
		
		// 判断关系是否已经存在
		if(existRelations.size()>0 && 
				!existRelations.get(0).get("uuid").equals(addRelation.get("uuid"))){
			JSONObject jo = new JSONObject();
			jo.put("duplicate", true);
			out2site(jo.toString(), rep); 
			return;
		}
		
		//判断是更新还是创建 
		if(StringUtils.isNotBlank((String)addRelation.get("uuid"))){
			this.factorOperatorService.updateRelation(addRelation);
		}else{
			this.factorOperatorService.saveRelation(addRelation);
		}
		out2site("{}", rep); 
	}
	/**
	 * 更新因子实例值
	 * @param factorUuid 因子实例uuid
	 * @param value 因子值
	 * @param rep
	 */
	@RequestMapping("/updateValue.do") 
	public void updateValue(@RequestParam String factorUuid,
							@RequestParam String value,
							HttpServletResponse rep){
		this.factorOperatorService.updateFactorValue(factorUuid, value);
	}
	/**
	 * 更新因子实例的名称
	 * @param factorUuid 因子实例uuid
	 * @param instName 因子实例name
	 * @param rep
	 */
	@RequestMapping("/updateInstName.do") 
	public void updateInstName(@RequestParam String factorUuid,
							@RequestParam String instName,
							HttpServletResponse rep){
		this.factorOperatorService.updateFactorInstName(factorUuid, instName);
	}
	/**
	 * 如果因子类型是表达式类型，更新表达式
	 * @param factorUuid 因子实例uuid
	 * @param expression 因子表达式
	 * @param rep
	 */
	@RequestMapping("/updateExpression.do") 
	public void updateExpression(@RequestParam String factorUuid,
							@RequestParam String expression,
							HttpServletResponse rep){
		this.factorOperatorService.updateFactorExpression(factorUuid, expression);
	}
	
	@RequestMapping("/updateValues.do") 
	public void updateValues(@RequestParam String records,
							HttpServletResponse rep){
		List<Map<String, Object>> factorList = BoomBeanUtils.jsonArray2List(JSONArray.fromString(records));
		this.factorOperatorService.updateFactorValues(factorList);
	}
	
	@RequestMapping("/updateLayout.do")
	public void updateLayout(@RequestParam String records,
							HttpServletResponse rep){
		List<Map<String, Object>> positions = BoomBeanUtils.jsonArray2List(JSONArray.fromString(records));
		
		this.factorOperatorService.updateLayout(positions);
	}
	
	@RequestMapping("/deleteFactorInstances.do") 
	public void deleteFactorInstances(@RequestParam JSONArray deleteFactorInstances,HttpServletRequest req,
									HttpServletResponse rep){
		List<Map<String, Object>> factors = BoomBeanUtils.jsonArray2List(deleteFactorInstances);
		this.factorOperatorService.deleteFactorByCascade(factors);
	}
	@RequestMapping("/deleteFactorInstance.do") 
	public void deleteFactorInstance(@RequestParam String factorUuid,
									HttpServletRequest req,
									HttpServletResponse rep){
		String defineUuid = req.getParameter("defineUuid");
		Map<String, Object> factor = new HashMap<String, Object>();
		factor.put("uuid", factorUuid);
		factor.put("defineUuid", defineUuid);
		List<Map<String, Object>> factors = new ArrayList<Map<String,Object>>();
		factors.add(factor);
		this.factorOperatorService.deleteFactorByCascade(factors);
	}
	@RequestMapping("/deleteRelations.do") 
	public void deleteRelations(@RequestParam JSONArray deleteRelations,HttpServletRequest req,
									HttpServletResponse rep){
		List<Map<String, Object>> relations = BoomBeanUtils.jsonArray2List(deleteRelations);
		this.factorOperatorService.deleteRelationByCascade(relations);
	}
	@RequestMapping("/deleteRelation.do") 
	public void deleteRelation(@RequestParam String relationUuid,
								HttpServletResponse rep){
		Map<String, Object> relation = new HashMap<String, Object>();
		relation.put("uuid", relationUuid);
		List<Map<String, Object>> relations = new ArrayList<Map<String,Object>>();
		relations.add(relation);
		this.factorOperatorService.deleteRelationByCascade(relations);
	}
	@RequestMapping("/deleteLayoutDefine.do") 
	public void deleteLayoutDefine(@RequestParam String record,
								HttpServletResponse rep){
		Map<String, Object> deleteLayoutDefine = BoomBeanUtils.str2Map(record);
		
		this.factorOperatorService.deleteLayoutDefine(deleteLayoutDefine);
	}
	
	@RequestMapping("/layoutAlgorithm.do") 
	public void layoutAlgorithm(@RequestParam String type, 
							@RequestParam String factors, 
							@RequestParam String relations, 
							HttpServletResponse rep){
		
		List<Map<String, Object>> factorList = BoomBeanUtils.jsonArray2List(JSONArray.fromString(factors));
		List<Map<String, Object>> relationList = BoomBeanUtils.jsonArray2List(JSONArray.fromString(relations));
		
		this.factorOperatorService.layoutAlgorithm(type, factorList, relationList);
		
		out2site(factorList, rep); 
	}
	@RequestMapping("/getExpressionValue.do") 
	public void getExpressionValue(@RequestParam String expression,
							HttpServletRequest req,
							HttpServletResponse rep){
		Map<String, Object> conditionMap = BoomBeanUtils.str2Map(req.getParameter("variables"));
		List<Variable> variables=new ArrayList<Variable>();
		for(String key:conditionMap.keySet()){
			variables.add(new Variable(key,DataType.DATATYPE_INT, conditionMap.get(key)));
		}
		Object result = ExpressionEvaluator.evaluate(expression,variables);
//		variables.add(Variable.createVariable("用户名", s));
//		variables.add(Variable.createVariable("月份", 4));
//		variables.add(Variable.createVariable("aa", "es"));
//		Object result=ExpressionEvaluator.evaluate(expression,variables);
//		Object result2=ExpressionEvaluator.evaluate(expString, variables);		
		out2site(result.toString(), rep); 
	}
	
	
}
