/**
 * 
 */
package cn.net.dbi.factor.function;

import java.util.List;
import java.util.Random;

import javax.persistence.criteria.CriteriaBuilder.In;

import org.apache.commons.lang.math.RandomUtils;
import org.springframework.expression.spel.ast.OperatorBetween;
import org.wltea.expression.op.IOperatorExecution;
import org.wltea.expression.op.Operator;
import org.wltea.expression.op.define.Op_AND;

/**
 * @author jiawenlong
 * 定义函数表达式
 * 大部分参照Excel中的函数,具体函数说明可参见《Excel中函数.docx》
 */
public class ExpressionFucntion {
	public String test(){
		Op_AND and = new Op_AND();
		and.toString();
		return "";
	}
	/**
	 * 绝对值函数
	 * @param number
	 * @return
	 */
	public Integer abs(Integer number){
		if(number>=0){
			return number;
		}else{
			return number*(-1);
		}
	}
	/**
	 * 求余
	 * @param number
	 * @param divisor
	 * @return
	 */
	public Integer mod(Integer number,Integer divisor){
		return number%divisor;
	}
	/**
	 * 求和
	 * @param list
	 * @return
	 */
	public Integer sum(List<Integer> list){
		Integer sum = 0;
		for(int i=0;i<list.size();i++){
			sum+=list.get(i);
		}
		return sum;
	}
	/**
	 * 平均数
	 * @param list
	 * @return
	 */
	public double average(List<Integer> list){
		double sum = this.sum(list);
		return sum/list.size();
	}
	/**
	 * 调和平均数
	 */
	public double harmean(List<Integer> list){
		int n =list.size();
		double sum=0.0;
		for(int i=0;i<list.size();i++){
			sum+=1/list.get(i);
		}
		if(sum>0){
			return n/sum;
		}else{
			return 0;
		}
	}
	/**
	 * 返回一组对象所有可能的组合数目
	 * @param sumNum 某一对象总数量
	 * @param useNum 每一组合中对象的数量
	 * @return 组合数
	 */
	public Integer combin(Integer sumNum,Integer useNum){
		
		return fact(sumNum)/(fact(useNum)*fact(sumNum-useNum));
	}
	/**
	 * 阶乘
	 */
	public Integer  fact(Integer num){
		if(num==0){
			return 0;
		}
		int temp=1;
		for(;num>0;num--){
			temp=temp*num;
		}
		return temp;
	}
	/**
	 * 返回e的n次幂
	 * @param num
	 * @return
	 */
	public double exp(Integer num){
		Double nb = num.doubleValue();
		  int i, n;
		    double s, t, item, result;
		    item=1;
		    result=1;
		    for (n=1; item>=1e-4 || item<=-1e-4; n++)
		    //求无限级数每一项的循环，结束循环的条件就是当前一项的绝对值<=0.0001，所以计算结果精确到小数点后第四位
		    {
		        s=1;
		        t=1;
		        for (i=1; i<=n; i++)
		        {
		            s=s*i;//s就是求n的阶乘
		            t=t*nb;//求x的n次幂
		        }
		        item=t/s;//每一项的值
		        result=result+item;//求和

		    }
		    return result;
	}
	/**
	 * 返回圆周率π
	 * @return
	 */
	public double pi(){
		return Math.PI;
	}
	/**
	 * 返回给定数字的乘幂
	 * @param num
	 * @param power
	 * @return
	 */
	public double power(Integer num,Integer power){
		return Math.pow(num, power);
	}
	
	/**
	 * 按所指定的底数，返回某个数的对数
	 * @param num
	 * @param base
	 * @return
	 */
	public double log(Integer num,Integer base){
		return Math.log(num) / Math.log(base);
	}
	/**
	 * 返回一个大于零小于1的数
	 * @return
	 */
	public double rand(){
		double s = (int) Math.round(Math.random()*999999);
		return s/1000000;
	}
	public static void main(String[] args) {
		Random r= new Random(10);
		double s = (int) Math.round(Math.random()*999999);
		System.out.println( s/1000000);
	}
}
