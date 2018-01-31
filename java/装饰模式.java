/*
* 装饰模式  装饰模式(Decorator)，动态地给一个对象添加一些额外的职责，就增加功能来说，装饰模式比生成子类更为灵活。
*/




//假设情景：某人装扮自己形象，穿衣服，裤子，鞋子，戴帽子等来把自己给包装起来，需要把所需的功能按正确的顺序串联起来进行控制，我们应该如何设计才能做到呢？如下，先看下代码结构图

先创建一个接口类：Component.java

public interface Component {    
    void show();
}


//创建一个具体的 ConcreteComponent 来实现 Component 接口：Person.java
public class Person implements Component{
    private String name;
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Person(String name){
        this.name = name;
    }

    @Override
    public void show() {
        System.out.println("装扮的" + name);
    }
}


//创建装饰类 Decorator 实现 Component 接口
public class Decorator implements Component{
    private Component mComponent;
    public void decoratorObj(Component component){
        mComponent = component;
    }

    @Override
    public void show() {
        if(mComponent != null){
            mComponent.show();
        }
    }
}


//分别创建具体的装饰类：Jeans.java , Pelisse.java, Sandal.java ...等等，分别继承 Decorator.java 类
/** 牛仔裤 */
public class Jeans extends Decorator {
    @Override
    public void show(){
        System.out.println("穿牛仔裤");
        super.show();
    }
    
}

//客户端测试类
/**
 * 装饰模式测试客户端
 */
public class DecoratorClient {
    public static void main(String[] args) {
        System.out.println("Welcome to Andy.Chen Blog!" +"\n" 
                   +"Decorator Patterns." +"\n");
        
        Person mPerson = new Person("Andy");
        
        Sandal mSandal = new Sandal();
        Jeans mJeans = new Jeans();
        TShirt mShirt = new TShirt();
        
        mShirt.decoratorObj(mPerson);
        mJeans.decoratorObj(mShirt);
        mSandal.decoratorObj(mJeans);
        mSandal.show(); 
    }
}

/*
比静态继承更灵活与对象的静态继承相比，Decorator模式提供了更加灵活的向对象添加职责的方式，可以使用添加和分离的方法，用装饰在运行时刻增加和删除职责。使用继承机制增加职责需要创建一个新的子类，如果需要为原来所有的子类都添加功能的话，每个子类都需要重写，增加系统的复杂度，此外可以为一个特定的Component类提供多个Decorator，这种混合匹配是适用继承很难做到的。
避免在层次结构高层的类有太多的特征，Decorator模式提供了一种“即用即付”的方法来添加职责，他并不试图在一个复杂的可订制的类中支持所有可预见的特征，相反可以定义一个简单的类，并且用Decorator类给他逐渐的添加功能，从简单的部件组合出复杂的功能。
Decorator 与它的Component不一样Decorator是一个透明的包装，如果我们从对象标识的观点出发，一个被装饰了的组件与这个组件是有差别的，因此使用装饰时不应该以来对象标识。
产生许多小对象，采用Decorator模式进行系统设计往往会产生许多看上去类似的小对象，这些对象仅仅在他们相互连接的方式上有所不同。
*/