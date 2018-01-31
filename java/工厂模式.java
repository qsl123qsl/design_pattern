/**
* 工厂模式分为三种
* 简单工厂模式： 不利于产生系列产品
* 工厂方法模式：又称为多形性工厂
* 抽象工厂模式：又称为工具箱，产生产品族，但不利于产生新的产品
*/

//#########################################################################简单工厂模式
/*
*简单工厂模式又称静态工厂方法模式。重命名上就可以看出这个模式一定很简单。它存在的目的很简单：定义一个用于创建对象的接口。
*在简单工厂模式中,一个工厂类处于对产品类实例化调用的中心位置上,它决定那一个产品类应当被实例化, 如同一个交通警察站在来往的车辆流中,决定放行那一个方向的车辆向那一个方向流动一样。
*先来看看它的组成：
*工厂类角色：这是本模式的核心，含有一定的商业逻辑和判断逻辑。在java中它往往由一个具体类实现。
*抽象产品角色：它一般是具体产品继承的父类或者实现的接口。在java中由接口或者抽象类来实现。
*具体产品角色：工厂类所创建的对象就是此角色的实例。在java中由一个具体类实现。
*
*/

public class Factory{ //getClass 产生Sample 一般可使用动态类装载装入类。
    public static Sample creator(int which){ 
        if (which==1)
            return new SampleA();
        else if (which==2)
            return new SampleB();
    }
}


//#########################################################################工厂方法模式
/*
* 工厂方法模式是简单工厂模式的进一步抽象化和推广，工厂方法模式里不再只由一个工厂类决定那一个产品类应当被实例化,这个决定被交给抽象工厂的子类去做。
*来看下它的组成：
*抽象工厂角色： 这是工厂方法模式的核心，它与应用程序无关。是具体工厂角色必须实现的接口或者必须继承的父类。在java中它由抽象类或者接口来实现。
*具体工厂角色：它含有和具体业务逻辑有关的代码。由应用程序调用以创建对应的具体产品的对象
*抽象产品角色：它是具体产品继承的父类或者是实现的接口。在java中一般有抽象类或者接口来实现。
*具体产品角色：具体工厂角色所创建的对象就是此角色的实例。在java中由具体的类来实现。
*工厂方法模式使用继承自抽象工厂角色的多个子类来代替简单工厂模式中的“上帝类”。正如上面所说，这样便分担了对象承受的压力；而且这样使得结构变得灵活起来——当有新的产品
*（即暴发户的汽车）产生时，只要按照抽象产品角色、抽象工厂角色提供的合同来生成，那么就可以被客户使用，而不必去修改任何已有的代 码。可以看出工厂角色的结构也是符合开闭原则的
*/

//抽象产品角色
public interface Moveable {
    void run();
}
//具体产品角色
public class Plane implements Moveable {
    @Override
    public void run() {
        System.out.println("plane....");
    }
}
//具体产品角色
public class Broom implements Moveable {
    @Override
    public void run() {
        System.out.println("broom.....");
    }
}

//抽象工厂
public abstract class VehicleFactory {
    abstract Moveable create();
}
//具体工厂
public class PlaneFactory extends VehicleFactory{
    public Moveable create() {
        return new Plane();
    }
}
//具体工厂
public class BroomFactory extends VehicleFactory{
    public Moveable create() {
        return new Broom();
    }
}
//测试类
public class Test {
    public static void main(String[] args) {
        VehicleFactory factory = new BroomFactory();
        Moveable m = factory.create();
        m.run();
    }
}



//#########################################################################抽象工厂模式
//在抽象工厂模式中，抽象产品 (AbstractProduct) 可能是一个或多个，从而构成一个或多个产品族(Product Family)。 在只有一个产品族的情况下，抽象工厂模式实际上退化到工厂方法模式。

//抽象工厂类
public abstract class AbstractFactory {
    public abstract Vehicle createVehicle();
    public abstract Weapon createWeapon();
    public abstract Food createFood();
}
//具体工厂类，其中Food,Vehicle，Weapon是抽象类，
public class DefaultFactory extends AbstractFactory{
    @Override
    public Food createFood() {
        return new Apple();
    }
    @Override
    public Vehicle createVehicle() {
        return new Car();
    }
    @Override
    public Weapon createWeapon() {
        return new AK47();
    }
}
//测试类
public class Test {
    public static void main(String[] args) {
        AbstractFactory f = new DefaultFactory();
        Vehicle v = f.createVehicle();
        v.run();
        Weapon w = f.createWeapon();
        w.shoot();
        Food a = f.createFood();
        a.printName();
    }
}



/*
*总结
*简单工厂模式是由一个具体的类去创建其他类的实例，父类是相同的，父类是具体的。 
*工厂方法模式是有一个抽象的父类定义公共接口，子类负责生成具体的对象，这样做的目的是将类的实例化操作延迟到子类中完成。
*抽象工厂模式提供一个创建一系列相关或相互依赖对象的接口，而无须指定他们具体的类。它针对的是有多个产品的等级结构。而工厂方法模式针对的是一个产品的等级结构。
*/