package cn.net.dbi.boom.utils;

public interface IMapIteratorCallback<K, V> {
	
	public Object iteratorCallback(K key, V value);
	
	public boolean stopIterator(K key, V value);
}
