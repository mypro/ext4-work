package cn.net.dbi.algorithm.layout.utils;

public class AngleUtils {
	
	/**
	 * 两个线段是否有交点
	 * @param x1
	 * @param y1
	 * @param x2
	 * @param y2
	 * @param x3
	 * @param y3
	 * @param x4
	 * @param y4
	 * @return
	 */
	public static boolean hasIntersection(double x1, double y1, double x2, double y2,
										double x3, double y3, double x4, double y4){
		
		double k1=0, b1=0, k2=0, b2=0;
		
		if(x1 != x2) 
		{
		      k1 = (y1 - y2) / (x1 - x2);
		      b1 = y1 - k1*x1;
		}
		if(x3 != x4) 
		{
		      k2 = (y3 - y4) / (x3 - x4);
		      b2 = y3 - k2*x3;
		}
		
		if(x1 == x2) 
		{
		    if(x3 == x4){
		    	
		    }else
		        //线段有交点(y1, k2*y1+b2)
		    	return true;
		}
		else
		{
		   if(x3 == x4) 
			   //线段有交点(y3, k1*y3+b1)
			   return true;
		   else
		   {
		       //直线有交点((b1-b2)/(k2-k1), (k1*b2-k2*b1)/(k1-k2));
		       if((b1-b2)/(k2-k1) >= x1 
		    	 && (b1-b2)/(k2-k1) >= x3
		         && ((b1-b2)/(k2-k1) <= x2 
		         && (b1-b2)/(k2-k1) <= x4))
		       {
		    	   return true;
		       }
		   }
		}

		return false;
	}
	
	public static double calculateAngleByTan(int x1, int y1, int x2, int y2){
		if(x1 == x2){
			return y2>=y1?90:-90;
		}
		if(y1 == y2){
			return x2>=x1?0:180;
		}
		double tanDegree = Math.toDegrees(Math.atan(
				((double)(y2-y1))/((double)(x2-x1))
		));
		if((tanDegree>0 && y2<y1)
				|| (tanDegree<0 && y2>y1)){
			tanDegree += 180;
		}
		return tanDegree;
	}
	
	public static double calculateAngleByTan(double tanValue){
		return Math.toDegrees(Math.atan(tanValue));

	}
	
	public static void main(String[] args) {
		boolean has = hasIntersection(1, 1, 1, 1, 1, 1, 1, 1);
		
		System.out.println(has);
	}
}
