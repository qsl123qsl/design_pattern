/*
* 解释器模式 给定一种语言，定义他的文法的一种表示，并定义一个解释器，该解释器使用该表示来解释语言中句子
*/



package com.model.behaviour;
 
public class Context {
 
    private int num1;
    private int num2;
 
    public Context(int num1, int num2) {
        this.num1 = num1;
        this.num2 = num2;
    }
 
    public int getNum1() {
        return num1;
    }
 
    public void setNum1(int num1) {
        this.num1 = num1;
    }
 
    public int getNum2() {
        return num2;
    }
 
    public void setNum2(int num2) {
        this.num2 = num2;
    }
 
}

package com.model.behaviour;
 
public interface Expression {  
    public int interpret(Context context);  
}


package com.model.behaviour;
 
public class Minus implements Expression {  
 
    @Override 
    public int interpret(Context context) {  
        return context.getNum1()-context.getNum2();  
    }  
}


package com.model.behaviour;
 
public class Plus implements Expression {  
 
    @Override 
    public int interpret(Context context) {  
        return context.getNum1()+context.getNum2();  
    }  
}


package com.model.behaviour;
 
public class Test {
 
    public static void main(String[] args) {
        // 计算9+2-8的值
        int result = new Minus().interpret((new Context(new Plus()
                .interpret(new Context(9, 2)), 8)));
        System.out.println(result);
    }
}