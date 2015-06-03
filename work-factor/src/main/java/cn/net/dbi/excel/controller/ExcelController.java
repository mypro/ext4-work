package cn.net.dbi.excel.controller;

import java.io.InputStream;

import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import cn.net.dbi.boom.controller.BaseController;

@Controller
public class ExcelController extends BaseController {

	
	@RequestMapping("/getDataFromExcel.do")
	public void getDataFromExcel(@RequestParam("upfile") CommonsMultipartFile  upfile,HttpServletResponse rep){
		JSONArray factorArr = new JSONArray();
		try {
            InputStream is = upfile.getInputStream();
            Workbook book = null;
            try {
                book = new XSSFWorkbook(is);
            } catch (Exception ex) {
                book = new HSSFWorkbook(is);
            }
            
            Sheet sheet = book.getSheetAt(0);
            int rowNum = sheet.getLastRowNum();
            
            for(int i=0;i<=rowNum;i++){
            	Row row = sheet.getRow(i);
            	if(null == row){
            		continue;
            	}
            	for(int j=row.getFirstCellNum();j<row.getLastCellNum();j++){
            		Cell cell = row.getCell(j);
            		if(null == cell || null == cell.getRichStringCellValue()){
            			continue;
            		}
            		String value = cell.getRichStringCellValue().toString();

            		JSONObject factor = new JSONObject();
            		factor.put("name", value);
            		factor.put("row", i);
            		factor.put("column", j);
            		
            		factorArr.put(factor);
            	}
            }
            
            is.close();
		}catch(Exception e){
			e.printStackTrace();
		}
		
		JSONObject result = new JSONObject();
		result.put("success", true);
		result.put("factors", factorArr);
		
		out2site(result.toString(), rep);
	}
}
