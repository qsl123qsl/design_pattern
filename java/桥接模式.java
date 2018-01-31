/*
桥接模式  
某些类型由于自身的逻辑，它具有两个或多个维度的变化，那么如何应对这种“多维度的变化”？如何利用面向对象的技术来使得该类型能够轻松的沿着多个方向进行变化，而又不引入额外的复杂度？这就要使用Bridge模式。
在提出桥梁模式的时候指出，桥梁模式的用意是”将抽象化(Abstraction)与实现化(Implementation)脱耦，使得二者可以独立地变化”。这句话有三个关键词，也就是抽象化、实现化和脱耦。
抽象化：存在于多个实体中的共同的概念性联系，就是抽象化。作为一个过程，抽象化就是忽略一些信息，从而把不同的实体当做同样的实体对待。
实现化：抽象化给出的具体实现，就是实现化。
脱耦：所谓耦合，就是两个实体的行为的某种强关联。而将它们的强关联去掉，就是耦合的解脱，或称脱耦。在这里，脱耦是指将抽象化和实现化之间的耦合解脱开，或者说是将它们之间的强关联改换成弱关联。
*/
package com.model.structure;
 
public interface Driver {  
    public void connect();  
}



package com.model.structure;
 
public class MysqlDriver implements Driver {
 
    @Override
    public void connect() {
        System.out.println("connect mysql done!");
    }
}



package com.model.structure;
 
public class DB2Driver implements Driver {
 
    @Override
    public void connect() {
        System.out.println("connect db2 done!");
    }
}


package com.model.structure;
 
public abstract class DriverManager {
 
    private Driver driver;
 
    public void connect() {
        driver.connect();
    }
 
    public Driver getDriver() {
        return driver;
    }
 
    public void setDriver(Driver driver) {
        this.driver = driver;
    }
 
}


package com.model.structure;
 
public class MyDriverManager extends DriverManager {
 
    public void connect() {
        super.connect();
    }
 
}


package com.model.structure;
 
public class Client {
 
    public static void main(String[] args) {
 
        DriverManager driverManager = new MyDriverManager();
        Driver driver1 = new MysqlDriver();
        driverManager.setDriver(driver1);
        driverManager.connect();
 
        Driver driver2 = new DB2Driver();
        driverManager.setDriver(driver2);
        driverManager.connect();
 
    }
}


//（1）假设我想加一个OracleDriver，这是一个维度，很好理解，不多解释。（2）假设我们想在连接前后固定输出点什么，我们只需要加一个MyDriverManager2，代码如下：
package com.model.structure;
 
public class MyDriverManager2 extends DriverManager {
 
    public void connect() {
        System.out.println("before connect");
        super.connect();
        System.out.println("after connect");
    }
 
}