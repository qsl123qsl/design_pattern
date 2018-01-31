/*
* 单例模式  保证一个类仅有一个实例，并提供一个访问它的全局访问点
*/


/* 
* 懒汉式 
* 优点：延迟加载（需要的时候才去加载）,适合单线程操作
* 缺点： 线程不安全，在多线程中很容易出现不同步的情况，如在数据库对象进行的频繁读写操作时。
*/
public class Singleton {  
    /* 持有私有静态实例，防止被引用，此处赋值为null，目的是实现延迟加载 */  
    private static Singleton instance = null;  
  
    /* 私有构造方法，防止被实例化 */  
    private Singleton() {}  
  
    /* 1:懒汉式，静态工程方法，创建实例 */  
    public static Singleton getInstance() {  
        if (instance == null) {  
            instance = new Singleton();  
        }  
        return instance;  
    }
}  


/* 
* 双重线程检查模式
* 优点：延迟加载，线程安全
* 缺点： 写法复杂，不简洁 
*/
public class SingletonInner {  
    private static volatile SingletonInner sInst = null;  // <<< 这里添加了 volatile  
  
    /** 
     * 私有的构造函数 
     */  
    private SingletonInner() {}  
  
    public static SingletonInner getInstance() {  
        SingletonInner inst = sInst;  // <<< 在这里创建临时变量
        if (inst == null) {
            synchronized (SingletonInner.class) {
                inst = sInst;
                if (inst == null) {
                    inst = new SingletonInner();
                    sInst = inst;
                }
            }
        }
        return inst;  // <<< 注意这里返回的是临时变量
    }
  
    protected void method() {  
        System.out.println("SingletonInner");  
    }  
}  


/* 
* 内部类的实现
* 优点：延迟加载，线程安全（java中class加载时互斥的），也减少了内存消耗，推荐使用内部类方式
*/
public class SingletonInner {  
    /** 
     * 内部类实现单例模式 
     * 延迟加载，减少内存开销   
     */  
    private static class SingletonHolder {  
        private static SingletonInner instance = new SingletonInner();  
    }  
  
    /** 
     * 私有的构造函数 
     */  
    private SingletonInner() {}  
  
    public static SingletonInner getInstance() {  
        return SingletonHolder.instance;  
    }  
  
    protected void method() {  
        System.out.println("SingletonInner");  
    }  
}  