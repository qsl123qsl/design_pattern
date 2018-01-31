/*
* 观察者模式 观察者模式定义了一种一对多的依赖关系，让多个观察者对象同时监听某一主题对象。这个主题对象在状态发生变化时，会通知所有观察者对象，
* 使它们能够自动更新自己。观察者模式又叫发布-订阅(Publish/Subscribe)模式！！！
*/


/**  
 * Subject(目标，Subject)：    
 * 目标知道它的观察者。可以有任意多个观察者观察同一个目标。  
 * 提供注册和删除观察者对象的接口。  
 */  
public interface Subject {  
    public void attach(Observer mObserver);  
    public void detach(Observer mObserver);        
    public void notice();  
} 

/**  
 * Observer(观察者，Observer)：  
 * 为那些在目标发生改变时需要获得通知的对象定义一个更新接口。   
 */  
public interface Observer {  
    public void update();  
}  


/**  
 * ConcreteSubject(具体目标，Teacher)  
 * 将有关状态存入各ConcreteObserve对象。  
 * 当他的状态发生改变时，向他的各个观察者发出通知。   
 */  
public class Teacher implements Subject{  
     
    private String phone;  
    private Vector students;  
    
    public Teacher(){  
        phone = "";  
        students = new Vector();  
    }  
  
    @Override  
    public void attach(Observer mObserver) {  
        students.add(mObserver);  
    }  
  
    @Override  
    public void detach(Observer mObserver) {  
        students.remove(mObserver);  
    }  
  
    @Override  
    public void notice() {  
        for(int i=0;i<students.size();i++){  
            ((Observer)students.get(i)).update();  
        }  
    }  
  
    public String getPhone() {  
        return phone;  
    }  
  
    public void setPhone(String phone) {  
        this.phone = phone;  
        notice();  
    }  
}


/**  
 * ConcreteObserver(具体观察者, Student)：  
 * 维护一个指向ConcreteSubject对象的引用。  
 * 存储有关状态，这些状态应与目标的状态保持一致。  
 * 实现Observer的更新接口以使自身状态与目标的状态保持一致。  
 */  
public class Student implements Observer{  
  
    private String name;  
    private String phone;  
    private Teacher mTeacher;  
      
    public Student(String name,Teacher t){  
       this.name = name;  
       mTeacher = t;  
    }  
      
    public void show(){  
       System.out.println("Name:"+name+"\nTeacher'sphone:" + phone);  
    }  
      
    @Override  
    public void update() {  
        phone = mTeacher.getPhone();  
    }  
}  




 /**  
 * 观察者(Observer)模式测试类   
 */  
public class ObserverClient {  
    public static void main(String[] args) {  
       Vector students = new Vector();  
       Teacher t = new Teacher();  
       for(int i= 0;i<10;i++){  
           Student st = new Student("Andy.Chen"+i,t);  
           students.add(st);  
           t.attach(st);  
       }  
         
       System.out.println("Welcome to Andy.Chen Blog!" +"\n"   
                   +"Observer Patterns." +"\n"  
                   +"-------------------------------");  
         
       t.setPhone("12345678");  
       for(int i=0;i<3;i++)  
           ((Student)students.get(i)).show();  
         
       t.setPhone("87654321");  
       for(int i=0;i<3;i++)  
           ((Student)students.get(i)).show();  
    }  
} 


/**
* 观察者模式何时适用？
*当一个抽象模型有两个方面，其中一个方面依赖于另一方面。将这二者封装在独立的对象中可以使他们各自独立地改变和复用。
*当对一个对象的改变需要同时改变其它对象，而不知道具体由多少对象有待改变。
*当一个对象必须通知其他对象，而它又不能假定其他对象是谁，换言之，你不希望这些对象是紧密耦合的。让耦合的双方都依赖于抽象，而不是依赖于具体。
*/