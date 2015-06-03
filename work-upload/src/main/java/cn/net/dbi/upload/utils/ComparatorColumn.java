/**
 * 
 */
package cn.net.dbi.upload.utils;

import java.util.Comparator;

import cn.net.dbi.table.model.ColumnModel;

/**
 * @author jiawenlong
 *
 */
public class ComparatorColumn  implements Comparator{

	/* (non-Javadoc)
	 * @see java.util.Comparator#compare(java.lang.Object, java.lang.Object)
	 */
	public int compare(Object arg0, Object arg1) {
		ColumnModel c1=(ColumnModel) arg0;
		ColumnModel c2=(ColumnModel) arg1;
		return c1.getSeq().compareTo(c2.getSeq());
	}

}
