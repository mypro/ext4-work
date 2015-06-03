package cn.net.dbi.project.controller;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import cn.net.dbi.boom.controller.BaseController;
import cn.net.dbi.boom.utils.BoomBeanUtils;
import cn.net.dbi.boom.utils.IMap2JsonCallback;
import cn.net.dbi.project.ProjectConstant;
import cn.net.dbi.project.ProjectService;
import cn.net.dbi.table.service.DataService;

@Controller
public class ProjectController extends BaseController{
	
	@Autowired
	private DataService dataService;
	
	@Autowired
	private ProjectService projectService;
	
	@RequestMapping("/loadProject.do")
	public void loadProject(HttpServletRequest req, HttpServletResponse rep){
		
		List<Map<String, Object>> projects = this.dataService.query(ProjectConstant.getProjectTM(), 
				Arrays.asList(new String[]{"*"}), null);
		
		JSONArray ja = BoomBeanUtils.list2JsonArray(projects, new IMap2JsonCallback<Object>() {
			public JSONObject convert(Map<String, Object> map) {
				JSONObject jo  = JSONObject.fromMap(map);
				jo.put("text", jo.get("value"));
				jo.put("leaf", true);
				return jo;
			}
		});
		
		out2site(ja.toString(), rep);
	}
	
	@RequestMapping("/saveProject.do")
	public void saveProject(@RequestParam String projectName, 
						HttpServletRequest req,
						HttpServletResponse rep){
		String projectUuid = req.getParameter("projectUuid");
		
		Map<String, Object> project = new HashMap<String, Object>();
		project.put("value", projectName);
		
		if(StringUtils.isNotBlank(projectUuid)){
			this.dataService.updateByUuid(ProjectConstant.getProjectTM(), project, projectUuid);
		}else{
			projectUuid = this.dataService.insert(ProjectConstant.getProjectTM(), project);

			projectService.createTable(projectUuid);
		}
	}
	
	@RequestMapping("/deleteProject.do")
	public void deleteProject(@RequestParam String projectUuid, 
							HttpServletResponse rep){
		
		this.dataService.deleteByUuid(ProjectConstant.getProjectTM(), projectUuid);
		
		projectService.deleteTable(projectUuid);
	}

	@RequestMapping("/copyProject.do")
	public void copyProject(@RequestParam String projectUuid,
						@RequestParam String projectName,
						HttpServletResponse rep){
		
		Map<String, Object> project = new HashMap<String, Object>();
		project.put("value", projectName);
		
		String uuid = this.dataService.insert(ProjectConstant.getProjectTM(), project);
		
		projectService.createTable(uuid);
		projectService.copyTable(uuid, projectUuid);
		out2site("ok", rep);
	}
}
