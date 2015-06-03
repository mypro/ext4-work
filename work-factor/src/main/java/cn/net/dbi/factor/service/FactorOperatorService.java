package cn.net.dbi.factor.service;

import java.util.*;

import net.sf.json.JSONArray;
import net.sf.json.JSONNull;
import net.sf.json.JSONObject;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.Predicate;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import cn.net.dbi.algorithm.layout.element.Node;
import cn.net.dbi.algorithm.layout.element.Relation;
import cn.net.dbi.algorithm.layout.CircleAlg;
import cn.net.dbi.algorithm.layout.Constants;
import cn.net.dbi.algorithm.layout.GeneralAlg;
import cn.net.dbi.algorithm.layout.TreeAlg;
import cn.net.dbi.boom.jdbc.CommonHibernateDao;
import cn.net.dbi.boom.utils.BoomBeanUtils;
import cn.net.dbi.boom.utils.BoomCollectionsUtils;
import cn.net.dbi.boom.utils.DateUtils;
import cn.net.dbi.boom.utils.NumberUtils;
import cn.net.dbi.boom.utils.PKUtils;
import cn.net.dbi.factor.FactorConstant;
import cn.net.dbi.factor.FactorPropertyUtils;
import cn.net.dbi.factor.exception.InValidFactorDefineException;
import cn.net.dbi.factor.model.ProjectInfo;
import cn.net.dbi.table.ConstantInfo;
import cn.net.dbi.table.model.TableInfo;
import cn.net.dbi.table.model.TableModel;
import cn.net.dbi.table.operator.data.query.BranchNode;
import cn.net.dbi.table.operator.data.query.IConditionNode;
import cn.net.dbi.table.operator.data.query.LeaveNode;
import cn.net.dbi.table.service.DataService;
import cn.net.dbi.table.service.TableService;
import cn.net.dbi.factor.FactorConstant;

public class FactorOperatorService {
	
	@Autowired
	private CommonHibernateDao commonHibernateDao;
	
	@Autowired
	private TableService tableService;
	
	@Autowired
	private DataService dataService;
	
	public DataService getDataService() {
		return dataService;
	}

	/**
	 * ***************************************************************************
	 * 
	 * 
	 * ****************************public load ***********************************
	 * 
	 * 
	 * ***************************************************************************
	 */
	public ProjectInfo loadProjectInfo(){
		ProjectInfo pi = new ProjectInfo(this);
		pi.init();
		return pi;
	}
	
	public List<Map<String, Object>> loadLayoutDefine(){
		TableModel factorLayoutDefineTm = FactorConstant.getFactorLayoutDefine();
		
		return this.dataService.query(factorLayoutDefineTm, Arrays.asList(new String[]{"*"}), null);
	}
	
	public List<Map<String, Object>> loadLayout(){
		TableModel factorLayoutTm = FactorConstant.getFactorLayout();
		
		return this.dataService.query(factorLayoutTm, Arrays.asList(new String[]{"*"}), null);
	}
	
	/**
	 * 加载因子定义
	 * @param conditionMap
	 * @return
	 */
	public List<Map<String, Object>> loadFactorDefine(Map<String, Object> conditionMap){
		TableModel factorDefineTM = FactorConstant.getFactorDefineTM();
		
		List<Map<String, Object>> factorDefines = this.dataService.query(
				factorDefineTM, Arrays.asList(new String[]{"*"}), conditionMap);
		
		for(Iterator<Map<String, Object>> it = factorDefines.iterator();it.hasNext();) {
			Map<String, Object> define = it.next();
			define.put("defineUuid", define.get("uuid"));
			define.put("uuid", "");
		}
		
		return factorDefines;
	}
	
	/**
	 * 加载因子实例
	 * @param conditionMap
	 * @return
	 */
	public List<Map<String, Object>> loadFactorInstance(Map<String, Object> conditionMap){
		TableModel factorInstTM = FactorConstant.getFactorInstTM();
		TableModel factorDefineTM = FactorConstant.getFactorDefineTM();
		
		List<Map<String, Object>> results = dataService.query(factorInstTM, 
							Arrays.asList(new String[]{"*"}), conditionMap);
		
		this.dataService.extendData(factorDefineTM, results, "defineUuid");
		this.formatValue(results); 
		
		return results;
	}
	
	/**
	 * 加载属性
	 * @param parentUuid
	 * @param parentType	0： 因子属性   1：关系属性
	 * @return
	 */
	public List<Map<String, Object>> loadProperty(String parentUuid, String parentType){
		
		Map<String, Object> conditionMap = new HashMap<String, Object>();
		conditionMap.put("factor1Uuid", parentUuid);
		conditionMap.put("type", Integer.parseInt(parentType));
		List<Map<String, Object>> factorRelations = this.loadProperty(conditionMap);

		return factorRelations;
	}
	
	/**
	 * 查询两个因子的关系，无论谁先谁后
	 * 
	 * @param factor1Uuid
	 * @param factor2Uuid
	 * @return
	 */
	public List<Map<String, Object>> loadRelation(String factor1Uuid, String factor2Uuid){
		TableModel factorRelationTM = FactorConstant.getFactorRelationTM();
		
		BranchNode bnOr = getRelationCondition(factor1Uuid, factor2Uuid);
		BranchNode bnAnd = new BranchNode("and");
		LeaveNode leafNode = new LeaveNode();
		leafNode.setKeyValue("type", FactorConstant.RELATION_TYPE_FACTOR);
		bnAnd.setLeftChild(leafNode);
		bnAnd.setRightChild(bnOr);
		
		List<Map<String, Object>> relations = this.dataService.queryByBranch(factorRelationTM,
				Arrays.asList(new String[]{"*"}), bnAnd);
		
		return relations;
	}
	
	
	
	
	/**
	 * ****************************public saveOrUpdate ***********************************
	 */
	/** 
	 * 级联的导入因子
	 * @param factor
	 */
	@Transactional(propagation=Propagation.REQUIRED)
	public void importFactorByCascade(Map<String, Object> factor){
		FactorData data = new FactorData(this.dataService);
		gatherDataFromFactor(factor, data);
		data.persist();
	}
	
	/** 
	 * 级联的导入因子的关系
	 * @param factor
	 */
	@Transactional(propagation=Propagation.REQUIRED)
	public void importRelationByCascade(Map<String, Object> relation){
		FactorData data = new FactorData(this.dataService);
		gatherDataFromRelation(relation, data);
		data.persist();
	}
	
	/**
	 * 新增加因子定义
	 * 
	 * @param addFactor
	 * @param parentUuid    因子的uuid，或者关系的uuid
	 * @param parentType	0：表示因子是因子的属性  1：表示因子是关系的属性
	 * @return
	 */
	@Transactional(propagation=Propagation.REQUIRED)
	public String addFactorDefine(Map<String, Object> addFactor){
		//---------------------------保存因子定义------------------------------------
		TableModel factorDefineTM = FactorConstant.getFactorDefineTM();
		String defineUuid = dataService.insert(factorDefineTM,addFactor);
		addFactor.put("defineUuid", defineUuid);

		return defineUuid;
	}
	
	/**
	 * 新增因子实例
	 * 
	 * @param defineUuids
	 * @param parentUuid
	 */
	@Transactional(propagation=Propagation.REQUIRED)
	public void saveFactorInstance(Map<String, Object> addFactor, String parentUuid, String parentType){
		//---------------------------保存因子实例------------------------------------
		TableModel factorInstTM = FactorConstant.getFactorInstTM();
		Map<String, Object> instance = new HashMap<String, Object>();
		instance.put("defineUuid", addFactor.get("defineUuid"));
		String instanceUuid = this.dataService.insert(factorInstTM, addFactor);
		addFactor.put("uuid", instanceUuid);
		
		//---------------------------保存因子关系-------------------------------------
		if(StringUtils.isNotBlank(parentUuid)){
			TableModel factorRelationTM = FactorConstant.getFactorRelationTM();
			addFactor.put("factor1Uuid", parentUuid);
			addFactor.put("factor2Uuid", instanceUuid);
			addFactor.put("type", Integer.parseInt(parentType));
			addFactor.remove("uuid");
			String relationUuid = this.dataService.insert(factorRelationTM, addFactor);
			addFactor.put("relationUuid", relationUuid);
			addFactor.put("uuid", instanceUuid);
		}
	}
	
	/**
	 * 保存因子关系
	 * @param addRelation
	 */
	public void saveRelation(Map<String, Object> addRelation){
		TableModel factorRelationTM = FactorConstant.getFactorRelationTM();
		this.dataService.insert(factorRelationTM, addRelation);
	}
	
	/**更新因子关系
	 * @param updateRelation
	 */
	public void updateRelation(Map<String, Object> updateRelation){
		TableModel factorRelationTM = FactorConstant.getFactorRelationTM();
		
		this.dataService.updateByUuid(factorRelationTM, updateRelation, 
									(String)updateRelation.get("uuid"));
	}
	
	
	/**
	 * 更新因子定义
	 * @param updateFactor
	 */
	@Transactional(propagation=Propagation.REQUIRED)
	public void updateFatorDefine(Map<String, Object> updateFactor){
		String defineUuid = (String)updateFactor.get("defineUuid");
		//---------------------------若修改了数据类型，则清空所有因子实例的值-----------------
		TableModel factorDefineTM = FactorConstant.getFactorDefineTM();
		TableModel factorInstTM = FactorConstant.getFactorInstTM();
		Map<String, Object> factorDefine = dataService.queryByUuid(factorDefineTM, Arrays.asList(new String[]{"dataType"}),
																	defineUuid);
		if(null == factorDefine){
			throw new InValidFactorDefineException(
					"invalid factor define : "+updateFactor.get("defineUuid"));
		}
		/* 若因子数据类型发生变化，则清空因子实例的值*/
		if(!factorDefine.get("dataType").equals(updateFactor.get("dataType").toString())){
			Map<String, Object> keyValue = new HashMap<String, Object>();
			keyValue.put("value", null);
			LeaveNode condition = new LeaveNode();
			condition.setKeyValue("defineUuid", defineUuid);
			this.dataService.update(factorInstTM, keyValue, condition);
		}
		
		//---------------------------更新因子定义------------------------------------
		LeaveNode condition = new LeaveNode();
		condition.setKeyValue("uuid", defineUuid);
		dataService.update(factorDefineTM,updateFactor,condition);
	}
	
	/**
	 * 更新因子的定义UUID
	 * 
	 * @param factorUuid
	 * @param defineUuid
	 */
	public void updateFactorDefineUuid(String factorUuid, String defineUuid){
		TableModel factorInstTM = FactorConstant.getFactorInstTM();
		
		Map<String, Object> keyValue = new HashMap<String, Object>();
		keyValue.put("defineUuid", defineUuid);
		this.dataService.updateByUuid(factorInstTM, keyValue, factorUuid);
	}
	
	
	public void updateFactorValues(List<Map<String, Object>> factors){
		TableModel factorInstTM = FactorConstant.getFactorInstTM();
		TableModel factorDefineTM = FactorConstant.getFactorDefineTM();
		
		this.dataService.extendData(factorDefineTM, factors, "defineUuid");
		// parseValue
		for(Iterator<Map<String, Object>> iterator=factors.iterator();iterator.hasNext();){
			Map<String, Object> factor = iterator.next();
			this.parseValue(factor);
		}
		
		this.dataService.update(factorInstTM, factors);
	}
	
	/**
	 * 更新因子实例的值
	 * @param factorUuid
	 * @param value
	 */
	public void updateFactorValue(String factorUuid, String value){
		TableModel factorInstTM = FactorConstant.getFactorInstTM();
		TableModel factorDefineTM = FactorConstant.getFactorDefineTM();
		
		Map<String, Object> factorInstance = this.dataService.queryByUuid(factorInstTM, 
				Arrays.asList(new String[]{"*"}), factorUuid);
		Map<String, Object> factorDefine = this.dataService.extendData(factorDefineTM, factorInstance, "defineUuid");
		
		if("3".equals(factorDefine.get("dataType"))){
			Date date = DateUtils.tryConverStr2Date(value);
			if(null == date){
				value = null;
			}else{
				value = String.valueOf(date.getTime());
			}
		}
		
		/*
		 * 转换值的格式
		 */
		factorInstance.put("value", value);
		this.parseValue(factorInstance);
		
		/*
		 * 更新值
		 */
		Map<String, Object> keyValue = new HashMap<String, Object>();
		keyValue.put("value", factorInstance.get("value"));
		this.dataService.updateByUuid(factorInstTM, keyValue, factorUuid);
	}
	/**
	 * 更新因子实例的名称
	 * @param factorUuid
	 * @param value
	 */
	public void updateFactorInstName(String factorUuid, String instName){
		TableModel factorInstTM = FactorConstant.getFactorInstTM();
		TableModel factorDefineTM = FactorConstant.getFactorDefineTM();
		
		Map<String, Object> factorInstance = this.dataService.queryByUuid(factorInstTM, 
				Arrays.asList(new String[]{"*"}), factorUuid);
		Map<String, Object> factorDefine = this.dataService.extendData(factorDefineTM, factorInstance, "defineUuid");
		
		/*
		 * 转换值的格式
		 */
		factorInstance.put("instName", instName);
		this.parseValue(factorInstance);
		
		/*
		 * 更新值
		 */
		Map<String, Object> keyValue = new HashMap<String, Object>();
		keyValue.put("instName", factorInstance.get("instName"));
		this.dataService.updateByUuid(factorInstTM, keyValue, factorUuid);
	}
	/**
	 * 更新因子实例的函数表达式
	 * @param factorUuid
	 * @param value
	 */
	public void updateFactorExpression(String factorUuid, String expression){
		TableModel factorInstTM = FactorConstant.getFactorInstTM();
		TableModel factorDefineTM = FactorConstant.getFactorDefineTM();
		
		Map<String, Object> factorInstance = this.dataService.queryByUuid(factorInstTM, 
				Arrays.asList(new String[]{"*"}), factorUuid);
		Map<String, Object> factorDefine = this.dataService.extendData(factorDefineTM, factorInstance, "defineUuid");
		
		
		/*
		 * 转换值的格式
		 */
		factorInstance.put("expression", expression);
		this.parseValue(factorInstance);
		
		/*
		 * 更新值
		 */
		Map<String, Object> keyValue = new HashMap<String, Object>();
		keyValue.put("expression", factorInstance.get("expression"));
		this.dataService.updateByUuid(factorInstTM, keyValue, factorUuid);
	}
	/**
	 * 更新数据查询
	 */
	public void updateFactorQuery(Map<String, Object> updateFactor){
		TableModel factorInstTM = FactorConstant.getFactorInstTM();
		TableModel factorDefineTM = FactorConstant.getFactorDefineTM();
		
		Map<String, Object> factorInstance = this.dataService.queryByUuid(factorInstTM, 
				Arrays.asList(new String[]{"*"}), updateFactor.get("uuid").toString());
		Map<String, Object> factorDefine = this.dataService.extendData(factorDefineTM, factorInstance, "defineUuid");
		
		
		/*
		 * 转换值的格式
		 */
		factorInstance.put("queryUuid", updateFactor.get("queryUuid"));
		factorInstance.put("valueKeyword", updateFactor.get("valueKeyword"));
		this.parseValue(factorInstance);
		
		/*
		 * 更新值
		 */
		Map<String, Object> keyValue = new HashMap<String, Object>();
		keyValue.put("queryUuid", factorInstance.get("queryUuid"));
		keyValue.put("valueKeyword", factorInstance.get("valueKeyword"));
		this.dataService.updateByUuid(factorInstTM, keyValue, (String)updateFactor.get("uuid"));
	}
	public void addLayoutDefine(Map<String, Object> layoutDefine){
		TableModel factorLayoutDefineTm = FactorConstant.getFactorLayoutDefine();
		String uuid = (String)layoutDefine.get("uuid");
		
		if(StringUtils.isNotBlank(uuid)){
			Map<String, Object> keyValue = new HashMap<String, Object>();
			BoomBeanUtils.extApply(keyValue, layoutDefine);
			this.dataService.updateByUuid(factorLayoutDefineTm, keyValue, uuid);
		}else{
			this.dataService.insert(factorLayoutDefineTm, layoutDefine);
		}
	}
	
	public void addLayout(List<Map<String, Object>> positions){
		TableModel factorLayoutTm = FactorConstant.getFactorLayout();
		
		this.dataService.insert(factorLayoutTm, positions);
	}
	
	public void updateLayout(List<Map<String, Object>> positions){
		TableModel factorLayoutTm = FactorConstant.getFactorLayout();
		
		this.dataService.update(factorLayoutTm, positions);
	}
	
	
	/**
	 * ****************************public delete ***********************************
	 */
	@Transactional(propagation=Propagation.REQUIRED)
	public void deleteRelationByCascade(List<Map<String, Object>> relations){
		FactorData data = new FactorData(this.dataService);
		ProjectInfo pi = new ProjectInfo(this);
		pi.init();
		for(Iterator<Map<String, Object>> relationIt=relations.iterator();relationIt.hasNext();){
			Map<String, Object> relation = relationIt.next();
			this.deleteDataFromRelation(pi, relation, data);
		}
		data.delete();
	}
	
	@Transactional(propagation=Propagation.REQUIRED)
	public void deleteFactorByCascade(List<Map<String, Object>> factors){
		FactorData data = new FactorData(this.dataService);
		ProjectInfo pi = new ProjectInfo(this);
		pi.init();
		for(Iterator<Map<String, Object>> factorIt=factors.iterator();factorIt.hasNext();){
			Map<String, Object> factor = factorIt.next();
			this.deleteDataFromFactor(pi, factor, data);
		}
		data.delete();
	}
	
	public void deleteLayoutDefine(Map<String, Object> layoutDefine){
		TableModel factorLayoutDefineTm = FactorConstant.getFactorLayoutDefine();
		TableModel factorLayoutTm = FactorConstant.getFactorLayout();
		
		// delete layoutdefine
		this.dataService.deleteByUuid(factorLayoutDefineTm, (String)layoutDefine.get("uuid"));
		
		// delete layout
		LeaveNode queryNode = new LeaveNode();
		queryNode.setKeyValue("defineUuid", layoutDefine.get("uuid"));
		this.dataService.delete(factorLayoutTm, queryNode);
	}
	
	/**
	 * ****************************public Algorithm ***********************************
	 */
	
	public void layoutAlgorithm(String type, List<Map<String, Object>> factors,
										List<Map<String, Object>> relations){
		
		List<Node> nodeList = new ArrayList<Node>();
		List<Relation> relationList = new ArrayList<Relation>();
		
		Map<String, Node> nodeMap = new HashMap<String, Node>();
		int id=1;
		for(Iterator<Map<String, Object>> factorIt=factors.iterator();factorIt.hasNext();){
			Map<String, Object> factor = factorIt.next();
			
			Node node = new Node();
			node.setId(id++);
			node.setUuid((String)factor.get("uuid"));
			node.setText((String)factor.get("name"));
			node.setCore("C".equals(FactorPropertyUtils.getLevelType(factor)));
			node.setSize(Integer.parseInt(FactorPropertyUtils.getSize(factor)));
			nodeList.add(node);
			
			nodeMap.put(node.getUuid(), node);
		}
		
		for(Iterator<Map<String, Object>> relationIt=relations.iterator();relationIt.hasNext();){
			Map<String, Object> relationObj = relationIt.next();
			
			Relation relation = new Relation();
			Node node1 = nodeMap.get(relationObj.get("factor1Uuid"));
			Node node2 = nodeMap.get(relationObj.get("factor2Uuid"));
			relation.setNode1(node1);
			relation.setNode2(node2);
			
			if(null==node1 || null==node2){
				continue;
			}
			node1.getNeighbourList().add(node2);
			node2.getNeighbourList().add(node1);
			
			relationList.add(relation);
		}
		
		switch(Integer.parseInt(type)){
		case Constants.LAYOUT_TYPE_BALANCE:
			GeneralAlg.calculate(nodeList, relationList);
			break;
		case Constants.LAYOUT_TYPE_CIRCLE:
			CircleAlg.calculate(nodeList, relationList);
			break;
		case Constants.LAYOUT_TYPE_TREE:
			TreeAlg.calculate(nodeList, relationList);
			break;
		default : 
			GeneralAlg.calculate(nodeList, relationList);
		}
		
		for(Iterator<Map<String, Object>> factorIt=factors.iterator();factorIt.hasNext();){
			Map<String, Object> factor = factorIt.next();
		
			Node node = nodeMap.get(factor.get("uuid"));
			factor.put("posX", node.getPosX());
			factor.put("posY", node.getPosY());
		}
		
	}
	/**
	 * ****************************private method below***********************************
	 */
	public List<Map<String, Object>> loadProperty(Map<String, Object> conditionMap){
		TableModel factorDefineTM = FactorConstant.getFactorDefineTM();
		TableModel factorInstTM = FactorConstant.getFactorInstTM();
		TableModel factorRelationTM = FactorConstant.getFactorRelationTM();
		
		List<Map<String, Object>> factorRelations = this.dataService.query(
							factorRelationTM, Arrays.asList(new String[]{"*"}), conditionMap);
		this.dataService.extendData(factorInstTM, factorRelations, "factor2Uuid");
		this.dataService.extendData(factorDefineTM, factorRelations, "defineUuid");
		
		for(Iterator<Map<String, Object>> it = factorRelations.iterator();it.hasNext();) {
			Map<String, Object> relation = it.next();
			relation.put("relationUuid", relation.get("uuid"));
			relation.put("uuid", relation.get("factor2Uuid"));
		}
		
		formatValue(factorRelations);
		return factorRelations;
	}
	
	private void parseValue(Map<String, Object> record){
		Object formatValue = record.get("value");
		if(formatValue instanceof JSONNull){
			formatValue = null;
		}
		int dataType = NumberUtils.tryGetInt(record.get("dataType"));
		switch (dataType) {
		case 1:
			break;
		case 2:
			break;
		case 3:
			if(StringUtils.isBlank((String)formatValue)
					|| "null".equals(formatValue)){
				
			}else{
				Date date = DateUtils.tryConverStr2Date((String)formatValue);
				if(null != date){
					formatValue = String.valueOf(date.getTime());
				}else{
					formatValue = null;
				}
			}
			break;
		default:
			break;
		}
		record.put("value", formatValue);
	}
	
	/**
	 * @param records
	 */
	private void formatValue(List<Map<String, Object>> records){
		for(Iterator<Map<String, Object>> it=records.iterator();it.hasNext();){
			Map<String, Object> record = it.next();
			String originalValue = (String)record.get("value");
			int dataType = NumberUtils.tryGetInt((String)record.get("dataType"));
			switch (dataType) {
			case 1:
				break;
			case 2:
				
				break;
			case 3:
				if(StringUtils.isBlank(originalValue)
						|| "null".equals(originalValue)){
					
				}else{
					Date date = new Date(Long.parseLong(originalValue));
					originalValue = DateUtils.convertDate2Str(date, 
							DateUtils.FORMATE_DAY);
				}
				break;
			default:
				break;
			}
			record.put("value", originalValue);
		}
	}
	
	/**
	 * 以2个因子作为条件
	 * 
	 * @param factor1Uuid
	 * @param factor2Uuid
	 * @return
	 */
	private BranchNode getRelationCondition(String factor1Uuid, String factor2Uuid){
		BranchNode bnOr = new BranchNode("or");
		
		BranchNode bnAnd1 = new BranchNode("and");
		LeaveNode leafNode1 = new LeaveNode();
		leafNode1.setKeyValue("factor1Uuid", factor1Uuid);
		LeaveNode leafNode2 = new LeaveNode();
		leafNode2.setKeyValue("factor2Uuid", factor2Uuid);
		bnAnd1.setLeftChild(leafNode1);
		bnAnd1.setRightChild(leafNode2);
		
		BranchNode bnAnd2 = new BranchNode("and");
		LeaveNode leafNode3 = new LeaveNode();
		leafNode3.setKeyValue("factor1Uuid", factor2Uuid);
		LeaveNode leafNode4 = new LeaveNode();
		leafNode4.setKeyValue("factor2Uuid", factor1Uuid);
		bnAnd2.setLeftChild(leafNode3);
		bnAnd2.setRightChild(leafNode4);
		
		bnOr.setLeftChild(bnAnd1);
		bnOr.setRightChild(bnAnd2);
		
		return bnOr;
	}
	
	/**
	 * 以1个因子作为条件
	 * 
	 * @param factorUuid
	 * @return
	 */
	private BranchNode getRelationCondition(String factorUuid){
		BranchNode bnOr = new BranchNode("or");
		
		LeaveNode leafNode1 = new LeaveNode();
		leafNode1.setKeyValue("factor1Uuid", factorUuid);
		LeaveNode leafNode2 = new LeaveNode();
		leafNode2.setKeyValue("factor2Uuid", factorUuid);
		
		bnOr.setLeftChild(leafNode1);
		bnOr.setRightChild(leafNode2);
		return bnOr;
	}
	
	/**
	 * 导入单个因子
	 * @param factor
	 */
	private void importSingleFactor(Map<String, Object> factor, FactorData factorData){
		TableInfo ti = ConstantInfo.getTableCache();
		/*
		 * 导入因子定义
		 */
		TableModel defineTm = FactorConstant.getFactorDefineTM();
		String defineUuid = (String)factor.get("defineUuid");
		Map<String, Object> factorDefine = ti.filterMap(defineTm, factor);
		factorDefine.put("uuid", defineUuid);
		factorDefine.put("seq", factor.get("seq"));
		defineUuid = factorData.add(factorData.defineData, factorDefine);
		factor.put("defineUuid", defineUuid);
		
		/*
		 * 导入因子实例
		 */
		TableModel instTm = FactorConstant.getFactorInstTM();
		parseValue(factor);
		Map<String, Object> factorInst = ti.filterMap(instTm, factor);
		String instUuid = factorData.add(factorData.instData, factorInst);
		factor.put("uuid", instUuid);
		parseValue(factor);
	}
	
	/**
	 * 导入单个关系
	 * @param relation
	 */
	private void importSingleRelation(Map<String, Object> relation, FactorData factorData){
		TableModel relationTm = FactorConstant.getFactorRelationTM();
		String relationUuid = factorData.add(factorData.relationData, relation);
		relation.put("uuid", relationUuid);
	}
	
	/**
	 * 级联导入因子时，收集因子和因子属性
	 * @param relation
	 * @param factorData
	 */
	private void gatherDataFromFactor(Map<String, Object> factor, FactorData factorData){
		TableInfo ti = ConstantInfo.getTableCache();
		TableModel relationTm = FactorConstant.getFactorRelationTM();
		
		// import single factor
		importSingleFactor(factor, factorData);
		
		// import child
		List<Map<String, Object>> childs = BoomBeanUtils.jsonArray2List(
				(JSONArray)factor.get("childs"));
		for(Iterator<Map<String, Object>> childIt=childs.iterator();childIt.hasNext();){
			Map<String, Object> child = childIt.next();
			// factor
			this.gatherDataFromFactor(child, factorData);
			// relation 
			Map<String, Object> propRelation = ti.filterMap(relationTm, child);
			propRelation.put("uuid", child.get("relationUuid"));
			propRelation.put("factor1Uuid", factor.get("uuid"));
			propRelation.put("factor2Uuid", child.get("uuid"));
			propRelation.put("seq", child.get("seq"));
			importSingleRelation(propRelation, factorData);
		}
		factor.put("childs", childs);
	}
	
	/**
	 * 级联导入关系时，收集关系和关系属性
	 * @param relation
	 * @param factorData
	 */
	private void gatherDataFromRelation(Map<String, Object> relation, FactorData factorData){
		TableInfo ti = ConstantInfo.getTableCache();
		TableModel relationTm = FactorConstant.getFactorRelationTM();
		
		// import single factor
		importSingleRelation(relation, factorData);
		
		// import child
		List<Map<String, Object>> childs = BoomBeanUtils.jsonArray2List(
				(JSONArray)relation.get("childs"));
		for(Iterator<Map<String, Object>> childIt=childs.iterator();childIt.hasNext();){
			Map<String, Object> child = childIt.next();
			// factor
			this.gatherDataFromFactor(child, factorData);
			// relation 
			Map<String, Object> propRelation = ti.filterMap(relationTm, child);
			propRelation.put("uuid", child.get("relationUuid"));
			propRelation.put("factor1Uuid", relation.get("uuid"));
			propRelation.put("factor2Uuid", child.get("uuid"));
			propRelation.put("seq", child.get("seq"));
			importSingleRelation(propRelation, factorData);
		}
		relation.put("childs", childs);
	}
	
	/**
	 * 级联删除关系时，收集关系和关系属性
	 * @param relation
	 * @param factorData
	 */
	private void deleteDataFromRelation(ProjectInfo pi, Map<String, Object> relation, 
									FactorData factorData){
		Map<String, Object> r;
		if(null != (r = pi.getRelation((String)relation.get("uuid")))){
			relation = r;
		}
		factorData.add(factorData.relationData, relation);
		
		JSONArray relationProps = (JSONArray)relation.get("childs");
		if(null != relationProps){
			for(int i=0;i<relationProps.length();i++){
				Map<String, Object> prop = new HashMap<String, Object>();
				prop.put("uuid", relationProps.getJSONObject(i).get("factor2Uuid"));
				prop.put("defineUuid", relationProps.getJSONObject(i).get("defineUuid"));
				deleteDataFromFactor(pi, prop, factorData);
				
				Map<String, Object> relationProp = new HashMap<String, Object>();
				relationProp.put("uuid", relationProps.getJSONObject(i).get("relationUuid"));
				factorData.add(factorData.relationData, relationProp);
			}
		}
	}
	
	/**
	 * 级联删除因子时，收集因子和因子属性,因子布局
	 * @param relation
	 * @param factorData
	 */
	private void deleteDataFromFactor(ProjectInfo pi, Map<String, Object> factor, 
									FactorData factorData){
		String uuid = (String)factor.get("uuid");
		String defineUuid = (String)factor.get("defineUuid");
		
		//------------------------删除因子实例--------------------------
  		factor = pi.getFactor(uuid);
		factorData.add(factorData.instData, factor);
		if(null != pi.getLayout(uuid)){
			// delete factor layout
			factorData.layoutData.addAll(pi.getLayout(uuid));		
		}
		if(StringUtils.isNotBlank(defineUuid)){
			pi.getFactorByDefine(defineUuid).remove(factor);
		}
		
		//------------------------删除因子所有属性-----------------------
		JSONArray factorProps = (JSONArray)factor.get("childs");
		if(null != factorProps){
			for(int i=0;i<factorProps.length();i++){
				Map<String, Object> prop = new HashMap<String, Object>();
				prop.put("uuid", factorProps.getJSONObject(i).get("factor2Uuid"));
				prop.put("defineUuid", factorProps.getJSONObject(i).get("defineUuid"));
				deleteDataFromFactor(pi, prop, factorData);
			}
		}
		
		// 删除因子作为属性存在的关系
		if(null != pi.getProp(uuid)){
			for(Iterator<Map<String, Object>> propIt = pi.getProp(uuid).iterator();propIt.hasNext();){
				Map<String, Object> relation = new HashMap<String, Object>();
				relation.put("uuid", propIt.next().get("relationUuid"));
				this.deleteDataFromRelation(pi, relation, factorData);
			}
		}
		
		//------------------------删除因子关系--------------------------
		List<Map<String, Object>> relations = pi.getRelationByFactor(uuid);
		for(Iterator<Map<String, Object>> relationIt = relations.iterator();relationIt.hasNext();){
			Map<String, Object> relation = relationIt.next();
			this.deleteDataFromRelation(pi, relation, factorData);
		}
		
		// 删除因子定义
		if(StringUtils.isNotBlank(defineUuid) && 0 == pi.getFactorByDefine(defineUuid).size()){
			Map<String, Object> define = new HashMap<String, Object>();
			define.put("uuid", defineUuid);
			factorData.add(factorData.defineData, define);
		}
		
	}
	
	
	/**
	 * 作为结构体，收集因子定义、实例、因子关系
	 */
	class FactorData{
		List<Map<String, Object>> defineData = new ArrayList<Map<String,Object>>();
		
		List<Map<String, Object>> instData = new ArrayList<Map<String,Object>>();
		
		List<Map<String, Object>> relationData = new ArrayList<Map<String,Object>>();
		
		List<Map<String, Object>> layoutData = new ArrayList<Map<String,Object>>();
		
		DataService dataService;
		
		public FactorData(DataService dataService){
			this.dataService = dataService;
		}
		
		String add(List<Map<String, Object>> data, Map<String, Object> record){
			String uuid = (String)record.get("uuid");
			if(StringUtils.isBlank(uuid)){
				uuid = PKUtils.getUUID();
				record.put("uuid", uuid);
			}
			data.add(record);
			return uuid;
		}
		
		void persist(){
			final List<Map<String, Object>> existFactorDefines = this.dataService.query(
					FactorConstant.getFactorDefineTM(), Arrays.asList(new String[]{""}), null);
			CollectionUtils.filter(this.defineData, new Predicate() {
				public boolean evaluate(Object object) {
					Map<String, Object> define = (Map<String, Object>)object;
					return null == BoomCollectionsUtils.containKV(existFactorDefines, "uuid", define.get("uuid"));
				}
			});
			
			this.dataService.insert(FactorConstant.getFactorDefineTM(), this.defineData);
			this.dataService.insert(FactorConstant.getFactorInstTM(), this.instData);
			this.dataService.insert(FactorConstant.getFactorRelationTM(), this.relationData);
		}
		
		void delete(){
			this.dataService.delete(FactorConstant.getFactorDefineTM(), this.defineData);
			this.dataService.delete(FactorConstant.getFactorInstTM(), this.instData);
			this.dataService.delete(FactorConstant.getFactorRelationTM(), this.relationData);
			this.dataService.delete(FactorConstant.getFactorLayout(), this.layoutData);
 		}
	}
}
