package cn.net.dbi.param.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import cn.net.dbi.boom.cache.CacheUtils;
import cn.net.dbi.boom.context.AppContextUtils;
import cn.net.dbi.boom.controller.BaseController;
import cn.net.dbi.boom.utils.BoomBeanUtils;
import cn.net.dbi.param.ParamConstantInfo;
import cn.net.dbi.param.ParamInfo;
import cn.net.dbi.param.ParamService;
import cn.net.dbi.param.TypeInfo;
import cn.net.dbi.param.ValueLabelInfo;
import cn.net.dbi.param.ValueLabelService;
import cn.net.dbi.param.bean.ParamDefine;
import cn.net.dbi.param.bean.ParamValue;
import cn.net.dbi.param.bean.Type;
import cn.net.dbi.param.bean.ValueLabel;

@Controller
public class ParamController extends BaseController {
	
	@Autowired
	private ParamService paramService;
	@Autowired
	private ValueLabelService valueService;
	
	public void setParamService(ParamService paramService) {
		this.paramService = paramService;
	}

	@RequestMapping("/paramList.do")
	public void paramList(@RequestParam String defineUuid, HttpServletResponse rep){
		ParamInfo pi = (ParamInfo)CacheUtils.getCacheInstance("paramCache");
		JSONArray ja = null;
		if(StringUtils.isBlank(defineUuid)){ 
			out2site("[]", rep);
		}else{
			if("paramDefine".equals(defineUuid)){
				Map<String, ParamDefine> defines = pi.getDefines();
				ja = BoomBeanUtils.map2JsonArray(defines);
			}else{
				Map<String, ParamValue> values = pi.getValues(defineUuid);
				ja = BoomBeanUtils.map2JsonArray(values);
			}
			
			out2site(ja.toString(), rep);
		}
	}
	
	@RequestMapping("/typeList.do")
	public void typeList( HttpServletResponse rep){
		TypeInfo pi = (TypeInfo)CacheUtils.getCacheInstance("typeCache");
		JSONArray ja = null;
		Map<String, Type> defines = pi.getTypes();
		ja = BoomBeanUtils.map2JsonArray(defines);
		out2site(ja.toString(), rep);
	}
	
	@RequestMapping("/queryParams.do")
	public void queryParams(@RequestParam String columnUuid ,HttpServletResponse rep){
		ValueLabelInfo vi = (ValueLabelInfo)CacheUtils.getCacheInstance("valueLabelCache");
		JSONArray ja = null;
		Map<String, ValueLabel> valueLabels = vi.getValueLabelsByColumnUuid(columnUuid);
		ja = BoomBeanUtils.map2JsonArray(valueLabels);
		out2site(ja.toString(), rep);
	}
	@RequestMapping("/updateValueLabel.do")
	public void updateValueLabel(@RequestParam JSONArray newsJson ,@RequestParam JSONArray updatesJson ,@RequestParam JSONArray deletesJson ,HttpServletResponse rep){
		List<ValueLabel> addValues=null;
		List<ValueLabel> updateValues=null;
		List<ValueLabel> deleteValues=null;
		addValues=this.getValueLabels(newsJson);
		updateValues=this.getValueLabels(updatesJson);
		deleteValues=this.getValueLabels(deletesJson);
		valueService.saveOrUpdateParam(addValues, updateValues, deleteValues);
	}
	
	@RequestMapping("/saveOrUpdateParam.do")
	public void saveOrUpdateParam(@RequestParam String defineUuid,@RequestParam String defineName,@RequestParam JSONArray newsJson,@RequestParam JSONArray updatesJson, HttpServletResponse rep){
		ParamInfo pi = (ParamInfo)CacheUtils.getCacheInstance("paramCache");
		ParamDefine paramDefine = pi.getDefines().get(defineUuid);
		if(null==paramDefine){
			paramDefine=new ParamDefine();
		}
		paramDefine.setName(defineName);
		paramDefine.setType(ParamConstantInfo.PARAMDEFINE_TYPE_USER);
		
		List<ParamValue> addParamValues=null;
		List<ParamValue> updateParamValues=null;
		if(newsJson.length()>0){
			addParamValues=this.getParams(newsJson);
		}
		if(updatesJson.length()>0){
			updateParamValues=this.getParams(updatesJson);
		}
		paramService.saveOrUpdateParam(paramDefine, addParamValues, updateParamValues, null);
		String uuid="";
		uuid=paramDefine.getUuid();
		out2site( "保存成功uuid"+uuid,rep);
	}
	@RequestMapping("/deleteParam.do")
	public void deleteParam(@RequestParam String defineUuid,@RequestParam JSONArray delParamJson, HttpServletResponse rep){
		ParamInfo pi = (ParamInfo)CacheUtils.getCacheInstance("paramCache");
		ParamDefine paramDefine = pi.getDefines().get(defineUuid);
		if(delParamJson.length()>0){
			List<ParamValue> deleteParamValues = this.getParams(delParamJson);
			paramService.saveOrUpdateParam(paramDefine, null, null, deleteParamValues);
		}
		out2site("删除成功", rep);
	}
	private List<ParamValue> getParams(JSONArray jsons){
		List<ParamValue> paramValues = new ArrayList<ParamValue>();
		for (int i = 0; i < jsons.length(); i++) {
			JSONObject jo = (JSONObject) jsons.get(i);
			ParamValue pv = (ParamValue)JSONObject.toBean(jo, ParamValue.class);
			paramValues.add(pv);
		}
		return paramValues;
	}
	private List<ValueLabel> getValueLabels(JSONArray jsons){
		List<ValueLabel> vls = new ArrayList<ValueLabel>();
		for(int i=0;i<jsons.length();i++){
			JSONObject jo=(JSONObject) jsons.get(i);
			ValueLabel vl = (ValueLabel) JSONObject.toBean(jo,ValueLabel.class);
			vls.add(vl);
		}
		return vls;
	}
	
}
