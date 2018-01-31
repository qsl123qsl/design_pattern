/*
* 中介者模式  用一个中介对象来封装一系列的对象交互。中介者使各对象不需要显式地相互引用，从而使其耦合松散，而且可以独立地改变它们之间的交互
*/

//场景： 
//在一个公司里面，有很多部门、员工（我们统称他们互相为Colleague“同事”），为了完成一定的任务，“同事”之间肯定有许多需要互相配合、交流的过程。
//如果由各个“同事”频繁地到处去与自己有关的“同事”沟通，这样肯定会形成一个多对多的杂乱的联系网络而造成工作效率低下。
//此时就需要一位专门的“中介者”给各个“同事”分配任务，以及统一跟进大家的进度并在“同事”之间实时地进行交互，保证“同事”之间必须的沟通交流。
//很明显我们知道此时的“中介者”担任了沟通“同事”彼此之间的重要角色了，“中介者”使得每个“同事”都变成一对一的联系方式，减轻了每个“同事”的负担，增强工作效率


//同事类族
package com.model.behaviour;
 
public abstract class AbstractColleague {  
    protected AbstractMediator mediator;  
 
    /**既然有中介者，那么每个具体同事必然要与中介者有联系，  
     * 否则就没必要存在于 这个系统当中，这里的构造函数相当  
     * 于向该系统中注册一个中介者，以取得联系  
     */
    public AbstractColleague(AbstractMediator mediator) {  
        this.mediator = mediator;  
    }  
 
    // 在抽象同事类中添加用于与中介者取得联系（即注册）的方法  
    public void setMediator(AbstractMediator mediator) {  
        this.mediator = mediator;  
    }  
}



//具体同事A  
package com.model.behaviour;
 
public class ColleagueA extends AbstractColleague {  
 
    //每个具体同事都通过父类构造函数与中介者取得联系  
    public ColleagueA(AbstractMediator mediator) {  
        super(mediator);  
    }  
 
    //每个具体同事必然有自己分内的事，没必要与外界相关联  
    public void self() {  
        System.out.println("同事A --> 做好自己分内的事情 ...");  
    }  
 
    //每个具体同事总有需要与外界交互的操作，通过中介者来处理这些逻辑并安排工作  
    public void out() {  
        System.out.println("同事A --> 请求同事B做好分内工作 ...");  
        super.mediator.execute("ColleagueB", "self");  
    }  
}

//具体同事B  
package com.model.behaviour;
 
public class ColleagueB extends AbstractColleague {  
 
    public ColleagueB(AbstractMediator mediator) {  
        super(mediator);  
    }  
 
    public void self() {  
        System.out.println("同事B --> 做好自己分内的事情 ...");  
    }  
 
    public void out() {  
        System.out.println("同事B --> 请求同事A做好分内工作  ...");  
        super.mediator.execute("ColleagueA", "self");  
    }  
}



//中介者类族
package com.model.behaviour;
 
public abstract class AbstractMediator {  
 
    //中介者肯定需要保持有若干同事的联系方式  
    protected Hashtable<String, AbstractColleague> colleagues = new Hashtable<String, AbstractColleague>();  
 
    //中介者可以动态地与某个同事建立联系  
    public void addColleague(String name, AbstractColleague c) {  
        this.colleagues.put(name, c);  
    }     
 
    //中介者也可以动态地撤销与某个同事的联系  
    public void deleteColleague(String name) {  
        this.colleagues.remove(name);  
    }  
 
    //中介者必须具备在同事之间处理逻辑、分配任务、促进交流的操作  
    public abstract void execute(String name, String method);   
}


//具体中介者  
package com.model.behaviour;
 
public class Mediator extends AbstractMediator{  
 
    //中介者最重要的功能，来回奔波与各个同事之间  
    public void execute(String name, String method) {  
 
        if("self".equals(method)){  //各自做好分内事  
            if("ColleagueA".equals(name)) {  
                ColleagueA colleague = (ColleagueA)super.colleagues.get("ColleagueA");  
                colleague.self();  
            }else {  
                ColleagueB colleague = (ColleagueB)super.colleagues.get("ColleagueB");  
                colleague.self();  
            }  
        }else { //与其他同事合作  
            if("ColleagueA".equals(name)) {  
                ColleagueA colleague = (ColleagueA)super.colleagues.get("ColleagueA");  
                colleague.out();  
            }else {  
                ColleagueB colleague = (ColleagueB)super.colleagues.get("ColleagueB");  
                colleague.out();  
            }  
        }  
    }  
}


//测试类  
package com.model.behaviour;
 
public class Client {  
    public static void main(String[] args) {  
 
        //创建一个中介者  
        AbstractMediator mediator = new Mediator();  
 
        //创建两个同事  
        ColleagueA colleagueA = new ColleagueA(mediator);  
        ColleagueB colleagueB = new ColleagueB(mediator);  
 
        //中介者分别与每个同事建立联系  
        mediator.addColleague("ColleagueA", colleagueA);  
        mediator.addColleague("ColleagueB", colleagueB);  
 
        //同事们开始工作  
        colleagueA.self();  
        colleagueA.out();  
        System.out.println("======================合作愉快，任务完成！\n");  
 
        colleagueB.self();  
        colleagueB.out();  
        System.out.println("======================合作愉快，任务完成！");  
    }  
}