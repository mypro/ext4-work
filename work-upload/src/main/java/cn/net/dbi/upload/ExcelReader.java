package cn.net.dbi.upload;

import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;

import cn.net.dbi.table.ConstantInfo;
import cn.net.dbi.table.DataTypeConstantInfo;

/**
 * 操作Excel表格的功能类
 */
public class ExcelReader {
    private POIFSFileSystem fs;
    private HSSFWorkbook wb;
    private HSSFSheet sheet;
    private HSSFRow row;
    private int[] indexs;//数据库对应表及excel都有的字段的下标
    private String[] titles;//数据库对应表及excel都有的字段
    private InputStream is;
    public ExcelReader(InputStream is){
    	this.is=is;
    	try {
            fs = new POIFSFileSystem(is);
            wb = new HSSFWorkbook(fs);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    

    
    public Map<Integer, String> readExcelSheets(){
    	int sheetNums=wb.getNumberOfSheets();
    	Map<Integer, String> sheetName = new HashMap<Integer, String>();
    	for(int i=0;i<sheetNums;i++){
    		sheetName.put(i, wb.getSheetName(i));
    	}
    	 return sheetName;
    }
    /**
     * 得到sheet名称
     * @param is
     * @param sheetIndex
     * @return
     */
    public String readExcelSheetName(int sheetIndex){
    	 String sheetName=wb.getSheetName(sheetIndex);
    	 return sheetName;
    }
    
    public List<Map<String,Object>> readExcelTitleMap(int sheetIndex){
    	List<Map<String,Object>> titleMap=new ArrayList<Map<String, Object>>();
    	sheet=wb.getSheetAt(sheetIndex);
    	HSSFRow titleRow = sheet.getRow(0);
    	HSSFRow contentRow = sheet.getRow(0);
    	if(null==titleRow){
    		return null;
    	}
    	int colNum = titleRow.getPhysicalNumberOfCells();
        int firstCN = titleRow.getFirstCellNum();
        for (int i = firstCN; i < colNum+firstCN; i++){
        	Map<String,Object> title=new HashMap<String, Object>();
        	title.put("column", getCellFormatValue(titleRow.getCell((short)i)));
        	int type = contentRow.getCell((short)i).getCellType();
        	String columnType=DataTypeConstantInfo.COLUMNTYPE_CHAR;
        	switch(type){
	        	case HSSFCell.CELL_TYPE_STRING:
	                columnType=DataTypeConstantInfo.COLUMNTYPE_CHAR;
	                break;
	            case HSSFCell.CELL_TYPE_NUMERIC:
	            	columnType=DataTypeConstantInfo.COLUMNTYPE_DECIMAL;
	                break;
	            case HSSFCell.CELL_TYPE_FORMULA: {
	                // 判断当前的cell是否为Date
	                if (HSSFDateUtil.isCellDateFormatted(contentRow.getCell((short)i))) {
	                    // 如果是Date类型则，转化为Data格式
	                    //方法1：这样子的data格式是带时分秒的：2011-10-12 0:00:00
	                    //cellvalue = cell.getDateCellValue().toLocaleString();
	                    //方法2：这样子的data格式是不带带时分秒的：2011-10-12
	                	columnType=DataTypeConstantInfo.COLUMNTYPE_DATE_1;
	                }
	                break;
	            }
	            default:
	            	columnType=DataTypeConstantInfo.COLUMNTYPE_CHAR;
	                break;
        	}
        	title.put("columnType", columnType);
        	titleMap.add(title);
        }
        if(titleMap.size()>0){
        	return titleMap;
        }
        return null;
    }
    /**
     * 读取Excel表格表头的内容
     * @param InputStream
     * @return String 表头内容的数组
     */
    public String[] readExcelTitle(List columns,int sheetIndex) {
    	titles=null;
    	indexs=null;
    	titles=new String[columns.size()+1];
    	indexs=new int[columns.size()];
        sheet = wb.getSheetAt(sheetIndex);
        String sheetName=sheet.getSheetName();
        row = sheet.getRow(0);
        if(null==row){
        	return null;
        }
        // 标题总列数
        int colNum = row.getPhysicalNumberOfCells();
        int firstCN = row.getFirstCellNum();
        int lastCN = row.getLastCellNum();
        System.out.println("colNum:" + colNum);
        for(int i=0;i<columns.size();i++){
	        for (int j = firstCN; j < colNum+firstCN; j++) {
	            //title[i] = getStringCellValue(row.getCell((short) i));
	            String tempTitle = getCellFormatValue(row.getCell((short) j));
	            if(((String) columns.get(i)).trim().toLowerCase().equals(tempTitle.trim().toLowerCase())){
	            	titles[i]=tempTitle;
	            	indexs[i]=j;
	            }
	        }
        }
        titles[columns.size()]="seq";
        if(titles.length>1){
        	return titles;
        }else{
        	return null;
        }
        
    }

    /**
     * 读取Excel数据内容
     * @param InputStream
     * @return Map 包含单元格数据内容的Map对象
     */
    public List<Map<String, Object>> readExcelContent(int sheetIndex) {
        Map<String, Object> content=null;
        String str = "";
        sheet = wb.getSheetAt(sheetIndex);
        // 得到总行数
        int rowNum = sheet.getLastRowNum();
        row = sheet.getRow(0);
        if(null==row){
        	return null;
        }
        int colNum = row.getPhysicalNumberOfCells();
        // 正文内容应该从第二行开始,第一行为表头的标题
        List<Map<String, Object>> contents=new ArrayList<Map<String,Object>>();
        for (int i = 1; i <= rowNum; i++) {
            row = sheet.getRow(i);
            content= new HashMap<String, Object>();
            for(int j=0;j<indexs.length;j++){
            	Object o =row.getCell((short)indexs[j]);
            	content.put(titles[j], getCellFormatValue(row.getCell((short)indexs[j])));
            	
            }
            content.put("seq", (i-1)*1024);
            contents.add(content);
        }
        return contents;
    }

    /**
     * 获取单元格数据内容为字符串类型的数据
     * 
     * @param cell Excel单元格
     * @return String 单元格数据内容
     */
    private String getStringCellValue(HSSFCell cell) {
        String strCell = "";
        switch (cell.getCellType()) {
        case HSSFCell.CELL_TYPE_STRING:
            strCell = cell.getStringCellValue();
            break;
        case HSSFCell.CELL_TYPE_NUMERIC:
            strCell = String.valueOf(cell.getNumericCellValue());
            break;
        case HSSFCell.CELL_TYPE_BOOLEAN:
            strCell = String.valueOf(cell.getBooleanCellValue());
            break;
        case HSSFCell.CELL_TYPE_BLANK:
            strCell = "";
            break;
        default:
            strCell = "";
            break;
        }
        if (strCell.equals("") || strCell == null) {
            return "";
        }
        if (cell == null) {
            return "";
        }
        return strCell;
    }

    /**
     * 获取单元格数据内容为日期类型的数据
     * 
     * @param cell
     *            Excel单元格
     * @return String 单元格数据内容
     */
    private String getDateCellValue(HSSFCell cell) {
        String result = "";
        try {
            int cellType = cell.getCellType();
            if (cellType == HSSFCell.CELL_TYPE_NUMERIC) {
                Date date = cell.getDateCellValue();
                result = (date.getYear() + 1900) + "-" + (date.getMonth() + 1)
                        + "-" + date.getDate();
            } else if (cellType == HSSFCell.CELL_TYPE_STRING) {
                String date = getStringCellValue(cell);
                result = date.replaceAll("[年月]", "-").replace("日", "").trim();
            } else if (cellType == HSSFCell.CELL_TYPE_BLANK) {
                result = "";
            }
        } catch (Exception e) {
            System.out.println("日期格式不正确!");
            e.printStackTrace();
        }
        return result;
    }

    /**
     * 根据HSSFCell类型设置数据
     * @param cell
     * @return
     */
    private String getCellFormatValue(HSSFCell cell) {
        String cellvalue = "";
        if (cell != null) {
            // 判断当前Cell的Type
        	int type = cell.getCellType();
        	cell.setCellType(cell.CELL_TYPE_STRING);
            switch (cell.getCellType()) {
            // 如果当前Cell的Type为NUMERIC
            case HSSFCell.CELL_TYPE_NUMERIC:
            	/*cellvalue=String.valueOf(cell.getNumericCellValue());
            	break;*/
            case HSSFCell.CELL_TYPE_FORMULA: {
                // 判断当前的cell是否为Date
                if (HSSFDateUtil.isCellDateFormatted(cell)) {
                    // 如果是Date类型则，转化为Data格式
                    
                    //方法1：这样子的data格式是带时分秒的：2011-10-12 0:00:00
                    //cellvalue = cell.getDateCellValue().toLocaleString();
                    
                    //方法2：这样子的data格式是不带带时分秒的：2011-10-12
                    Date date = cell.getDateCellValue();
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                    cellvalue = sdf.format(date);
                    
                }
                // 如果是纯数字
                else {
                    // 取得当前Cell的数值
                    cellvalue = String.valueOf(cell.getNumericCellValue());
                }
                break;
            }
            // 如果当前Cell的Type为STRIN
            case HSSFCell.CELL_TYPE_STRING:
                // 取得当前的Cell字符串
                cellvalue = cell.getRichStringCellValue().getString();
                break;
            // 默认的Cell值
            default:
                cellvalue = "";
            }
        } else {
            cellvalue = "";
        }
        return cellvalue;

    }

    public static void main(String[] args) {
        /*try {
            // 对读取Excel表格标题测试
            InputStream is = new FileInputStream("H:\\test.xls");
            ExcelReader excelReader = new ExcelReader();
            String[] title = excelReader.readExcelTitle(is);
            System.out.println("获得Excel表格的标题:");
            for (String s : title) {
                System.out.print(s + " ");
            }

            // 对读取Excel表格内容测试
            InputStream is2 = new FileInputStream("H:\\test.xls");
            Map<Integer, String> map = excelReader.readExcelContent(is2);
            System.out.println("获得Excel表格的内容:");
            for (int i = 1; i <= map.size(); i++) {
                System.out.println(map.get(i));
            }

        } catch (FileNotFoundException e) {
            System.out.println("未找到指定路径的文件!");
            e.printStackTrace();
        }*/
    }
}