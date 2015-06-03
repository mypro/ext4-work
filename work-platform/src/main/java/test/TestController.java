package test;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.hibernate.annotations.Parameter;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import cn.net.dbi.boom.cache.CacheUtils;
import cn.net.dbi.boom.context.AppContextUtils;
import cn.net.dbi.table.model.ColumnModel;
import cn.net.dbi.table.model.TableInfo;
import cn.net.dbi.table.model.TableModel;
import cn.net.dbi.table.service.DataService;
import cn.net.dbi.table.service.TableService;

/**
 * ϵͳ�ṩ��ط����ʵ����ʾ��
 * 
 * ��ͨ��url�� localhost:8080/project/XXX.do��������ʾ
 * 
 * @author hanheliang
 *
 */
@Controller
public class TestController {
	/*
	
	@RequestMapping("/cache.do")
	public String cache(){
		// ��ǰˢһ�»���
		CacheUtils.setNeedReload("tableCache", true);
		// ��ȡ����
		TableInfo tabelInfo = (TableInfo)CacheUtils.getCacheInstance("tableCache");
		
		return "";
	}
	
	@RequestMapping("/createtable.do")
	public String createTable(@RequestParam JSONObject head ,@RequestParam JSONArray blnewsJson ,@RequestParam JSONArray sjnewsJson ,HttpServletRequest request){

		TableService service = (TableService)AppContextUtils.getAppContext().getBean("tableService");
		
		service.createTable(
					getTestTable(),
					getTestColumns()
		);
		CacheUtils.setNeedReload("tableCache", true);
		
		return "";
	}
	
	@RequestMapping("/deletetable.do")
	public String deleteTable(HttpServletRequest request){
		
		TableService service = (TableService)AppContextUtils.getAppContext().getBean("tableService");
		
		service.deleteTable(getTestTable());
		
		return "";
	}

	@RequestMapping("/updatetable.do")
	public String updateTable(HttpServletRequest request){
		
		TableService service = (TableService)AppContextUtils.getAppContext().getBean("tableService");
		
		List<ColumnModel> addColumns = null;
		{
			addColumns = new ArrayList<ColumnModel>();
			
			ColumnModel cm1 = new ColumnModel();
			cm1.setKeyword("sex");
			cm1.setName("�Ա�");
			cm1.setLabel("�Ա�");
			cm1.setType(0);
			cm1.setWidth(10);
			cm1.setIsUnique(0);
			cm1.setModifyTime(new Date());
			
			ColumnModel cm2 = new ColumnModel();
			cm2.setKeyword("province");
			cm2.setName("ʡ��");
			cm2.setLabel("ʡ��");
			cm2.setType(1);
			cm2.setWidth(10);
			cm2.setIsUnique(0);
			cm2.setModifyTime(new Date());
			
			addColumns.add(cm1);
			addColumns.add(cm2);
		}
		
		List<ColumnModel> updateColumns = null;
		{
			updateColumns = new ArrayList<ColumnModel>();
			
			ColumnModel cm1 = cms.get(0);
			cm1.setKeyword("C_NAME");
			cm1.setName("�Ա�*");
			cm1.setLabel("�Ա�*");
			cm1.setType(0);
			cm1.setWidth(4);
			cm1.setIsUnique(0);
			cm1.setModifyTime(new Date());
			
			updateColumns.add(cm1);
		}
		
		List<ColumnModel> deleteColumns = null;
		{
			deleteColumns = new ArrayList<ColumnModel>();
			
			ColumnModel cm1 = cms.get(2);
			
			deleteColumns.add(cm1);
		}
		
		
		service.updateTable(table, addColumns, updateColumns, deleteColumns);
		
		return "";
	}
	
	@RequestMapping("/querydata.do")
	public String queryData(HttpServletRequest request){
		
		DataService service = (DataService)AppContextUtils.getAppContext().getBean("dataService");
		
		 ��ѯ��
		TableModel tm = getTestTable();
		 ��ѯ�� 
		List<String> resultNames = new ArrayList<String>();
		{
			resultNames.add("C_NAME");
			resultNames.add("width");
			resultNames.add("birthday");
		}
		 ��ѯ����
		Map<String, Object> conditions = new HashMap<String, Object>();
		{
			conditions.put("width", 10);
			conditions.put("birthday", "1985-10-03");
		}
		
		List<Map<String, Object>> results = service.query(tm, resultNames, conditions);
		
		return "";
	}
	
	@RequestMapping("/deletedata.do")
	public String deleteData(@RequestParam String uuid, HttpServletRequest request){
		
		DataService service = (DataService)AppContextUtils.getAppContext().getBean("dataService");
	}
	
	@RequestMapping("/func.do")
	public String function(HttpServletRequest request){
		
		return "";
	}
	
	
	//------------------------------����Ϊ�������ֶ�ʵ��Ĳ��Ժ���-------------------------------------
	
	private TableModel table = null;
	List<ColumnModel> cms = null;
	
	private TableModel getTestTable(){
		if(null == table){
			table = new TableModel();
			table.setKeyword("T_FACTOR");
			table.setModifyTime(new Date());
			table.setName("���ӱ�");
			table.setType(1);
		}
		return table;
	}
	
	private List<ColumnModel> getTestColumns(){
		if(null != cms){
			return cms;
		}
		ColumnModel cm = new ColumnModel();
		cm.setKeyword("C_NAME");
		cm.setName("���");
		cm.setLabel("���");
		cm.setType(1);
		cm.setWidth(100);
		cm.setIsUnique(0);
		cm.setModifyTime(new Date());
		
		ColumnModel cm1 = new ColumnModel();
		cm1.setKeyword("width");
		cm1.setName("����");
		cm1.setLabel("����");
		cm1.setType(0);
		cm1.setWidth(10);
		cm1.setIsUnique(0);
		cm1.setModifyTime(new Date());
		
		ColumnModel cm2 = new ColumnModel();
		cm2.setKeyword("birthday");
		cm2.setName("����");
		cm2.setLabel("����");
		cm2.setType(2);
		cm2.setWidth(10);
		cm2.setIsUnique(0);
		cm2.setModifyTime(new Date());
		
		cms = new ArrayList<ColumnModel>();
		cms.add(cm);
		cms.add(cm1);
		cms.add(cm2);
		
		return cms;
	}*/
}
