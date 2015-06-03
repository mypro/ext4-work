package cn.net.dbi.boom.utils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Random;

import net.sf.json.JSONArray;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.Predicate;

public class BoomCollectionsUtils {
	
	public static Predicate getMapPredicate(final Map<String, Object> conditionMap){
		return new Predicate(){
			public boolean evaluate(Object object) {
				Map<String, Object> result = (Map<String, Object>)object;
				for(Iterator<String> conditionKeyIt=conditionMap.keySet().iterator();
						conditionKeyIt.hasNext();){
					String conditionKey = conditionKeyIt.next();
					if(!String.valueOf(conditionMap.get(conditionKey)).equals(
							String.valueOf(result.get(conditionKey))
							)){
						return false;
					}
				}
				return true;
			}
		};
	} 
	
	public static boolean isNotEmptyCollection(Collection c){
		return null != c && 0 < c.size();
	}
	
	public static boolean isNotEmptyMap(Map m){
		return null != m && 0 < m.size();
	}

	public static <K, V> Object iterMap(Map<K, V> map, IMapIteratorCallback<K, V> calback){
		for(Iterator<K> keyIt=map.keySet().iterator();keyIt.hasNext();){
			K key = keyIt.next();
			V value = (V)map.get(key);
			Object o = calback.iteratorCallback(key, value);
			if(calback.stopIterator(key, value)){
				return o;
			}
		}
		return null;
	}
	
	/**
	 * 将MAP中的所有value，放到一个arraylist中
	 * 
	 * @param map
	 * @return
	 */
	public static <K,V> List<V> mapValue2List(Map<K, V> map){
		List<V> list = new ArrayList<V>();
		Iterator<K> it=map.keySet().iterator();
		while(it.hasNext()){
			K key = it.next();
			V obj = map.get(key);
			list.add(obj);
		}
		return list;
	}
	
	/**
	 * 从元素是MAP的list中，提取map的某一列数据到新的list中
	 * @param records
	 * @param columnName
	 * @return
	 */
	public static List getOneColumnData(List<Map<String, Object>> records, String columnName){
		List datas = new ArrayList();
		for(Iterator<Map<String, Object>> recordIt=records.iterator();recordIt.hasNext();){
			Map<String, Object> record = recordIt.next();
			datas.add(record.get(columnName));
		}
		return datas;
	}
	
	public static void mergeRecordColumn(List<Map<String, Object>> dstRecords,
										List<Map<String, Object>> srcRecords,
										String dstColumn,
										String srcColumn){
		Map<Object, Map<String, Object>> srcMap = new HashMap<Object, Map<String, Object>>();
		for(Iterator<Map<String, Object>> it = srcRecords.iterator();it.hasNext();){
			Map<String, Object> srcElement = it.next();
			srcMap.put(srcElement.get(srcColumn), srcElement);
		}
		for(int i=0;i<dstRecords.size();i++){
			Map<String, Object> dstElement = dstRecords.get(i);
			Object key = dstElement.get(dstColumn);
			Map<String, Object> srcElement = srcMap.get(key);
			
			// 先加入src，再加入dst!!
			Map<String, Object> newElement = new HashMap<String, Object>();
			newElement.putAll(srcElement);
			newElement.putAll(dstElement);
			dstRecords.set(i, newElement);
		}
	}
	
	public static String containStr(List<String> list, String key){
		for(Iterator<String> it=list.iterator();it.hasNext();){
			String obj = it.next();
			if(obj.contains(key)){
				return obj;
			}
		}
		return null;
	}
	
	public static Map<String, Object> containKV(List<Map<String, Object>> list, String key, Object value){
		for(Iterator<Map<String, Object>> it=list.iterator();it.hasNext();){
			Map<String, Object> element = it.next();
			if(value.equals(element.get(key))){
				return element;
			}
		}
		return null;
	}
	
	public static int each(Collection collections, ICollectionIteratorCallback fn){
		int i = 0;
		for(Iterator it=collections.iterator();it.hasNext();){
			if(!fn.fn(it.next())){
				return i; 
			}
			i++;
		}
		return i;
	}
	
	public static Object find(JSONArray ja, Predicate predicate) {
		List list = JSONArray.toList(ja);
		return CollectionUtils.find(list, predicate);
    }
	
	public static <T> void randomSeq(List<T> list){
		Collections.sort(list, new Comparator<T>(){
			private final int[] vs = {-1,0,1};
			private final Random rnd = new Random();
			public int compare(T arg0, T arg1) {
				return vs[rnd.nextInt(vs.length)];
			}			
		});
	}
	
}
