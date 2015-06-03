package cn.net.dbi.boom.utils;

import java.util.ArrayList;
import java.util.List;

public class PKUtils {
	
	public static String getUUID(){
		String uuid = java.util.UUID.randomUUID().toString();
		return uuid.replace("-", "");
	}
	
	public static List<String> getUUIDs(int size){
		List<String> uuids = new ArrayList<String>();
		for(int i=0;i<size;i++){
			uuids.add(getUUID());
		}
		return uuids;
	}
}
