package cn.net.dbi.datasource.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import cn.net.dbi.boom.controller.BaseController;
import cn.net.dbi.boom.utils.BoomBeanUtils;
import cn.net.dbi.boom.utils.IMap2JsonCallback;
import cn.net.dbi.datasource.DSService;
import cn.net.dbi.datasource.model.DatasourceModel;

@Controller
public class DBController extends BaseController{
	
	@Autowired
	private DSService dsService;
	 
	@RequestMapping("/getDatabase.do")
	public void getDatabase(@RequestParam String datasource, 
						HttpServletResponse rep){
		DatasourceModel dbModel = dsService.getDatabaseModel(datasource);
		List<Map<String, String>> results =dsService.showDatabase(dbModel);
		
		JSONArray ja = BoomBeanUtils.list2JsonArray(results, new IMap2JsonCallback<String>() {
			public JSONObject convert(Map<String, String> map) {
				JSONObject jo = new JSONObject();
				jo.put("uuid", map.get("database"));
				jo.put("name", map.get("database"));
				return jo;
			}
		});
		
		out2site(ja.toString(), rep);
	}
	
	@RequestMapping("/getDBTable.do")
	public void getDBTable(@RequestParam String datasource, 
						@RequestParam String database,
						HttpServletResponse rep){
		DatasourceModel dbModel = dsService.getDatabaseModel(datasource);
		List<Map<String, String>> results = dsService.showTable(dbModel, database);
		
		JSONArray ja = BoomBeanUtils.list2JsonArray(results, new IMap2JsonCallback<String>() {
			public JSONObject convert(Map<String, String> map) {
				JSONObject jo = new JSONObject();
				jo.put("uuid", map.get("table"));
				jo.put("name", map.get("table"));
				return jo;
			}
		});
		
		out2site(ja.toString(), rep);
	}
	
	@RequestMapping("/getDBField.do")
	public void getDBField(@RequestParam String datasource, 
						@RequestParam String database,
						@RequestParam String table,
						HttpServletResponse rep){
		DatasourceModel dbModel = dsService.getDatabaseModel(datasource);
		List<Map<String, String>> results = dsService.showColumn(dbModel, database, table);
		
		JSONArray ja = BoomBeanUtils.list2JsonArray(results, new IMap2JsonCallback<String>() {
			public JSONObject convert(Map<String, String> map) {
				JSONObject jo = new JSONObject();
				jo.put("uuid", map.get("field"));
				jo.put("name", map.get("field"));
				return jo;
			}
		});
		
		out2site(ja.toString(), rep);
		
	}
}
