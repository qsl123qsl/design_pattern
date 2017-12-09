
/************-------------   创建对象的基本模式  ------------*************/
//使用：
//Book(usbn, title, author)
var theHobbit = new Book('0-395-07122-4', 'The Hobbit', 'J.R.R. Tolkien');
theHobbit.display();    //Outputs the data by creating and populating an HTML element
 
/*
 ----------------------门户大开型----------------------
 按传统方式创建一个类，用一个函数来做其构造器，我们称其为门户大开型对象
 它的所有属性和方法都是公开的，可访问的
 这些公用属性需要使用this关键字来创建
 缺点：
 无法保护内部数据
 */
var Book = function (isbn, title, author) {
    if (isbn === undefined) {
        throw new Error('Book constructor requires an isbn');
    }
    this.isbn = isbn;
    this.title = title || 'No title specified';
    this.author = author || 'No author specified';
};
 
Book.prototype.display = function () {
    //...
};
 
//这个类似乎符合一切，但其最大的问题是你无法检测ISBN数据的完整性
//对ISBN检查的强化
var Book = function (isbn, title, author) {
    ////检测ISBN，不符合则抛出错误
    if (!this.checkIsbn(isbn)) {
        throw new Error('Book:invalid ISBN');
    }
    this.isbn = isbn;
    this.title = title || 'No title specified';
    this.author = author || 'No author specified';
};
Book.prototype = {
    checkIsbn:function (isbn) {
        if (isbn === undefined || typeof isbn != 'string') {
            return false;
        }
        isbn = isbn.replace(/-/, '');  //Remove dashes
        //长度必须为10位或者13位
        if (isbn.length != 10 && isbn.length != 13) {
            return false;
        }
 
        var sum = 0;
        if (isbn.length === 10) {
            //10digit ISBN
            if (!isbn.match(/!\d{9}/)) {
                //Ensure characters 1 through 9 are digits
                return false;
            }
            for (var i = 0; i < 9; i++) {
                sum += isbn.charAt(i) * (10 - i);
            }
            var checksum = sum % 11;
            if (checksum === 10) {
                checksum = 'X';
            }
            if (isbn.charAt(9) != checksum) {
                return false;
            }
        } else {
            //13 digit ISBN
            if (!isbn.match(/^\d{12/)) {
                //Ensure chracters 1 through 12 are digits
                return false;
            }
 
            for (var i = 0; i < 12; i++) {
                sum += isbn.charAt(i) * ((i % 2 === 0) ? 1 : 3);
            }
            var checksum = sum % 10;
            if (isbn.charAt(12) != checksum) {
                return false;
            }
 
        }
        //all tests passed
        return truel
 
    },
    display:function () {
        //...
    }
};
 
//又出现了一个问题：当给实例化的Book对象直接用它修改其isbn属性
theHobbit.isbn = '978-0261103283';
theHobbit.display();
 
//使用取值器，赋值器有效地起到保护数据，但还是无法完全保护内部数据
var Publication = new Interface('Publication', ['getIsbn', 'setIsbn', 'setTitle', 'getAuthor', 'display']);
var Book = function (isbn, title, author) {
    //implements Publication
    this.setIsbn(isbn);
    this.setTitle(title);
    this.setAuthor(author);
};
Book.prototype = function= {
    checkIsbn:function (isbn) {
        //...
    },
    getIsbn:function () {
        return this.isbn;
    },
    setIsbn:function (isbm) {
        if (!this.checkisbn(isbn)) {
            throw new Error('Book:Invalid ISBN');
        }
        this.isbn = isbn
    },
    getTitle:function () {
        return this.title;
    },
    setTitle:function (title) {
        this.title = title || 'No title specified';
    },
    getAuthor:function () {
        return this.author;
    },
    display:function () {
        //...
    }
};
 
//-----------------------用命名规范区别私用成员----------------------
//在方法和属性名称前加下划线表示其私用性
 
/*------------------------作用域，嵌套函数和闭包------------------*/
function foo() {
    var a = 10;
 
    function bar() {
        a *= 2;
    }
 
    bar();
    return a;
}
console.log(foo());     //20
 
//外部调用
function foo() {
    var a = 10;
 
    function bar() {
        a *= 2;
        return 2;
    }
 
    return bar;
}
var bar = foo();      //bar is now a reference to function bar
bar();      //20
bar();      //40
bar();      //80
/*-----------------------------------*/
var blat = foo();     //blat is another reference to bar
blat();     //20,because a new copy of a is being used
 
/*
 js中的作用域是词法性的。函数是运行在定义它们的作用域中（本例中是foo内部的作用域），而不是运行在调用它们的作用域中。只要bar被定义在foo中，它就能访问在foo中定义的所有变量，即使foo的执行已经结束
 */
 
//---------------------------用闭包实现私用成员-----------------------------
var Book = function (newIsbn, newTitle, newAuthor) {
    //implements Publication
    //...
 
    //private attributes
    var isbn, title, author;
 
    //private method
    function checkIsbn(isbn) {
        //...
    }
 
    //privileged methods
    this.getIsbn = function () {
        return isbn;
    };
    this.setIsbn = function (newIsbn) {
        if (!checkIsbn(newIsbn)) {
            throw new Error('Book:invalid ISBN');
        }
        isbn = newIsbn;
    };
    this.getTitle = function () {
        return title;
    };
    this.setTitle = function (newTitle) {
        title = newTitle || 'No title specified';
    };
    this.getAuthor = function () {
        return author;
    };
    this.setAuthor = function (newAuthor) {
        author = newAuthor || 'No author specified'
    };
 
    //constructor code
    this.setIsbn(newIsbn);
    this.setTitle(newTitle);
    this.setAuthor(newAuthor);
};
 
//public , non-privileged methods
Book.prototype = {
    display:function () {
        //...
    }
};
/*
 任何不需要直接访问私用属性的方法都可以像原来那样在Book.prototype中声明。display()不需要直接访问任何私有属性，因为它可以通过调用特权方法来进行间接访问。只有那些需要直接访问私用成员的方法才应该被设计为特权方法。但特权方法太多又会占用过多内存，因为每个对象实例都包含了所有特权方法的新副本
 */
/*
 在门户大开型对象创建模式中，所有方法都创建在原型对象中，因此不管生成多少对象实例，这些方法在内存中只存在一份。而上面的做法，每生成一个新的对象实例都将为每一个私用方法和特权方法生成一个新的副本。这会比其他做法耗费更多内存，所以只宜用在需要真正的私用成员的场合。这种对象创建模式也不利于派生子类，因为所派生出的子类不能访问超类的任何私用属性或方法，又被称为继承破坏封装
 */
 
 
/*------------------ 更多高级对象创建模式 --------------------*/
//静态方法和属性
/*
 大多数方法和属性所关联的是类的实例，而静态成员所关联的则是类本身。换句话说，静态成员是在类的层次上操作，而不是在实例的层次上操作。
 */
var Book = (function () {
    //private static attributes
    var numOfBooks = 0;
 
    //private static method
    function checkIsbn(isbn) {
        //...
    }
 
    //return attributes
    return function (newIsbn, newTitle, newAuthor) {
        //implements Publication
        //...
        //private attribute
        var isbn, title, author;
 
        //privileged methods
        this.getIsbn = function () {
            return isbn;
        };
        this.setIsbn = function (newIsbn) {
            if (!checkIsbn(newIsbn)) {
                throw new Error('Book:invalid ISBN');
            }
            isbn = newIsbn;
        };
        this.getTitle = function () {
            return title;
        };
        this.setTitle = function (newTitle) {
            title = newTitle || 'No title specified';
        };
        this.getAuthor = function () {
            return author;
        };
        this.setAuthor = function (newAuthor) {
            author = newAuthor || 'No author specified';
        };
 
        //constructor code
        //keep track of how mang Books have been instantiated
        //with the private static attribute
        numOfBook++;
 
        if (numOfBooks > 50) {
            throw new Error('Book:only 50 instances of Book can be created');
        }
 
        this.setIsbn(newIsbn);
        this.setTitle(newTitle);
        this.setAuthor(newAuthor);
    }
 
})();
 
//public static method
Book.convertToTitleCase = function (inputString) {
    //...
};
 
//public, non-privileged methods
Book.prototype = {
    display:function () {
        //...
    }
};
 
/*
 Book成了一个构造函数，在实例化Book时，所调用的是这个内层函数。外层那个函数只是用于创建一个可以用来存放静态私用成员的闭包。
 ckeckIsbn被设计为静态方法，原因是为Book的每个实例都生成这个方法的一个新副本毫无道理。此外还有一个静态属性numOfBooks，其作用在于跟踪Book构造器的总调用次数。
 这些私用的静态成员可以从构造器内部访问，这意味着所有饲用函数和特权函数都能访问它们。与其他方式比，它们在内存中只会存放一份。因为那些静态方法被声明在构造器之外，所以它们不是特权方法，不能访问任何定义在构造其中的私用属性。定义在构造器中的私用方法能够调用那些私用静态方法。
 要判断一个私用方法是否应该被设计为静态方法，看它是否需要访问任何实例数据。如果不需要，那么将其设计为静态方法会更有效率。
 创建公用的静态成员只需直接将其作为构造函数这个对象的属性创建即可，相当于把构造器作为命名空间来使用。
 公用静态方法用于与类这个整体相关的任务，而不是与类的任一特定实例相关的任务。它们并不直接依赖于对象实例中包含的任何数据。
 */
 
 
/*---------------- 常量 --------------------*/
/*
 在js中，可以通过创建只有取值器而没有赋值器的私用变量来模仿常量。
 */
// 例子：调用常量的方法
Class.getUPPER_BOUND();
//Class类,为了实现这个取值器，需要使用特权静态方法
var Class = (function () {
    // Constants (created as private static attributes)
    var UPPER_BOUND = 100;
    // constructor
    var ctor = function (constructorArgument) {
        //...
    };
    //privileged static method
    ctor.getUPPER_BOUND = function () {
        return UPPER_BOUND;
    };
    //...
    //return the constructor
    return ctor;
})();
 
//如果需要使用许多常量，可以创建一个通用的取值器
var Class = (function () {
    //private static attributes
    var constants = {
        UPPER_BOUND:100,
        LOWER_BOUND:-100
    };
    //constructoe
    var ctor = function (constructorAgument) {
        //...
    };
    //privileged static method
    ctor.getConstant = function (name) {
        return constants[name];
    };
    //...
    //return the constructor
    return ctor;
})();
 
Class.getConstant('UPPER_BOUND');
 
 
//单体与对象工厂
//略
 
/*
封装之利
保护内部数据的完整性
对象的重构变得轻松
通过只公开那些在接口中规定的方法，可以弱化模块间的耦合
 */
/*
封装之弊
私用方法很难进行单元测试
存在复杂的作用域链
过度封装会损坏类的灵活性
 */
