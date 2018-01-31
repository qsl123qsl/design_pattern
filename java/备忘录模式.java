/*
* 备忘录模式  主要目的是保存一个对象的某个状态，以便在适当的时候恢复对象
*/

//假设有原始类A，A中有各种属性，A可以决定需要备份的属性，备忘录类B是用来存储A的一些内部状态，类C呢，就是一个用来存储备忘录的，且只能存储，不能修改等操作


//要备份的A
package com.model.behaviour;
 
public class Original {  
 
    private String value;  
 
    public String getValue() {  
        return value;  
    }  
 
    public void setValue(String value) {  
        this.value = value;  
    }  
 
    public Original(String value) {  
        this.value = value;  
    }  
 
    public Memento createMemento(){  
        return new Memento(value);  
    }  
 
    public void restoreMemento(Memento memento){  
        this.value = memento.getValue();  
    }  
}


//备忘录类B
package com.model.behaviour;
 
public class Memento {
 
    private String value;
 
    public Memento(String value) {
        this.value = value;
    }
 
    public String getValue() {
        return value;
    }
 
    public void setValue(String value) {
        this.value = value;
    }
}


//存储备忘录
package com.model.behaviour;
 
public class Storage {  
 
    private Memento memento;  
 
    public Storage(Memento memento) {  
        this.memento = memento;  
    }  
 
    public Memento getMemento() {  
        return memento;  
    }  
 
    public void setMemento(Memento memento) {  
        this.memento = memento;  
    }  
}


package com.model.behaviour;
 
public class Test {
 
    public static void main(String[] args) {
 
        // 创建原始类
        Original origi = new Original("egg");
 
        // 创建备忘录
        Storage storage = new Storage(origi.createMemento());
 
        // 修改原始类的状态
        System.out.println("初始化状态为：" + origi.getValue());
        origi.setValue("niu");
        System.out.println("修改后的状态为：" + origi.getValue());
 
        // 回复原始类的状态
        origi.restoreMemento(storage.getMemento());
        System.out.println("恢复后的状态为：" + origi.getValue());
    }
}