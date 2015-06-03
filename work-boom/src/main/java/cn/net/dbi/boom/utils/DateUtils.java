package cn.net.dbi.boom.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

public class DateUtils {
	
	public final static SimpleDateFormat FORMATE_SECOND = new SimpleDateFormat(
            "yyyy-MM-dd HH:mm:ss");
    public final static SimpleDateFormat FORMATE_MINUTE = new SimpleDateFormat(
            "yyyy-MM-dd HH:mm");
    public final static SimpleDateFormat FORMATE_DAY = new SimpleDateFormat(
            "yyyy-MM-dd");
    
    /**
     * DATE对象转化成字符串
     * 
     * @param date
     * @param format
     * @return
     */
    public static String convertDate2Str(Date date, SimpleDateFormat format) {
        return format.format(date);
    }

    /**
     * 字符串日期转化成Date对象
     * 
     * @param sDate
     * @return
     * @throws ParseException
     */
    public static Date converStr2Date(String sDate) throws ParseException {
        return FORMATE_DAY.parse(sDate);
    }
    
    /**
     * 尝试用各种日期格式进行转换
     * 
     * @param sDate
     * @return
     */
    public static Date tryConverStr2Date(String sDate){
    	List<SimpleDateFormat> formats = Arrays.asList(new SimpleDateFormat[]{
    			FORMATE_SECOND,
    			FORMATE_MINUTE,
    			FORMATE_DAY
    	});
    	
    	for(Iterator<SimpleDateFormat> it=formats.iterator();
    			it.hasNext();){
    		SimpleDateFormat format = it.next();
    		
    		try {
				return format.parse(sDate);
			} catch (Exception e) {
				continue;
			}
    	}
    	
        return null;
    }
}
