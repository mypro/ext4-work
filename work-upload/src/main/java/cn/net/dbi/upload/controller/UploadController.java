package cn.net.dbi.upload.controller;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFHeader;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import cn.net.dbi.boom.cache.CacheUtils;
import cn.net.dbi.boom.context.AppContextUtils;
import cn.net.dbi.boom.controller.BaseController;
import cn.net.dbi.table.model.ColumnModel;
import cn.net.dbi.table.model.TableInfo;
import cn.net.dbi.table.model.TableModel;
import cn.net.dbi.table.operator.column.ColumnType;
import cn.net.dbi.table.operator.data.ConstantDataSynax;
import cn.net.dbi.table.service.DataService;
import cn.net.dbi.table.service.TableService;
import cn.net.dbi.upload.ExcelReader;
import cn.net.dbi.upload.utils.ComparatorColumn;

@Controller
public class UploadController extends BaseController {
	
	@RequestMapping("/upload.do")
	public void upload(@RequestParam("upfile") CommonsMultipartFile  upfile,HttpServletResponse rep){
		try {
            InputStream is = upfile.getInputStream();
			ExcelReader excelReader = new ExcelReader(is);
			Map<Integer, String> sheetNames = excelReader.readExcelSheets();
			Map<Integer, String> sheetTables = new HashMap<Integer, String>();//导入数据的sheet
			Map<Integer, String> sheetCreateTables = new HashMap<Integer, String>();//没有和当前sheet同名的表，需要创建表并保存数据
			TableInfo ti = (TableInfo)CacheUtils.getCacheInstance("tableCache");
			Map<String, TableModel> tables=ti.getkeywordTables();
			int forInt =sheetNames.size();
			for(int i=0;i<forInt;i++){
				if(tables.containsKey(sheetNames.get(i))){
					sheetTables.put(i, sheetNames.get(i));
				}else{
					sheetCreateTables.put(i, sheetNames.get(i));
				}
			}
/*-----------------------------------------创建表--------------------------------------------*/
			this.createTableBySheet(sheetCreateTables, excelReader, rep);
/*-----------------------------------------导入数据--------------------------------------------*/
			this.uploadData(sheetTables, excelReader, rep);
			
			

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	public void createTableBySheet(Map<Integer, String> sheetCreateTables,ExcelReader excelReader,HttpServletResponse rep){
		//returnUuid =service.createTable(getTable(head),getColumns(blnewsJson));
		TableService service = (TableService)AppContextUtils.getAppContext().getBean("tableService");
		for(int key: sheetCreateTables.keySet()){
			List<Map<String,Object>> titleMap= excelReader.readExcelTitleMap(key);
			TableModel tm=getTable(sheetCreateTables.get(key));
			if(null==titleMap){
				//service.createTable(tm, Collections.EMPTY_LIST);
			}else{
				List<ColumnModel> cms=getColumns(titleMap);
				service.createTable(tm, cms, true);
				Map<Integer,String> sheetTables=new HashMap<Integer, String>();
				sheetTables.put(key, sheetCreateTables.get(key));
				this.uploadData(sheetTables, excelReader, rep);
			}
			
		}
	}
	
	/**
	 * 导入数据
	 * @param sheetTables
	 * @param excelReader
	 * @param rep
	 */
	public void uploadData(Map<Integer, String> sheetTables,ExcelReader excelReader,HttpServletResponse rep){
		DataService service = (DataService)AppContextUtils.getAppContext().getBean("dataService");
		String returnMessage="";//输出到前台的提示信息
		TableInfo ti = (TableInfo)CacheUtils.getCacheInstance("tableCache");
		Map<String, TableModel> tables=ti.getkeywordTables();
		List columns;
		for(int key: sheetTables.keySet()){
			columns=new ArrayList();
			/*根据keyword获得对应的TableModel*/
			TableModel tm = tables.get(sheetTables.get(key));
			/*从数据库中取出的columnModel，如果没有的话说明用户光创建表了，但是没有添加字段*/
			Map<String, ColumnModel> cms=ti.getColumns(tm.getUuid());
		    if(null==cms){
			   returnMessage+=tm.getName()+"表还没有创建字段;";
			   continue;
		    }
		    for(String k:cms.keySet()){
		    	columns.add(cms.get(k).getKeyword());
	   	    }
			 /*如果取出的第一行没有数据，说明excel中没有数据*/
			String[] titles = excelReader.readExcelTitle(columns,key);
			if(null==titles){
				returnMessage+="导入excel中表【"+tm.getName()+"】数据为空;";
				continue;
			}
			List<Map<String,Object>> contents=excelReader.readExcelContent(key);
			System.out.println(contents.toString());
			
			/*检查字段类型是否匹配*/
			Map<String, ColumnModel> cmsKeyword=rebuildColumnInfos(cms);
			cmsKeyword.put("seq", new ColumnModel());
			int contentInt=contents.size();
			List<Map<String,Object>> saveContents=excelReader.readExcelContent(key);
			for(int i=0;i<contentInt;i++){
				for(String column:contents.get(i).keySet()){
					CheckValueResult result=checkIsValidValue(cmsKeyword,column,contents.get(i).get(column));
					if(!result.isValid){
						returnMessage+="表【"+tm.getName()+"】第"+(i+1)+"行字段【"+column+"】的值【"+contents.get(i).get(column)+"】类型不匹配；";
						saveContents.remove(i);
						continue;
					}
				}
			}
			System.out.println(saveContents.toString());
			service.insert(tm, saveContents);
		}
		System.out.println("returnMeassage:"+returnMessage);
		out2site("{\"success\":true,\"message\":\""+(returnMessage==""?"导入成功！":returnMessage)+"\"}",rep);
	}
	
	private TableModel getTable(String tableName){
		TableModel table = null;
			table = new TableModel();
			table.setKeyword(tableName);
			table.setModifyTime(new Date()); 
			table.setName(tableName);
			table.setType(1);
		
		return table;
	}
	private List<ColumnModel> getColumns(List<Map<String,Object>> titleMap){
		List<ColumnModel> cms = null;
		cms = new ArrayList<ColumnModel>();
			for (int i = 0; i < titleMap.size(); i++) {
				ColumnModel cm = new ColumnModel();
			   
			    cm.setKeyword((String) titleMap.get(i).get("column"));
				cm.setName((String) titleMap.get(i).get("column"));
				cm.setWidth(200);
				cm.setLabel("");
				cm.setType((String) titleMap.get(i).get("columnType"));
				cm.setIsUnique(0);
				cm.setModifyTime(new Date());
				cm.setSeq(i*1024);
				cm.setShowWidth(80);
				cms.add(cm);
			}
		return cms;
	}
	/**
	 * 导出excel
	 * @param upfile
	 * @param rep
	 */
	@RequestMapping("/download.do")
	public String download(@RequestParam("uuid") String  uuid,HttpServletResponse rep){
//		uuid="aa473745579144b383df76a4cd47a18b";//表uuid
		
		DataService service = (DataService)AppContextUtils.getAppContext().getBean("dataService");
		TableInfo ti = (TableInfo)CacheUtils.getCacheInstance("tableCache");

		if(StringUtils.isBlank(uuid)){
			return null;
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
		Map<String, ColumnModel> columns=ti.getColumns(uuid);
		List<ColumnModel> columnList=mapToList(columns);
		 
		//创建一个新的Excel
		HSSFWorkbook workBook = new HSSFWorkbook();
		//创建sheet页
		HSSFSheet sheet = workBook.createSheet();
		HSSFSheet variableSheet=workBook.createSheet();
		//sheet页名称
		workBook.setSheetName(0, tm.getName());
		workBook.setSheetName(1, "表结构");
		//创建header页
		HSSFHeader header = sheet.getHeader();
		HSSFHeader header2 = variableSheet.getHeader();
		//设置标题居中
		header.setCenter("标题");
		header2.setCenter("字段");
		//设置第一行为Header  =============导出数据
		HSSFRow row = sheet.createRow(0);
		List<HSSFCell> titles=new ArrayList<HSSFCell>();
		int s=0;
		for(ColumnModel c:columnList){
			
			HSSFCell cell0 = row.createCell(Short.valueOf(s+""));
			cell0.setCellValue(c.getName().equals("")?c.getKeyword():c.getName());
			titles.add(cell0);
			
			s++;
		}
		
		for(int i=0;i<results.size();i++){
			row=sheet.createRow(i+1);
			int j=0;
			for(ColumnModel c:columnList){
				
				HSSFCell cell=row.createCell(Short.valueOf(j+""));
				cell.setCellValue(results.get(i).get(c.getKeyword()).equals("null")?"":results.get(i).get(c.getKeyword()).toString());
				sheet.setColumnWidth((short) j, (short) 4000);
				j++;
			}
			
		}
		//导出表结构 第一行
		HSSFRow row1 = variableSheet.createRow(0);
		//第一行的内容
		HSSFCell cell0 = row1.createCell(Short.valueOf("0"));
		HSSFCell cell1 = row1.createCell(Short.valueOf("1"));
		HSSFCell cell2 = row1.createCell(Short.valueOf("2"));
		HSSFCell cell3 = row1.createCell(Short.valueOf("3"));
		HSSFCell cell4 = row1.createCell(Short.valueOf("4"));
		HSSFCell cell5 = row1.createCell(Short.valueOf("5"));
		HSSFCell cell6 = row1.createCell(Short.valueOf("6"));
		HSSFCell cell7 = row1.createCell(Short.valueOf("7"));
		HSSFCell cell8 = row1.createCell(Short.valueOf("8"));
		HSSFCell cell9 = row1.createCell(Short.valueOf("9"));
		HSSFCell cell10 = row1.createCell(Short.valueOf("10"));
		HSSFCell cell11 = row1.createCell(Short.valueOf("11"));
		
		cell0.setCellValue("名称");
		cell1.setCellValue("类型");
		cell2.setCellValue("宽度");
		cell3.setCellValue("小数");
		cell4.setCellValue("标签");
		cell5.setCellValue("值标签");
		cell6.setCellValue("索引");
		cell7.setCellValue("缺失");
		cell8.setCellValue("列");
		cell9.setCellValue("对齐");
		cell10.setCellValue("度量标准");
		cell11.setCellValue("角色");
		
		
		
		for(int i=0;i<columnList.size();i++){
			row1=variableSheet.createRow(i+1);
			cell0 = row1.createCell(Short.valueOf("0"));
			cell1 = row1.createCell(Short.valueOf("1"));
			cell2 = row1.createCell(Short.valueOf("2"));
			cell3 = row1.createCell(Short.valueOf("3"));
			cell4 = row1.createCell(Short.valueOf("4"));
			cell5 = row1.createCell(Short.valueOf("5"));
			cell6 = row1.createCell(Short.valueOf("6"));
			cell7 = row1.createCell(Short.valueOf("7"));
			cell8 = row1.createCell(Short.valueOf("8"));
			cell9 = row1.createCell(Short.valueOf("9"));
			cell10 = row1.createCell(Short.valueOf("10"));
			cell11 = row1.createCell(Short.valueOf("11"));
			
			cell0.setCellValue(columnList.get(i).getKeyword());
			cell1.setCellValue(columnList.get(i).getType());
			cell2.setCellValue(columnList.get(i).getWidth());
			cell3.setCellValue(columnList.get(i).getDecimalWidth());
			cell4.setCellValue(columnList.get(i).getName());
			cell5.setCellValue(columnList.get(i).getParamDefineName());
			cell6.setCellValue(columnList.get(i).getParamDefine());
			cell7.setCellValue(columnList.get(i).getMissing());
			cell8.setCellValue(columnList.get(i).getShowWidth());
			cell9.setCellValue(columnList.get(i).getShowAlign());
			cell10.setCellValue(columnList.get(i).getMetric());
			cell11.setCellValue(columnList.get(i).getRole());
			
			variableSheet.setColumnWidth((short) 0, (short) 4000);
			variableSheet.setColumnWidth((short) 1, (short) 4000);
			variableSheet.setColumnWidth((short) 2, (short) 4000);
			variableSheet.setColumnWidth((short) 3, (short) 4000);
			variableSheet.setColumnWidth((short) 4, (short) 4000);
			variableSheet.setColumnWidth((short) 5, (short) 4000);
			variableSheet.setColumnWidth((short) 6, (short) 4000);
			variableSheet.setColumnWidth((short) 7, (short) 4000);
			variableSheet.setColumnWidth((short) 8, (short) 4000);
			variableSheet.setColumnWidth((short) 9, (short) 4000);
			variableSheet.setColumnWidth((short) 10, (short) 4000);
			variableSheet.setColumnWidth((short) 11, (short) 4000);
			
		}
		//通过Response把数据以Excel格式保存
		rep.reset();
		rep.setContentType("application/msexcel;charset=UTF-8");
		try {
			rep.addHeader("Content-Disposition", "attachment;filename=\""
					+ new String((tm.getName() + ".xls").getBytes("GBK"),
							"ISO8859_1") + "\"");
			OutputStream out = rep.getOutputStream();
			workBook.write(out);
			out.flush();
			out.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;

	}
	/**
	 *  将缓存的以uuid为索引的map,转换成以key为索引的map
	 */
	private Map<String, ColumnModel> rebuildColumnInfos(Map<String, ColumnModel> columns){
		Map<String, ColumnModel> columnInfos=new HashMap<String, ColumnModel>();
		if(null == columns){
			return null;
		}
		Iterator<String> uuidIt = columns.keySet().iterator();
		while(uuidIt.hasNext()){
			String uuid = uuidIt.next();
			ColumnModel cm = columns.get(uuid);
			columnInfos.put(cm.getKeyword(), cm);
		}
		return columnInfos;
	}
	private List<ColumnModel> mapToList(Map<String ,ColumnModel> columns){
		List<ColumnModel> columnList=new ArrayList<ColumnModel>();
		if(null == columns){
			return null;
		}
		Iterator<String> uuidIt = columns.keySet().iterator();
		while(uuidIt.hasNext()){
			String uuid = uuidIt.next();
			ColumnModel cm = columns.get(uuid);
			columnList.add(cm);
		}
		ComparatorColumn comparator=new ComparatorColumn();
		Collections.sort(columnList, comparator);
		for(ColumnModel c :columnList){
			System.out.println(c.getSeq());
		}
		return columnList;
	}
	
	private boolean checkIsValidKeyword(Map<String, ColumnModel> columnInfos,String keyword){
			
			if(StringUtils.isBlank(keyword)){
				return false;
			}
			
			if(ConstantDataSynax.STAR == keyword){
				return true;
			}
			
			if(!columnInfos.keySet().contains(keyword)){
				return false;
			}
			return true;
	}
	/**
	 * 做校验的同时做转换
	 * 
	 * @return
	 */
	private CheckValueResult checkIsValidValue(Map<String, ColumnModel> columnInfos,String keyword, Object value){
		
		if(!checkIsValidKeyword(columnInfos,keyword)){
			/* check fail */
			return new CheckValueResult(false);
		}
		
		if(null == value){
			/* of cause is correct*/
			return new CheckValueResult(true, null);
		}
		
		/* check value*/
		ColumnModel cm = columnInfos.get(keyword);
		ColumnType columnType = ColumnType.getColumnType(cm);
		Object convertValue = columnType.convert(value);
		if(null == convertValue){
			return new CheckValueResult(false);
		}
		
		return new CheckValueResult(true, convertValue);
	}
	

	/**
	 * 校验结果封装类
	 * 
	 * @author hanheliang
	 *
	 */
	class CheckValueResult{
		
		boolean isValid;
		Object value;
		
		CheckValueResult(boolean isValid){
			this.isValid = isValid;
		}
		
		CheckValueResult(boolean isValid,Object value){
			this.isValid = isValid;
			this.value = value;
		}
	}
}
