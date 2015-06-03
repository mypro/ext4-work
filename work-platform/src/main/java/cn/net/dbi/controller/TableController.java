package cn.net.dbi.controller;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import cn.net.dbi.boom.cache.CacheUtils;
import cn.net.dbi.boom.context.AppContextUtils;
import cn.net.dbi.boom.controller.BaseController;
import cn.net.dbi.boom.utils.BoomBeanUtils;
import cn.net.dbi.table.model.ColumnModel;
import cn.net.dbi.table.model.TableInfo;
import cn.net.dbi.table.model.TableModel;
import cn.net.dbi.table.operator.data.query.LeaveNode;
import cn.net.dbi.table.service.DataService;
import cn.net.dbi.table.service.TableService;

/**
 * 关于表的controller
 * 
 * 请通过url： localhost:8080/project/XXX.do来访问演示
 * 
 * @author hanheliang
 *
 */
@Controller
public class TableController extends BaseController {
	
	@RequestMapping("/addTreeNode.do")
	public String addTable(@RequestParam String keyword, HttpServletResponse rep){
		TableService service = (TableService)AppContextUtils.getAppContext().getBean("tableService");
		if(ishaved(keyword)){
			out2site("数据库中已有该表，保存失败！",rep);
		}else{
			TableModel tm = new TableModel();
			tm.setKeyword(keyword);
			tm.setName(keyword);
			tm.setModifyTime(new Date());
			service.createTable(tm, Collections.EMPTY_LIST, true);
			CacheUtils.setNeedReload("tableCache", true);
			out2site(tm.getUuid(),rep);
		}
		return null;
	}
	
	@RequestMapping("/getTable.do")
	public String getTable(@RequestParam String tableUuid, HttpServletResponse rep){
		
		TableInfo ti = (TableInfo)CacheUtils.getCacheInstance("tableCache");
		TableModel tm = ti.getTables().get(tableUuid);
		
		JSONObject data = JSONObject.fromBean(tm);
		
		out2site(data.toString(),rep);
		   
		return null;
	}

	@RequestMapping("/getTreeNode.do")
	public String getTreeNode(HttpServletResponse rep){
		TableInfo ti = (TableInfo)CacheUtils.getCacheInstance("tableCache");
		
		JSONArray data = new JSONArray();
		
		JSONObject db_Factor = new JSONObject();
		db_Factor.put("root", "因子库");
		
		JSONArray ja = new JSONArray();
		Map<String, TableModel> tbs=ti.getTables();
		for(String key : tbs.keySet()){
			TableModel t=tbs.get(key);
			JSONObject jo = JSONObject.fromBean(t);
			ja.put(jo);
		}
		
		db_Factor.put("children", ja);
		data.put(db_Factor);
		
		System.out.println("TreeNode:"+data.toString());
		out2site(data.toString(),rep);
		   
		return null;
	}
	
	@RequestMapping("/getTables.do")
	public String getTables(HttpServletResponse rep){
		TableInfo ti = (TableInfo)CacheUtils.getCacheInstance("tableCache");
		
		JSONArray ja = new JSONArray();
		Map<String, TableModel> tbs=ti.getTables();
		for(String key : tbs.keySet()){
			TableModel t=tbs.get(key);
			JSONObject jo = JSONObject.fromBean(t);
			ja.put(jo);
		}
		out2site(ja.toString(),rep);
		   
		return null;
	}
	@RequestMapping("/getTableColumns.do")
	public String getTableColumns(@RequestParam String tableUuid,HttpServletResponse rep){
		TableInfo ti = (TableInfo)CacheUtils.getCacheInstance("tableCache");
		Map<String, ColumnModel> columns = ti.getColumns(tableUuid);
		JSONArray ja = new JSONArray();
		for(String key : columns.keySet()){
			ColumnModel t=columns.get(key);
			JSONObject jo = JSONObject.fromBean(t);
			ja.put(jo);
		}
		out2site(ja.toString(),rep);
		   
		return null;
	}
	
	@RequestMapping("/createtable.do")
	public void createTable(@RequestParam JSONObject head ,@RequestParam JSONArray blnewsJson ,@RequestParam JSONArray sjnewsJson ,HttpServletRequest request,HttpServletResponse rep){
		String outStr="";//传到前台的通知，保存成功或失败
		String returnUuid="";
		TableService service = (TableService)AppContextUtils.getAppContext().getBean("tableService");
		
		if(ishaved(head.getString("tblname"))){
			outStr="数据库中已有该表，保存失败！";
		}else{
			returnUuid =service.createTable(getTable(head),getColumns(blnewsJson), true);
			if(sjnewsJson.length()>0){
				insertData(head.getString("tblname"),sjnewsJson,request,rep);
			}
			outStr="建表成功！";
			CacheUtils.setNeedReload("tableCache", true);
		}
		out2site( outStr+"uuid"+returnUuid,rep);
	}
	/**
	 * 建表之后把建表时输入的数据插入新表中
	 * @param tblname
	 * @param sjnewsJson
	 * @param request
	 * @param rep
	 */
	@RequestMapping("/insertData.do")
	public void insertData(@RequestParam String tableUuid,@RequestParam net.sf.json.JSONArray sjnewsJson ,HttpServletRequest request,HttpServletResponse rep){
		DataService service = (DataService)AppContextUtils.getAppContext().getBean("dataService");
		
		List<Map<String, Object>> values = BoomBeanUtils.jsonArray2List(sjnewsJson);
		
		TableInfo ti = (TableInfo)CacheUtils.getCacheInstance("tableCache");
		TableModel tm = ti.getTables().get(tableUuid);
		
		service.insert(tm,values);
		
	}
	@RequestMapping("/updateData.do")
	public void updateData(@RequestParam String tableUuid,@RequestParam JSONArray sjupdatesJson ,HttpServletRequest request,HttpServletResponse rep){
		DataService service = (DataService)AppContextUtils.getAppContext().getBean("dataService");
		
		List<Map<String, Object>> values = BoomBeanUtils.jsonArray2List(sjupdatesJson);
		
		TableInfo ti = (TableInfo)CacheUtils.getCacheInstance("tableCache");
		TableModel tm = ti.getTables().get(tableUuid);
		
		service.update(tm,values);
	}
	/*验证数据库是否包含该表*/
	protected boolean ishaved(String tblname){
		TableInfo ti = (TableInfo)CacheUtils.getCacheInstance("tableCache");
		Map<String, TableModel> tbs=ti.getTables();
			for(String key : tbs.keySet()){
				System.out.println(key+","+tbs.get(key));
				TableModel t=tbs.get(key);
				String keyword=t.getKeyword();
				if(tblname.equals(keyword)){
					return true;
				}
		}
			return false;
	}
	/**
	 * 删除表
	 * @param uuid
	 * @param rep
	 */
	@RequestMapping("/deletetable.do")
	public void deleteTable(@RequestParam String tbluuid ,HttpServletResponse rep){
		
		TableService service = (TableService)AppContextUtils.getAppContext().getBean("tableService");
		DataService dataService = (DataService)AppContextUtils.getAppContext().getBean("dataService");
		TableInfo ti = (TableInfo)CacheUtils.getCacheInstance("tableCache");
		if(StringUtils.isBlank(tbluuid)){
			out2site("表索引为【"+tbluuid+"】的表不存在", rep);
			return;
		}
		TableModel tm =  ti.getTables().get(tbluuid);
		List<String> resultNames = new ArrayList<String>();
		{
			resultNames.add("*");
		}
		List<Map<String, Object>> results = dataService.query(tm, resultNames, null);
		if(results.size()>0){
			out2site("表【"+tm.getName()+"】中存在【"+results.size()+"】条数据，不能删除", rep);
		}else{
			TableModel delTable=ti.getTables().get(tbluuid);
			service.deleteTable(delTable, true);
			out2site("删除成功！", rep);
		}
	}
	
	@RequestMapping("/updateTable.do")
	public void updateTable(@RequestParam String tbluuid ,@RequestParam String tblName ,@RequestParam String tblKeyword ,HttpServletResponse rep){
		
		TableService service = (TableService)AppContextUtils.getAppContext().getBean("tableService");
		TableInfo ti = (TableInfo)CacheUtils.getCacheInstance("tableCache");
		if(StringUtils.isBlank(tbluuid)){
			out2site("表索引为【"+tbluuid+"】的表不存在", rep);
			return;
		}
		TableModel tm =  ti.getTables().get(tbluuid);
		tm.setKeyword(tblKeyword);
		tm.setName(tblName);
		service.updateTable(tm, null, null, null);
		out2site("修改成功", rep);
	}
	/**
	 * 修改表名
	 * @param uuid
	 * @param rep
	 */
	@RequestMapping("/edittable.do")
	public void editTable(@RequestParam String uuid,@RequestParam String tblname ,HttpServletResponse rep){
		
		TableService service = (TableService)AppContextUtils.getAppContext().getBean("tableService");
		TableInfo ti = (TableInfo)CacheUtils.getCacheInstance("tableCache");
		TableModel delTable=ti.getTables().get(uuid);
		delTable.setKeyword(tblname);
		service.updateTable(delTable, null, null, null);
	
		out2site("修改成功！", rep);
	}

	/**
	 * 修改变量视图
	 * @param head
	 * @param blnewsJson
	 * @param blupdatesJson
	 * @param request
	 * @param rep
	 */
	@RequestMapping("/updateBl.do")
	public void updateBl(@RequestParam net.sf.json.JSONObject head ,
							  @RequestParam net.sf.json.JSONArray blnewsJson ,
							  @RequestParam net.sf.json.JSONArray blupdatesJson ,
							  HttpServletRequest request,
							  HttpServletResponse rep){
		
		TableService service = (TableService)AppContextUtils.getAppContext().getBean("tableService");
		TableInfo ti = (TableInfo)CacheUtils.getCacheInstance("tableCache");

		String uuid=(String) head.get("tbluuid");
		List<ColumnModel> addColumns=null;
		List<ColumnModel> updateColumns=null;
		/*插入表字段*/
		String newBLName="";
		if(blnewsJson.length()>0){
			addColumns = getAddCMS(blnewsJson);
			for(int i=0;i<addColumns.size();i++){
				newBLName+=","+addColumns.get(i).getName()==null?addColumns.get(i).getKeyword():addColumns.get(i).getName();
			}
		}
		/*修改表字段*/
		String updateBLName="";
		if(blupdatesJson.length()>0){
			updateColumns = getAddCMS(blupdatesJson);
			for(int i=0;i<updateColumns.size();i++){
				updateBLName+=","+updateColumns.get(i).getName()==null?updateColumns.get(i).getKeyword():updateColumns.get(i).getName();
			}
		}
		service.updateTable(ti.getTables().get(uuid), addColumns, updateColumns, null);

		out2site("保存成功", rep);
		
	}
	/**
	 * 修改数据视图
	 * @param head
	 * @param sjnewsJson
	 * @param sjupdatesJson
	 * @param request
	 * @param rep
	 */
	@RequestMapping("/updateSj.do")
	public void updateSJ(@RequestParam JSONObject head ,
							  @RequestParam JSONArray sjnewsJson ,
							  @RequestParam JSONArray sjupdatesJson ,
							  HttpServletRequest request,
							  HttpServletResponse rep){
		
		String uuid=(String) head.get("tbluuid");
		/*插入数据*/
		if(sjnewsJson.length()>0){
			insertData(uuid,sjnewsJson,request,rep);
		}
		/*修改数据*/
		if(sjupdatesJson.length()>0){
			updateData(uuid,sjupdatesJson,request,rep);
		}

		out2site("保存成功", rep);
		
	}
	private List<ColumnModel> getAddCMS(net.sf.json.JSONArray blnewsJson){
		List<ColumnModel> addColumns = null;
		addColumns = new ArrayList<ColumnModel>();
		for (int i = 0; i < blnewsJson.length(); i++) {
			ColumnModel cm = new ColumnModel();
			net.sf.json.JSONObject jo = (net.sf.json.JSONObject) blnewsJson.get(i);
			cm = (ColumnModel)net.sf.json.JSONObject.toBean(jo, ColumnModel.class);
			cm.setModifyTime(new Date());
			addColumns.add(cm);
		}
		return addColumns;
	}

	/**
	 * 删除数据及字段
	 * @param head
	 * @param delBLJson
	 * @param delSJJson
	 * @param request
	 * @return
	 */
	@RequestMapping("/deletedata.do")
	public void deleteData(@RequestParam net.sf.json.JSONObject head,
						@RequestParam net.sf.json.JSONArray delBLJson,
						@RequestParam net.sf.json.JSONArray delSJJson, 
						HttpServletResponse rep){
		
		DataService service = (DataService)AppContextUtils.getAppContext().getBean("dataService");
		TableService tableService = (TableService)AppContextUtils.getAppContext().getBean("tableService");
		
		TableInfo ti = (TableInfo)CacheUtils.getCacheInstance("tableCache");
		String uuid = (String) head.get("tbluuid");
		TableModel tm = ti.getTables().get(uuid);
		
		if(delSJJson.length()>0){
			List<Map<String, Object>> conditions = BoomBeanUtils.jsonArray2List(delSJJson);
			service.delete(tm, conditions);
		}
		List<ColumnModel> delColumns;
		String delSJ="";
		if(delBLJson.length()>0){
			delColumns=getAddCMS(delBLJson);
			tableService.updateTable(tm,null,null,delColumns);
			for(int i=0;i<delColumns.size();i++){
				delSJ+=","+delColumns.get(i).getKeyword();
			}
		}
		String message="删除成功";
		out2site(message, rep);
	}
	@RequestMapping("/queryColumns.do")
	public void queryColumns(@RequestParam String uuid,HttpServletResponse rep ){
		TableInfo ti = (TableInfo)CacheUtils.getCacheInstance("tableCache");
		
		if(StringUtils.isBlank(uuid)){
			return ;
		}
		
		Map<String, ColumnModel> columns = ti.getColumns(uuid);
		if(null== columns){
			return;
		}
		
		JSONArray data = BoomBeanUtils.map2JsonArray(ti.getColumns(uuid));
		
		out2site(data.toString(),rep);
	}
	
	@RequestMapping("/queryAllParams.do")
	public void queryAllParams(@RequestParam String tblUuid ,HttpServletResponse rep){
		DataService service = (DataService)AppContextUtils.getAppContext().getBean("dataService");
		TableInfo ti = (TableInfo)CacheUtils.getCacheInstance("tableCache");

		if(StringUtils.isBlank(tblUuid)){
			return;
		}
		
		TableModel tm =  ti.getTables().get(tblUuid);
		List<String> resultNames = new ArrayList<String>();
		{
			resultNames.add("*");
		}
		
		List<Map<String, Object>> results = service.query(tm, resultNames, null);
		
		JSONObject defines = new JSONObject();
		for(int i=0;i<results.size();i++){
			Map<String, Object> result = results.get(i);

			String defineUuid = (String)result.get("defineUuid");
			JSONArray define = (JSONArray)defines.opt(defineUuid);
			if(null == define){
				define = new JSONArray();
				defines.put(defineUuid, define);
			}
			define.put(JSONObject.fromMap(result));
		}
		out2site(defines.toString(),rep);
	}
	
	@RequestMapping("/queryParamsByDefineUUid.do")
	public void queryParamsByDefineUUid(@RequestParam String tblUuid ,@RequestParam String defineUuid ,HttpServletResponse rep){
		DataService service = (DataService)AppContextUtils.getAppContext().getBean("dataService");
		TableInfo ti = (TableInfo)CacheUtils.getCacheInstance("tableCache");

		if(StringUtils.isBlank(tblUuid)){
			return;
		}
		
		TableModel tm =  ti.getTables().get(tblUuid);
		 //鏌ヨ椤�
		List<String> resultNames = new ArrayList<String>();
		{
			resultNames.add("*");
		}
		// 鏌ヨ鏉′欢
		Map<String, Object> conditions = new HashMap<String, Object>();
		conditions.put("defineUuid", defineUuid);
		
		List<Map<String, Object>> results = service.query(tm, resultNames, conditions);
		
		JSONArray ja = new JSONArray();
		for(int i=0;i<results.size();i++){
			Map<String,Object> m = results.get(i);
			JSONObject jo = JSONObject.fromMap(m);
			ja.put(jo);
		}
		out2site(ja.toString(),rep);
	}
	@RequestMapping("/queryParamsByDefineName.do")
	public void queryParamsByDefineName(@RequestParam String tblUuid ,@RequestParam String defineName ,HttpServletResponse rep){
		DataService service = (DataService)AppContextUtils.getAppContext().getBean("dataService");
		TableInfo ti = (TableInfo)CacheUtils.getCacheInstance("tableCache");
		try {
			defineName = URLDecoder.decode(defineName,"utf-8");
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		if(StringUtils.isBlank(tblUuid)){
			return;
		}
		TableModel tm =  ti.getTables().get(tblUuid);
		List<String> resultNames = new ArrayList<String>();
		{
			resultNames.add("DISTINCT(defineUuid)");
			resultNames.add("defineName");
		}
		//List<Map<String, Object>> results = service.fuzzyQuery(tm, "defineName", defineName);
		/*BranchNode and1 = new BranchNode("and");
		LeaveNode d = new LeaveNode();
		d.setKeyValue("D", 3);
		d.setSymbol("=");
		LeaveNode a = new LeaveNode();
		a.setKeyValue("A", "abc");*/
		/*BranchNode or1 = new BranchNode("or");
		and1.setLeftChild(or1);
		and1.setRightChild(d);
		
		or1.setLeftChild(a);
		or1.setRightChild(b);*/
		LeaveNode b = new LeaveNode();
		b.setKeyValue("defineName", "%"+defineName+"%");
		b.setSymbol("like");
		
		List<Map<String, Object>> results = service.queryByBranch(tm, resultNames, b);
		JSONArray ja = new JSONArray();
		for(int i=0;i<results.size();i++){
			Map<String,Object> m = results.get(i);
			JSONObject jo = JSONObject.fromMap(m);
			ja.put(jo);
		}
		out2site(ja.toString(),rep);
	}
	/**
	 * 查询用户建表的数据
	 * @param uuid 表uuid
	 * @param conditionJson 查询条件
	 * @param request
	 * @return
	 */
	@RequestMapping("/querydata.do")
	public void queryData(@RequestParam String uuid ,HttpServletResponse rep){
		
		DataService service = (DataService)AppContextUtils.getAppContext().getBean("dataService");
		TableInfo ti = (TableInfo)CacheUtils.getCacheInstance("tableCache");

		if(StringUtils.isBlank(uuid)){
			return;
		}
		
		TableModel tm =  ti.getTables().get(uuid);
		 //查询项 
		List<String> resultNames = new ArrayList<String>();
		{
			resultNames.add("*");
		}
		// 查询条件
//		Map<String, Object> conditions = new HashMap<String, Object>();
		
		List<Map<String, Object>> results = service.query(tm, resultNames, null);
		
		JSONArray ja = new JSONArray();
		for(int i=0;i<results.size();i++){
			Map<String,Object> m = results.get(i);
			JSONObject jo = JSONObject.fromMap(m);
			ja.put(jo);
		}
		out2site(ja.toString(),rep);
	}
	
	@RequestMapping("/tree.do")
	public void getTree(HttpServletRequest req,HttpServletResponse rep){
		TableInfo ti = (TableInfo)CacheUtils.getCacheInstance("tableCache");
		try {
			req.setCharacterEncoding("UTF-8");
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		String likename;
		try {
			likename = req.getParameter("likename");
		
		JSONArray js = new JSONArray();
		
		Map<String, TableModel> tbs=ti.getTables();
		
		if(StringUtils.isEmpty(likename)){
			for(String key : tbs.keySet()){
				JSONObject jo=new JSONObject();
				TableModel t=tbs.get(key);
				String keyword=t.getKeyword();
				jo.put("uuid", t.getUuid());
				jo.put("url", "#!/guide/" + t.getUuid());
				jo.put("name", t.getName());
				jo.put("keyword", keyword+'('+t.getName()+')');
				jo.put("leaf", true);
				js.put(jo);
				
			}
		}else{
			likename=URLDecoder.decode(likename,"utf-8").toLowerCase();
			for(String key : tbs.keySet()){
				JSONObject jo=new JSONObject();
				TableModel t=tbs.get(key);
				String keyword=t.getKeyword();
				if(keyword.toLowerCase().contains(likename)||t.getName().toLowerCase().contains(likename)){
					jo.put("uuid", t.getUuid());
					jo.put("url", "#!/guide/" + t.getUuid());
					jo.put("name", t.getName());
					jo.put("keyword", keyword+'('+t.getName()+')');
					jo.put("leaf", true);
					js.put(jo);
				}
				
			}
		}
		String s =js.toString();
		System.out.println(s);
		out2site(js.toString(),rep);
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	
	//------------------------------下面为构造表和字段实例的测试函数-------------------------------------
	
	
	
	private TableModel getTable(JSONObject head){
		TableModel table = null;
			table = new TableModel();
			table.setKeyword(head.getString("tblname"));
			table.setModifyTime(new Date()); 
			table.setName(head.getString("tblname"));
			table.setType(1);
		
		return table;
	}
	
	private List<ColumnModel> getColumns(JSONArray blnewsJson){
		List<ColumnModel> cms = null;
		cms = new ArrayList<ColumnModel>();
			for (int i = 0; i < blnewsJson.length(); i++) {
				ColumnModel cm = new ColumnModel();
			    JSONObject o = (JSONObject) blnewsJson.get(i);
			    cm.setKeyword(o.getString("name"));
				cm.setName(o.getString("name"));
				cm.setLabel(o.getString("label"));
//				cm.setType("varchar".equals(o.getString("datatype"))?0:1);
				cm.setWidth(o.getInt("width"));
				cm.setIsUnique(0);
				cm.setModifyTime(new Date());
				cm.setDecimalWidth(o.getInt("decimals"));
				cm.setMissing(o.getString("missing"));
//				cm.setShowAlign("center".equals(o.getString("align"))?1:2);
				cm.setShowWidth(o.getInt("columns"));
				cms.add(cm);
			}
		return cms;
	}
	
	/**************************************先把query功能放在这，等实现了在转移到新工程****************************************************************/
	/**
	 * 保存查询条件，同时在t_factor_inst中更新数据
	 * @param req
	 * @param rep
	 */
	@RequestMapping("/saveCondition.do")
	public void saveCondition(HttpServletRequest req,HttpServletResponse rep){
		DataService service = (DataService)AppContextUtils.getAppContext().getBean("dataService");
		String condition = req.getParameter("condition");
		Map<String, Object> conditionMap = BoomBeanUtils.str2Map(condition);
		
		TableInfo ti = (TableInfo)CacheUtils.getCacheInstance("tableCache");
		TableModel tm = ti.getTables().get("ff9c147f1989468cb89fc122169d4d9b");//t_query表
		List<Map<String, Object>> list=new ArrayList<Map<String,Object>>();
		list.add(conditionMap);
		List<String> uuids=new ArrayList<String>();
		if(StringUtils.isNotBlank((String) conditionMap.get("uuid"))){
			service.update(tm, list);
		}else{
			uuids=service.insert(tm,list);
		}
		String instUuid=(String) conditionMap.get("instUuid");
		TableModel tmInst = ti.getTables().get("ba15db8ec50c4c96a47fce6743a2e82a");//t_factor_inst表
		
		Map<String,Object> m=new HashMap<String, Object>();
		m.put("queryUuid", uuids.size()>0?uuids.get(0):(String) conditionMap.get("uuid"));
		m.put("valueKeyword", conditionMap.get("valueKeyword"));
		service.updateByUuid(tmInst, m, instUuid);
		out2site(m.get("queryUuid").toString(),rep);
	}
	/**
	 * 根据条件类型得到条件列表，t_query_params
	 * @param req
	 * @param rep
	 */
	@RequestMapping("/conditionList.do")
	public void conditionList(HttpServletRequest req,HttpServletResponse rep){
		DataService service = (DataService)AppContextUtils.getAppContext().getBean("dataService");
		String conditionType = req.getParameter("conditionType");
		
		TableInfo ti = (TableInfo)CacheUtils.getCacheInstance("tableCache");
		TableModel tm = ti.getTables().get("b8b00e65f823442cb23e453adee32ca0");
		
		List<String> resultNames = new ArrayList<String>();
		{
			resultNames.add("*");
		}
		Map<String, Object> conditions = new HashMap<String, Object>();
		conditions.put("conditionType", conditionType);
		List<Map<String, Object>> results = service.query(tm, resultNames, conditions);
		JSONArray ja = new JSONArray();
		for(int i=0;i<results.size();i++){
			Map<String,Object> m = results.get(i);
			JSONObject jo = JSONObject.fromMap(m);
			ja.put(jo);
		}
		out2site(ja.toString(),rep);
	}
	/**
	 * 根据点击因子或属性得到查询条件
	 * @param req
	 * @param rep
	 */
	@RequestMapping("/loadCondition.do")
	public void loadCondition(HttpServletRequest req,HttpServletResponse rep){
		DataService service = (DataService)AppContextUtils.getAppContext().getBean("dataService");
		String queryUuid = req.getParameter("queryUuid");
		if(StringUtils.isBlank(queryUuid)){
			out2site("[{\"leftbracket\":\"\",\"logical\":\"\",\"columnKeyword\":\"\",\"seq\":0,\"rightbracket\":\"\",\"columnValue\":'',\"operator\":\"\"}]",rep);
			return;
		}
		TableInfo ti = (TableInfo)CacheUtils.getCacheInstance("tableCache");
		TableModel tm = ti.getTables().get("ff9c147f1989468cb89fc122169d4d9b");
		
		List<String> resultNames = new ArrayList<String>();
		{
			resultNames.add("*");
		}
		Map<String, Object> conditions = new HashMap<String, Object>();
		conditions.put("uuid", queryUuid);
		List<Map<String, Object>> results = service.query(tm, resultNames, conditions);
		if(results.size()>0){
			out2site(results.get(0).get("conditionField").toString(),rep);
		}
	}
	/**
	 * 根据点击因子或属性数据区的配置
	 * @param req
	 * @param rep
	 */
	@RequestMapping("/loadConfig.do")
	public void loadConfig(HttpServletRequest req,HttpServletResponse rep){
		DataService service = (DataService)AppContextUtils.getAppContext().getBean("dataService");
		String queryUuid = req.getParameter("queryUuid");
		if(StringUtils.isBlank(queryUuid)){
			out2site("[{\"leftbracket\":\"\",\"logical\":\"\",\"columnKeyword\":\"\",\"seq\":0,\"rightbracket\":\"\",\"columnValue\":'',\"operator\":\"\"}]",rep);
			return;
		}
		TableInfo ti = (TableInfo)CacheUtils.getCacheInstance("tableCache");
		TableModel tm = ti.getTables().get("ff9c147f1989468cb89fc122169d4d9b");
		
		List<String> resultNames = new ArrayList<String>();
		{
			resultNames.add("*");
		}
		Map<String, Object> conditions = new HashMap<String, Object>();
		conditions.put("uuid", queryUuid);
		List<Map<String, Object>> results = service.query(tm, resultNames, conditions);
		JSONArray js = BoomBeanUtils.list2JsonArray(results);
		if(results.size()>0){
			out2site(js.toString(),rep);
		}
	}
	/**
	 * 根据点击因子或属性得到查询条件
	 * @param req
	 * @param rep
	 */
	@RequestMapping("/loadConditionData.do")
	public void loadConditionData(HttpServletRequest req,HttpServletResponse rep){
		DataService service = (DataService)AppContextUtils.getAppContext().getBean("dataService");
		String condition = req.getParameter("condition");
		Map<String, Object> conditionMap = BoomBeanUtils.str2Map(condition);
		String dataTableUuid = (String)conditionMap.get("dataTableUuid");
		TableInfo ti = (TableInfo)CacheUtils.getCacheInstance("tableCache");
		TableModel tm = ti.getTables().get(dataTableUuid);
		JSONArray jas=(JSONArray)conditionMap.get("conditionField");
		
		StringBuffer where=new StringBuffer();
		List<Object> paramsList=new ArrayList<Object>();
//		where.append("select * from "+tm.getKeyword()+" where");
		for(int i=0;i<jas.length();i++){
			JSONObject jo = (JSONObject) jas.get(i);
			if(StringUtils.isNotBlank(jo.getString("columnValue"))){
				where.append(" "+jo.getString("leftbracket")+jo.get("columnKeyword")+" "+jo.get("operator")+" ? "+jo.get("rightbracket")+" "+jo.get("logical"));
				paramsList.add(jo.get("columnValue"));
			}else{
				where.append(" "+jo.getString("leftbracket")+jo.get("columnKeyword")+" "+jo.get("operator")+" "+jo.get("rightbracket")+" "+jo.get("logical"));
			}
		}
		Object[] params=new Object[paramsList.size()];
		for(int i=0;i<paramsList.size();i++){
			params[i]=paramsList.get(i);
		}
		System.out.println(where.toString());
		
		JSONArray resultJS=(JSONArray) conditionMap.get("resultField");
		List<String> resultNames = new ArrayList<String>();
		for(int i=0;i<resultJS.length();i++){
			resultNames.add(resultJS.getString(i));
		}
		
		List<Map<String, Object>> results = service.query(tm, resultNames, where.toString(), params);
		JSONArray js = BoomBeanUtils.list2JsonArray(results);
//		if(results.size()>0){
			out2site(js.toString(),rep);
//		}
	}
}
