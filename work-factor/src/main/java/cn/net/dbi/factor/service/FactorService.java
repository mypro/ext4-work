package cn.net.dbi.factor.service;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;

import cn.net.dbi.boom.jdbc.CommonHibernateDao;
import cn.net.dbi.boom.property.PropertyUtils;
import cn.net.dbi.factor.FactorConstant;
import cn.net.dbi.param.ParamService;
import cn.net.dbi.param.bean.ParamDefine;
import cn.net.dbi.param.bean.ParamValue;
import cn.net.dbi.table.model.TableModel;
import cn.net.dbi.table.operator.data.query.BranchNode;
import cn.net.dbi.table.operator.data.query.IConditionNode;
import cn.net.dbi.table.operator.data.query.LeaveNode;
import cn.net.dbi.table.service.DataService;
import cn.net.dbi.table.service.TableService;

public class FactorService extends TableService {
	
//	private CommonHibernateDao dao;
//	
//	@Autowired
//	private ParamService paramService;
//	
//	@Autowired
//	private DataService dataService;
//	
//	public void setParamService(ParamService paramService) {
//		this.paramService = paramService;
//	}
//
//	public void setDataService(DataService dataService) {
//		this.dataService = dataService;
//	}
//
//	public void setDao(CommonHibernateDao dao) {
//		this.dao = dao;
//	}
//
//	public TableModel getFactorTableModel(){
//		final String tableName = PropertyUtils.getValue
//						(FactorConstant.CONFIG_KEYWORD_TFACTOR);
//		return this.getTableModelByName(tableName);
//	}
//	
//	public TableModel getFactorPropertyTableModel(){
//		final String tableName = PropertyUtils.getValue
//				(FactorConstant.CONFIG_KEYWORD_TFACTORPROPERTY);
//		return this.getTableModelByName(tableName);
//	}
//	
//	public TableModel getRelationTableModel(){
//		final String tableName = PropertyUtils.getValue
//						(FactorConstant.CONFIG_KEYWORD_TRELATION);
//		return this.getTableModelByName(tableName);
//	}
//	
//	public TableModel getRelationPropertyTableModel(){
//		final String tableName = PropertyUtils.getValue
//						(FactorConstant.CONFIG_KEYWORD_TRELATIONPROPERTY);
//		return this.getTableModelByName(tableName);
//	}
//	
//	@Transactional(propagation=Propagation.REQUIRED)
//	public void deleteFactor(String deleteUuid){
//		// 删除因子表
//		TableModel tm = this.getFactorTableModel();
//		List<Map<String, Object>> conditions = new ArrayList<Map<String,Object>>();
//		Map<String, Object> condition = new HashMap<String, Object>();
//		condition.put("uuid", deleteUuid);
//		conditions.add(condition);
//		dataService.delete(tm, conditions);
//		
//		// 删除因子属性表
//		TableModel factorPropertyModel = this.getFactorPropertyTableModel();
//		BranchNode bn = new BranchNode("and");
//		LeaveNode left = LeaveNode.getAlwaysTrue();
//		LeaveNode right = new LeaveNode();
//		right.setKeyValue("factorUuid", deleteUuid);
//		bn.setLeftChild(left);
//		bn.setRightChild(right);
//		dataService.delete(factorPropertyModel, bn);
//		
//		/*------------------ 删除关系属性表  ------------------------*/
//		TableModel relationModel = this.getRelationTableModel();
//		TableModel relationPropertyModel = this.getRelationPropertyTableModel();
//		// 先根据因子uuid查询到所有关系
//		BranchNode queryRelationBn = new BranchNode("or");
//		LeaveNode queryRelationLeft = new LeaveNode();
//		queryRelationLeft.setKeyValue("factor1Uuid", deleteUuid);
//		LeaveNode queryRelationRight = new LeaveNode();
//		queryRelationRight.setKeyValue("factor2Uuid", deleteUuid);
//		queryRelationBn.setLeftChild(queryRelationLeft);
//		queryRelationBn.setRightChild(queryRelationRight);
//		List<Map<String, Object>>relations = dataService.queryByBranch(relationModel, 
//				Collections.EMPTY_LIST, queryRelationBn) ;
//		
//		// 删除关系涉及的属性和关系本身
//		if(relations.size()>0){
//			// 删除关系属性
//			Iterator<Map<String, Object>> relationIt = relations.iterator();
//			IConditionNode node = LeaveNode.getAlwaysFalse();
//			while(relationIt.hasNext()){
//				Map<String, Object> relation = relationIt.next();
//				BranchNode b = new BranchNode("or");
//				LeaveNode r = new LeaveNode();
//				r.setKeyValue("relationUuid", relation.get("uuid"));
//				b.setLeftChild(node);
//				b.setRightChild(r);
//				node = b;
//			}
//			dataService.delete(relationPropertyModel, (BranchNode)node);
//			
//			// 删除关系表
//			dataService.delete(relationModel, relations);
//		}
//		
//	}
//	
//	@Transactional(propagation=Propagation.REQUIRED)
//	public void deleteRelation(String deleteUuid){
//		// 删除关系表
//		TableModel tm = this.getRelationTableModel();
//		List<Map<String, Object>> conditions = new ArrayList<Map<String,Object>>();
//		Map<String, Object> condition = new HashMap<String, Object>();
//		condition.put("uuid", deleteUuid);
//		conditions.add(condition);
//		dataService.delete(tm, conditions);
//		
//		// 删除关系属性表
//		TableModel propertyModel = this.getRelationPropertyTableModel();
//		BranchNode bn = new BranchNode("and");
//		LeaveNode left = LeaveNode.getAlwaysTrue();
//		LeaveNode right = new LeaveNode();
//		right.setKeyValue("relationUuid", deleteUuid);
//		bn.setLeftChild(left);
//		bn.setRightChild(right);
//		dataService.delete(propertyModel, bn);
//	}
//	
//	@Transactional(propagation=Propagation.REQUIRED)
//	public void deleteParamValue(ParamValue deletePv, TableModel tm){
//		// 删除参数值
//		paramService.saveOrUpdateParam(null, null, null,
//		Arrays.asList(new ParamValue[]{deletePv}));
//		
//		// 删除相应的因子属性
//		BranchNode bn = new BranchNode("and");
//		LeaveNode left = new LeaveNode();
//		left.setKeyValue("1", "1");
//		LeaveNode right = new LeaveNode();
//		right.setKeyValue("paramValueUuid", deletePv.getUuid());
//		bn.setLeftChild(left);
//		bn.setRightChild(right);
//		dataService.delete(tm, bn);
//	}
}
