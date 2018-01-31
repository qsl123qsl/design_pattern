/*
* 建造(Builder)模式  是一种对象构建的设计模式，它可以将复杂对象的建造过程抽象出来（抽象类别），使这个抽象过程的不同实现方法可以构造出不同表现（属性）的对象
*/


//首先假设一个复杂对象是由多个部件组成的，Builder模式是把复杂对象的创建和部件的创建分别开来，分别用Builder类和Director类来表示
//首先,需要一个接口，它定义如何创建复杂对象的各个部件：
public interface Builder {
　  //创建部件A　　比如创建汽车车轮void buildPartA();
　  //创建部件B 比如创建汽车方向盘void buildPartB();
　  //创建部件C 比如创建汽车发动机void buildPartC();
　  //返回最后组装成品结果 (返回最后装配好的汽车)
　  //成品的组装过程不在这里进行,而是转移到下面的Director类中进行.
　  //从而实现了解耦过程和部件
    Product getResult();
}


//用Director构建最后的复杂对象，而在上面Builder接口中封装的是如何创建一个个部件(复杂对象是由这些部件组成的)，也就是说Director的内容是如何将部件最后组装成成品：
public class Director {
    private Builder builder;
    public Director( Builder builder ) {
        this.builder = builder;
　  }
　  // 将部件partA partB partC最后组成复杂对象
　  //这里是将车轮 方向盘和发动机组装成汽车的过程
    public void construct() {
        builder.buildPartA();
        builder.buildPartB();
        builder.buildPartC();
    }
}



public class ConcreteBuilder implements Builder {
　Part partA, partB, partC;
　public void buildPartA() {
　　//这里是具体如何构建
　}
　public void buildPartB() {
　　//这里是具体如何构建
　}
　public void buildPartC() {
　　//这里是具体如何构建
　}
　public Product getResult() {
　　//返回最后组装成品结果
　}
}


//复杂对象：产品Product：
public interface Product { }
//复杂对象的部件：
public interface Part { }
//我们看看如何调用Builder模式:
ConcreteBuilder builder = new ConcreteBuilder();
Director director = new Director( builder );
director.construct();
Product product = builder.getResult();


//在Java实际使用中，我们经常用到"池"(Pool)的概念，当资源提供者无法提供足够的资源，并且这些资源需要被很多用户反复共享时，就需要使用池。"池"实际是一段内存，当池中有一些复杂的资源的"断肢"(比如数据库的连接池，也许有时一个连接会中断)，
//如果循环再利用这些"断肢"，将提高内存使用效率，提高池的性能。修改Builder模式中Director类使之能诊断"断肢"断在哪个部件上，再修复这个部件