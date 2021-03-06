<!DOCTYPE html>
<html>
<head>
    <title>代理模式</title>
    <meta charset="utf-8">
</head>
<body>
<script>
/**
 * 代理模式
 *
 * 定义：
 * 为其他对象提供一种代理以控制对这个对象的访问。
 *
 * 本质：
 * 控制对象访问
 *
 * 代理（proxy）是一个对象，它可以用来控制对另一对象的访问。它与另外那个对象实现了同样的接口，并且会把任何方法调用传递给那个对象。另外那个对象通常称为本体（real subject）。代理可以代替其本体被实例化，并使其可被远程访问。它还可以把本体的实例化推迟到真正需要的时候，对于实例化比较费时的本体，或者因尺寸较大以至于不用时不宜保存在内存中的本体。这特别有用。在处理那些需要较长时间才能把数据载入用户界面的类时，代理也大有好处。
 */
 
/*
 代理的结构
 
 代理模式最基本的形式是对访问进行控制。代理对象和另一个对象（本体）实现的是同样的接口。实际上工作还是本体在做。它才是负责执行所分派的任务的那个对象或类。代理对象所做的不外乎节制对本体的访问。要注意，代理对象并不会在另一对象的基础上添加方法或修改其方法（就像装饰者那样），也不会简化那个对象的接口（就像门面元素那样）。它实现的接口与本体完全相同，所有对它进行的方法调用都会被传递给本体。
 */
 
(function(){
    // 示例代码
     
    // 目标对象，是真正被代理的对象
    function Subject(){}
    Subject.prototype.request = function(){};
 
    /**
     * 代理对象
     * @param {Object} realSubject [持有被代理的具体的目标对象]
     */
    function Proxy(realSubject){
        this.realSubject = readSubject;
    }
    Proxy.prototype.request = function(){
        this.realSubject.request();
    };
}());
 
 
/*
 代理如何控制对本体的访问
 
 那种根本不实现任何访问控制的代理最简单。它所做的只是把所有方法调用传递到本体。这种代理毫无用处，但它也提供一个进一步发展的基础。
 在下面的例子中，我们将创建一个代表图书馆的类。该类封装了一个Book对象
 */
var Publication = new Interface('Publication', ['getIsbn', 'setIsbn', 'getTitle', 'setTitle', 'getAuthor', 'display']);
var Book = function (isbn, title, author) {
    // implements Publication
};
// Library interface
var Library = new Interface('Library', ['findBooks', 'checkoutBook', 'returnBook']);
// PublicLibrary class
var PublicLibrary = function (books) {
    // implements Library
    this.catalog = {};
    for (var i = 0, len = books.length; i < len; i++) {
        this.catalog[books[i].getIsbn()] = {
            book: books[i],
            available: true
        };
    }
};
PublicLibrary.prototype = {
    findBooks: function (searchString) {
        var results = [];
        for (var isbn in this.catalog) {
            if (!this.catalog.hasOwnProperty(isbn)) {
                continue;
            }
            if (searchString.match(this.catalog[isbn].getTitle()) || searchString.match(this.catalog[isbn].getAnchor())) {
                results.push(this.catalog[isbn]);
            }
        }
        return results;
    },
    checkoutBook: function (book) {
        var isbn = book.getIsbn();
        if (this.catalog[isbn]) {
            if (this.catalog[isbn].available) {
                this.catalog[isbn].available = false;
                return this.catalog[isbn];
            } else {
                throw new Error('PublicLibrary:book ' + book.getTitle() + ' is not currently available.');
            }
        } else {
            throw new Error('PublicLibrary:book ' + book.getTitle() + ' not found');
        }
    },
    returnBook: function (book) {
        var isbn = book.getIsbn();
        if (this.catalog[isbn]) {
            this.catalog[isbn].available = true;
        } else {
            throw new Error('PublicLibrary:book ' + book.getTitle() + ' nout found');
        }
    }
};
 
/*
 这个类非常简单。它可以用来查书，借书和还书。下面是一个没有实现任何访问控制的PublicLibrary类的代理：
 */
// PublicLibraryProxy class, a useless proxy
var PublicLibraryProxy = function (catalog) {
    // implements Library
    this.library = new PublicLibrary(catalog);
};
PublicLibraryProxy.prototype = {
    findBooks: function (searchString) {
        return this.library.findBooks(searchString);
    },
    checkoutBook: function (book) {
        return this.library.checkoutBook(book);
    },
    returnBook: function (book) {
        return this.library.returnBook(book);
    }
};
 
/*
 这种类型的代理没有什么好处。在各种类型的代理中，虚拟代理（virtual proxy）是最有用的类型之一。虚拟代理用于控制对那种创建开销很大的本体的访问。它会把本体的实例化推迟到有方法被调用的时候。有时还会提供关于实例化状态的反馈。它还可以在本体被夹在之前办延其替身的角色。作为一个例子，假设PublicLibrary的实例化很慢。不能在网页加载的时候立即完成。我们可以为其创建一个虚拟代理，让它把PublicLibrary的实例化推迟到必要的时候。
 */
// PublicLibarryVirtualProxy class
var PublicLibraryVirtualProxy = function (catalog) {
    this.library = null;
    this.catalog = catalog;
};
PublicLibraryVirtualProxy.prototype = {
    _initializeLibrary: function () {
        if (this.library === null) {
            this.library = new PublicLibrary(this.catalog);
        }
    },
    findBooksL: function (searchString) {
        this._initializeLibrary();
        return this.library.findBooks(searchString);
    },
    checkoutBook: function (book) {
        this._initializeLibrary();
        return this.library.checkoutBook(book);
    },
    returnBook: function (book) {
        this._initializeLibrary();
        return this.library.returnBook(book);
    }
};
 
/*
 PublicLibraryProxy和PublicLibraryVirtualProxy之间的关键区别在于后者不会立即创建PublicLibrary的实例。PublicLibraryVirtualProxy会把构造函数的参数保存起来，直到有方法被调用时才真正执行本体的实例化。这样一来，如果图书馆对象一直未被用到，那么它就不会被创建出来。虚拟代理通常具有某种能触发本体的实例化的事件。在本例中，方法调用就是触发因素。
 */
 
/*
 虚拟代理，远程代理和保护代理
 
 对于JS来说，虚拟代理可能是最有用的代理类型。
 远程代理（remote proxy）用于访问位于另一个环境中的对象。在Java中，这意味着另一个虚拟机中的对象，或者是地球另一端的某台计算机中的对象。远程对象一般都长期存在，任何时候都可以从任何其他环境中进行访问。这种类型的代理很难照搬到JS中。通常JS运行时环境不可能长期存在。在JS中无法建立到另一个运行时环境的套接字连接以访问其变量空间，即便它能长期存在。与此最接近的做法就是JSON对方法调用进行序列化，然后用Ajax技术将结果发送给某个资源。
 远程代理的一种更有可能的用途是控制对其他语言中的本体的访问。这种本体可能是一个Web服务资源，也可能是一个PHP对象。在此情况下，很难说你所用的是什么模式。它既可以被视为适配器，也可以被视为远程代理。
 
 保护代理也不同意照搬到JS中。在其他语言中，它通常用来根据客户的身份控制对特定方法的访问。假设要为PublicLibrary类添加一些用来添加或删除目录中的书的方法。在Java中你会用一个保护代理来限制对这些方法的访问，它只允许某些类型的客户（比如图书管理员）调用这些方法，而其他类型的客户则没有这样的权利。但在JS中，你无法判断调用方法的客户的类型。
 */
 
/*
 代理模式与装饰者模式的比较
 
 戴利在许多方面都很像装饰者。装饰者和虚拟代理都要对其他对象进行包装，都要实现与被包装对象相同的接口，而且都要把方法调用传递给被包装对象。
 最大的区别在于装饰者会对被包装对象的功能进行修改或扩充，而代理只不过是控制对它的访问。除了有时可能会添加一些控制代码之外，代理并不会对传递给本体的方法调用进行修改。而装饰着就是为修改方法而生的。另一个区别表现在被包装对象的创建方式上。在装饰者模式中，被包装对象的实例化过程是完全独立的。这个对象创建出来之后，你可以随意为其裹上一个或更多装饰者。而在代理模式中，被包装对象的实例化是代理的实例化过程的一部分。在某些类型的虚拟代理中，这种实例化受到严格控制，它必须在代理内部进行。此外，代理不会像装饰者那样互相包装，它们一次只使用一个。
 */
 
/*
 代理模式的适用场合
 
 虚拟代理是一个对象，用于控制对一个创建开销昂贵的资源的访问。虚拟代理是一种优化模式。如果有些类或对象需要使用大量内存保存其数据。而你并不需要在实例化完成之后立即访问这些数据，或者，其构造函数需要进行大量计算那就应该使用虚拟代理将设置开销的产生推迟到真正需要使用数据的时候。代理还可以在设置的进行过程中提供类似于“正在加载。。。”这样的消息，这可以形成一个反应积极的用户界面，以免让用户面对一个没有任何反馈的空白页面。
 远程代理则没有这样清楚的用例。如果需要访问某种远程资源的话，那么最好是用一个类或对象来包装它，而不是一遍又一遍地手工设置XMLHttpRequest对象。问题在于应该用什么类型的对象来包装这个资源呢？这主要是个命名问题。如果包装对象实现了远程资源的所有方法，那它就是一个远程代理。如果它会在运行期间增添一些方法，那它就是一个装饰者。如果它简化了该远程资源（或多个远程资源）的接口，那它就是一个门面。远程代理是一种结构型模式，它提供了一个访问位于其他环境中的资源的原生JS API。
 总而言之，如果有些类或对象的创建开销较大，而且不需要在实例化完成后立即访问其数据，那么应该使用虚拟代理。如果你有某种远程资源，并且要为该资源提供的所有功能实现对应的方法，那么应该使用远程代理。
 */
 
var SimpleHandler = function () {
};     // implements AjaxHandler
SimpleHandler.prototype = {
    request: function (method, url, callback, postVars) {
        var xhr = this.createXhrObject();
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) {
                return;
            }
            ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) ?
                    callback.success(xhr.responseText, xhr.responseXML) :
                    callback.failure(xhr.status);
        };
        xhr.open(method, url, true);
        if (method !== 'POST') {
            postVars = null;
        }
        xhr.send(postVars);
    },
    createXhrObject: function () {      // Factory method
        var methods = [
            function () {
                return new XMLHttpRequest();
            },
            function () {
                return new ActiveXObject('Msxml2.XMLHTTP');
            },
            function () {
                return new ActiveXObject('Microsoft.XMLHTTP');
            }
        ];
 
        for (var i = 0, len = methods.length; i < len; i++) {
            try {
                methods[i]();
            } catch (e) {
                continue;
            }
            // if we reach this point,method[i] worked
            this.createXhrObject = methods[i]();    // Memoize the method
            return methods[i]();
        }
 
        // if we reach this point,none of the methods worked
        throw new Error('SimpleHandler:Could not create an XHR object.');
    }
};
 
// Manually making the calls
var xhrHandler = new SimpleHandler();
 
// Get he pageview statistics
var callback = {
    success: function (responseText) {
        // Parse the JSON data
        var stats = eval('(' + responseText + ')');
        // Display the stats on the page
        displayPageviews(stats);
    },
    failure: function (statusCode) {
        throw new Error('Asynchronous request for stats failed.');
    }
};
xhrHandler.request('GET', '/stats/getPageviews/?page=index.html', callback);
 
// Get the browser statistics
var callback2 = {
    success: function (responseText) {
        var stats = eval('(' + responseText + ')');
        displayBrowserShare('Asynchronous request for stats failed');
    }
};
xhrHandler.request('GET', '/stats/getBrowserShare/?page=index.html', callback);
 
 
// 优化版本：
// PgeStats interface
var PageStats = new Interface('PageStats', ['getPageviews', 'getUniques', 'getBrowserShare', 'getTopSearchTerms', 'getMostVisitedPages']);
 
// 定义远程代理StatsProxy：
// StatsProxy singleton
var StatsProxy = (function () {
    // Private attributes
    var xhrHandler = new SimpleHandler();
    var urls = {
        pageviews: '/stats/getPageviews/',
        uniques: '/stats/getUniques/',
        browserShare: '/stats/getBrowserShare/',
        topSearchTerms: '/stats/getTopSearchTerms/',
        mostVisitedPages: '/stats/getMostVisitedPages/'
    };
 
    // Private methods
    function xhrFailure() {
        throw new Error('StatsProxy: Asynchronous request for stats failed.');
    }
 
    function fetchData(url, dataCallback, startDate, endDate, page) {
        var callback = {
            success: function (responseText) {
                var stats = eval('(' + responseText + ')');
                dataCallback(stats);
            },
            failure: xhrFailure
        };
 
        var getVars = [];
        if (startDate !== undefined) {
            getVars.push('startDate=' + encodeURIComponent(startDate));
        }
        if (endDate !== undefined) {
            getVars.push('endDate=' + encodeURIComponent(endDate));
        }
        if (page !== undefined) {
            getVars.push('page=' + page);
        }
 
        if (getVars.length > 0) {
            url = url + '?' + getVars.join('&');
        }
 
        xhrHandler.request('GET', url, callback);
    }
 
    // Public methods
    return {
        getPageviews: function (callback, startDate, endDate, page) {
            fetchData(urls.pageviews, callback, startDate, endDate, page);
        },
        getUniques: function (callback, startDate, endDate, page) {
            fetchData(urls.uniques, callback, startDate, endDate, page);
        },
        getBrowserShare: function (callback, startDate, endDate, page) {
            fetchData(urls.browserShare, callback, startDate, endDate, page);
        },
        getTopSearchTerms: function (callback, startDate, endDate, page) {
            fetchData(urls.topSearchTerms, callback, startDate, endDate, page);
        },
        getMostVisitedPages: function (callback, startDate, endDate, page) {
            fetchData(urls.mostVisitedPages, callback, startDate, endDate, page);
        }
    };
}());
/*
 现在实现代码与Web服务的耦合变得更松散，而重复性代码也大大减少了。对待StatsProxy对象与对待别的JS对象没什么两样，你可以随意用它进行查询。不过，这的确暴露了这种方法的一个弊端。远程代理，根据其定义，应该能掩盖数据的实际来源，即使你可以将其视为本地资源，它实际上还是要对服务器进行访问，根据用户的连接速度，这种访问耗费的时间少则几毫秒，多则几秒。在设计远程代理时，注明一下这种性能问题很有必要。在本例中这个问题可以通过借助回调函数进行异步调用稍加缓解，这样程序的执行就不会因为要等待调用结果而被阻塞。但是回调函数的存在多少暴露了一些下层的视线细节，因为如果不与外部服务通信的话是不需要使用回调函数的。
 */
 
 
/*
 包装Web服务的通用模式
 
 我们可以从上面的例子中提炼出一个更加通用的Web服务包装模式。犹豫JS的同源性限制，Web服务代理所包装的服务必须部署在使用代理的网页所在的域中。这里使用一个构造函数的普通类，以便以后进行扩展。
 */
// WebserviceProxy class
var WebserviceProxy = function () {
    this.xhrHandler = new SimpleHandler();
};
WebserviceProxy.prototype = {
    _xhrFailure: function (statusCode) {
        throw new Error('StatsProxy:Asynchronous request for stats failed.');
    },
    _fetchData: function (url, dataCallback, getVars) {
        var that = this;
        var callback = {
            success: function (responseText) {
                var obj = eval('(' + responseText + ')');
                dataCallback(obj);
            },
            failure: that._xhrFailure
        };
 
        var getVarArray = [];
        for (var varName in getVars) {
            getVarArray.push(varName + '=' + getVars[varName]);
        }
        if (getVarArray.length > 0) {
            url = url + '?' + getVarArray.join('&');
        }
 
        this.xhrHandler.request('GET', url, callback);
    }
};
/*
 使用这个通用模式时，只需从WebserviceProxy派生一个子类，然后借助_fetchData方法实现需要的方法即可：
 */
// StatsProxy class
// StatsProxy class
var StatsProxy = function () {
    StatsProxy.superclass.constructor.call(this);
};
function extend(subClass, superClass) {
    var F = function () {
    };
    F.prototype = superClass.prototype;
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;
 
    subClass.superclass = superClass.prototype;
    if (superClass.prototype.constructor === Object.prototype.constructor) {
        superClass.prototype.constructor = superClass;
    }
}
extend(StatsProxy, WebserviceProxy);
 
StatsProxy.prototype.getPageviews = function (callback, startDate, endDate, page) {
    this._fetchData('test.json', callback, {
        'startDate': startDate,
        'endDate': endDate,
        'page': page
    });
};
StatsProxy.prototype.getUniques = function (callback, startDate, endDate, page) {
    this._fetchData('/stats/getsUniques/', callback, {
        'startDate': startDate,
        'endDate': endDate,
        'page': page
    });
};
 
 
/*
 这次的任务是为公司网站的主页添加一个可搜索的员工目录。它应该模仿时间的员工花名册中的页面。从A开始，显示其姓氏以特定字母开头的所有员工。由于这个网页的访问量很大，所以这个解决方案必须尽量节约宽带。
 因为在这个问题中网页的大小很重要，所以我们决定只为那些需要查看员工资料的用户加载这种数据。这样一来，那些不关心这种信息的用户就不用下载额外的数据。这是虚拟代理可以大显身手的地方，因为它能够把需要占用大量带宽的资源的加载推迟到必要的时候。我们还打算在家在员工目录的过程中向用户提供一些提示信息，以免他们盯着一个空白屏幕。
 */
/*
 首先要做的是创建代理的那个本体类。它负责获取员工数据并声称用于在网页上显示这些数据的HTML内容，其显示格式类似于电话号码簿：
 */
// Directory interface
var Directory = new Interface('Directory', ['showPage']);
 
// PersonnelDirectory class, the Real Subject
var PersonnelDirectory = function (parent) {
    this.xhrHandler = new SimpleHandler();
    this.parent = parent;
    this.data = null;
    this.currentPage = null;
 
    var that = this;
    var callback = {
        success: that._configure,
        failure: function () {
            throw new Error('PersonnelDirectory: failure in data retrieval.');
        }
    };
    xhrHandler.request('GET', 'directoryData.php', callback);
};
PersonnelDirectory.prototype = {
    _configure: function (responseText) {
        this.data = eval('(' + responseText + ')');
        //...
        this.currentPage = 'a';
    },
    showPage: function (page) {
        $('page-' + this.currentPage).style.display = 'none';
        $('page-' + page).style.display = 'block';
        this.currentPage = page;
    }
};
 
/*
 该类的构造函数会发出一个XHR请求以获取员工数据。其——configure方法会在数据返回的时候被调用，它会生成HTML元素并向其中填入数据。该类实现了一个目录应有的所有功能。这个类的实例化过程中会加载大量数据、代理的作用就是推迟这个实例化过程。
 */
 
// 下面先勾勒出虚拟代理类的大体轮廓，它包含了该类需要的所有方法。
// 本例中需要实现的只有showPage方法和构造函数
// DirectoryProxy class, just the outline
var DirectoryProxy = function (parent) {
};
DirectoryProxy.prototype = {
    showPage: function (page) {
    }
};
 
// 下一步是先将这个类实现为一个无用的代理，它的每个方法所做的
// 只是调用本体的同名方法：
// DirectoryProxy class, as a useless proxy
var DirectoryProxy = function (parent) {
    this.directory = new PersonnelDirectory(parent);
};
DirectoryProxy.prototype = {
    showPage: function (page) {
        return this.directory.showPage(page);
    }
};
 
/*
 现在这个代理可以代替PersonnelDirectory的实例使用。它们可以透明地互换。不过，在此情况下你丝毫没有享受到虚拟代理的好处。要想发挥虚拟代理的作用，需要创建一个用来实例化本体的方法，并注册一个用来触发这个实例化过程的事件侦听器
 */
// DirectoryProxy class, as a virtual proxy
var DirectoryProxy = function (parent) {
    this.parent = parent;
    this.directory = null;
    var that = this;
    addEvent(parent, 'mouseover', function () {
        that._initialize();
    });
};
DirectoryProxy.prototype = {
    _initialize: function () {
        this.directory = new PersonnelDirectory(this.parent);
    },
    showPage: function (page) {
        return this.directory.showPage(page);
    }
};
/*
 在本例中，一旦用户把鼠标指针移到目录的父容器上方，本体就会被实例化。在更复杂的解决方案中，可以先为目录生成一个空白的用户界面，一旦某个表单域处于焦点之下，它就会被初始化后的本体透明地取代。
 这个例子已经接近于完工。剩下的任务只有一件，那就是提示用户当前正在加载员工目录，并且在本体创建完毕之前阻止任何方法调用：
 */
// DirectoryProxy class, with loading message
var DirectoryProxy = function (parent) {
    this.parent = parent;
    this.directory = null;
    this.warning = null;
    this.interval = null;
    this.initialized = false;
    var that = this;
    addEvent(parent, 'mouseover', function () {
        that._initialize();
    });
};
DirectoryProxy.prototype = {
    _initialize: function () {
        this.warning = document.createElement('div');
        this.parent.appendChild(this.warning);
        this.warning.innerHTML = 'The company directory is loading...';
 
        this.directory = new PersonnelDirectory(this.parent);
        var that = this;
        this.interval = setInterval(function () {
            that._checkInitialization();
        }, 100);
    },
    _checkInitialization: function () {
        if (this.directory.currentPage !== null) {
            clearInterval(this.interval);
            this.initialized = true;
            this.parent.removeChild(this.warning);
        }
    },
    showPage: function (page) {
        if (!this.initialized) {
            return;
        }
        return this.directory.showPage(page);
    }
};
/*
 阻止对showPage的调用很容易，只需要检查一下initialized属性，仅当其值为true的时候才允许通用本体的这个方法。相比之下，在对象的加载过程中显示一条提示信息则要麻烦一点。怎样才能知道那个类什么事后加载完毕呢？可以考虑在本体类中定义一个自定义事件，然后让代理订阅这个事件，不过在本例中我们选择了一种比较简单的技术。因为PersonnelDirectory实例的currentPage属性只有在数据加载完毕之后才会被设置，所以我们每隔100毫秒检查一次这个属性，直到发现它已经被设置了为止。此时即可清除加载提示并将代理标记为已初始化。
 */
 
 
/**
 * 创建虚拟代理的通用模式
 *
 * 得益于JS的灵活性，你可以创建一个动态虚拟代理，它会检查提供给它的类的接口，创建自己的对应方法，并且将该类的实例化推迟到某些预订条件得到满足的时候。作为第一步，下面先创建这个动态代理类的壳体以及_initialize和_checkInitialization这两个方法。这是一个抽象类，需要派生子类并进行一些配置才能正常工作。
 */
// DynamicProxy abstract class, incomplete
var DynamicProxy = function () {
    this.args = arguments;
    this.initialized = false;
};
DynamicProxy.prototype = {
    _initialize: function () {
        // Instantiate the class
        /*
         this.subject = {};
         this.class1.apply(this.subject, this.args);
         this.subject.__proto__ = this.class1.prototype;
         */
        this.subject = new this.class1(this.args);
 
        var that = this;
        this.interval = setInterval(function () {
            that._checkInitialization();
        }, 100);
    },
    _checkInitialization: function () {
        if (this._isInitialized()) {
            clearInterval(this.interval);
            this.initialized = true;
        }
    },
    _isInitialized: function () {
        throw new Error('Unsupported operation on an abstract class.');
    }
};
 
// 改进版
// DynamicProxy abstract class, complete
var DynamicProxy = function () {
    this.args = arguments;
    this.initialized = false;
 
    if (typeof this.class1 !== 'function') {
        throw new Error('DynamicProxy: tha class attribute must be set before calling the super-class constructor.');
    }
 
    // Create the methods needed to implement the same interface.
    for (var key in this.class1.prototype) {
        // Ensure that the property is a function
        if (this.class1.prototype.hasOwnProperty(key)) {
            if (typeof this.class1.prototype[key] !== 'function') {
                continue;
            }
 
            // Add the method
            var that = this;
            (function (methodName) {
                that[methodName] = function () {
                    if (!that.initialized) {
                        return;
                    }
                    return that.subject[methodName].apply(that.subject, arguments);
                };
            }(key));
        }
    }
};
DynamicProxy.prototype = {
    _initialize: function () {
        // Instantiate the class
        /*
         this.subject = {};
         this.class1.apply(this.subject, this.args);
         this.subject.__proto__ = this.class1.prototype;
         */
        this.subject = new this.class1(this.args);
 
        var that = this;
        this.interval = setInterval(function () {
            that._checkInitialization();
        }, 100);
    },
    _checkInitialization: function () {
        if (this._isInitialized()) {
            clearInterval(this.interval);
            this.initialized = true;
        }
    },
    _isInitialized: function () {
        throw new Error('Unsupported operation on an abstract class.');
    }
};
/*
最重要的区别在于，这里是对本体类的prototype中的方法进行逐一检查，而不是对本体对象本身进行检查。这是因为此时本体还未被实例化，自然还不存在本体对象，因此在决定需要实现一些什么方法时检查的是本体类而不是本体对象。在这个过程中所添加的每一个方法都由两部分组成，限制性的是一个检查，其目的在于确保本体已经初始化，随后是对本体中同名方法的调用。
 
要使用这个类，必须先从它派生子类：
 */
 
// TestProxy class
var TestClass = function () {
    console.log('start');
};
TestClass.prototype = {
    f1: function () {
        console.log(1);
    },
    f2: function () {
        console.log(2);
    }
};
var TestProxy = function () {
    this.class1 = TestClass;
    var that = this;
    addEvent($('test-link'), 'click', function () {
        that._initialize();
        that.f1();
    });
    TestProxy.superclass.constructor.apply(this, arguments);
};
extend(TestProxy, DynamicProxy);
TestProxy.prototype._isInitialized = function () {
    //...
    // Initialization condition goes here
    if (!this.initialized) {
        for (var i = 0, s = ''; i < 10; i++) {
            s += '<li>' + i + '</li>';
        }
        document.getElementById('content').innerHTML += '<ul>' + s + '</ul>';
        return true;
    }
    return false;
};
 
var p = new TestProxy();
 
/*
在子类中必须做的事有4件；将this.class设置为本体类；创建某种实例化触发器（本例的设计是在点击一个链接时进行实例化）；调用超类的构造函数；实现_isInitialized方法（它应该根据本体是否已初始化返回true或false）
 */
 
/**
 *代理模式之利
 *
 * 虚拟代理可以用来把大对象的实例化推迟到其他元素加载完毕之后。如果虚拟代理包装的资源没有被用到，那么它根本就不会被加载。虚拟代理的主要好处就在于，你可以用它代替其主体，而不用操心实例化开销的问题。
 *
 * 代理模式之弊
 *
 * 代理可以掩盖了大量复杂行为，这会带来不必要的复杂性和代码。因为代理与其本体完全可以互换。在为创建一个代理费心劳力之前，请确保你确实需要它提供的特性。且它能降低你的代码的亢余程度，提高其模块化程度或运行效率
 */
 
/* Title: Proxy
 Description: provides a placeholder for another object to control access, reduce cost, and reduce complexity
 */
 
var $ = function (id) {
    return document.getElementById(id);
};
 
var http = {
    makeRequest:function (ids, callback) {
        var url = 'http://query.yahooapis.com/v1/public/yql?q=',
                sql = 'select * from music.video.id where ids IN ("%ID%")',
                format = "format=json",
                handler = "callback=" + callback,
                script = document.createElement('script');
 
        sql = sql.replace('%ID%', ids.join('","'));
        sql = encodeURIComponent(sql);
 
        url += sql + '&' + format + '&' + handler;
        script.src = url;
 
        document.body.appendChild(script);
    }
};
 
var proxy = {
    ids:[],
    delay:50,
    timeout:null,
    callback:null,
    context:null,
    makeRequest:function (id, callback, context) {
 
        // add to the queue
        this.ids.push(id);
 
        this.callback = callback;
        this.context = context;
 
        // set up timeout
        if (!this.timeout) {
            this.timeout = setTimeout(function () {
                proxy.flush();
            }, this.delay);
        }
    },
    flush:function () {
        http.makeRequest(this.ids, 'proxy.handler');
        // clear timeout and queue
        this.timeout = null;
        this.ids = [];
 
    },
    handler:function (data) {
        var i, max;
 
        // single video
        if (parseInt(data.query.count, 10) === 1) {
            proxy.callback.call(proxy.context, data.query.results.Video);
            return;
        }
 
        // multiple videos
        for (i = 0, max = data.query.results.Video.length; i < max; i += 1) {
            proxy.callback.call(proxy.context, data.query.results.Video[i]);
        }
    }
};
 
 
var videos = {
    getPlayer:function (id) {
        return '' +
                '<object width="400" height="255" id="uvp_fop" allowFullScreen="true">' +
                '<param name="movie" value="http://d.yimg.com/m/up/fop/embedflv/swf/fop.swf"\/>' +
                '<param name="flashVars" value="id=v' + id + '&eID=1301797&lang=us&enableFullScreen=0&shareEnable=1"\/>' +
                '<param name="wmode" value="transparent"\/>' +
                '<embed ' +
                'height="255" ' +
                'width="400" ' +
                'id="uvp_fop" ' +
                'allowFullScreen="true" ' +
                'src="http://d.yimg.com/m/up/fop/embedflv/swf/fop.swf" ' +
                'type="application/x-shockwave-flash" ' +
                'flashvars="id=v' + id + '&eID=1301797&lang=us&ympsc=4195329&enableFullScreen=1&shareEnable=1"' +
                '\/>' +
                '<\/object>';
    },
 
    updateList:function (data) {
        var id,
                html = '',
                info;
 
        if (data.query) {
            data = data.query.results.Video;
        }
        id = data.id;
        html += '<img src="' + data.Image[0].url + '" width="50" \/>';
        html += '<h2>' + data.title + '<\/h2>';
        html += '<p>' + data.copyrightYear + ', ' + data.label + '<\/p>';
        if (data.Album) {
            html += '<p>Album: ' + data.Album.Release.title + ', ' + data.Album.Release.releaseYear + '<br \/>';
        }
        html += '<p><a class="play" href="http://new.music.yahoo.com/videos/--' + id + '">» play<\/a><\/p>';
        info = document.createElement('div');
        info.id = "info" + id;
        info.innerHTML = html;
        $('v' + id).appendChild(info);
    },
 
    getInfo:function (id) {
        var info = $('info' + id);
 
        if (!info) {
            proxy.makeRequest(id, videos.updateList, videos);
            return;
        }
 
        if (info.style.display === "none") {
            info.style.display = '';
        } else {
            info.style.display = 'none';
        }
    }
};
 
 
$('vids').onclick = function (e) {
    var src, id;
 
    e = e || window.event;
    src = e.target || e.srcElement;
 
    if (src.nodeName.toUpperCase() !== "A") {
        return;
    }
 
    if (typeof e.preventDefault === "function") {
        e.preventDefault();
    }
    e.returnValue = false;
 
    id = src.href.split('--')[1];
 
    if (src.className === "play") {
        src.parentNode.innerHTML = videos.getPlayer(id);
        return;
    }
 
    src.parentNode.id = "v" + id;
    videos.getInfo(id);
};
 
$('toggle-all').onclick = function (e) {
 
    var hrefs,
            i,
            max,
            id;
 
    hrefs = $('vids').getElementsByTagName('a');
    for (i = 0, max = hrefs.length; i < max; i += 1) {
        // skip play links
        if (hrefs[i].className === "play") {
            continue;
        }
        // skip unchecked
        if (!hrefs[i].parentNode.firstChild.checked) {
            continue;
        }
 
        id = hrefs[i].href.split('--')[1];
        hrefs[i].parentNode.id = "v" + id;
        videos.getInfo(id);
    }
};
 
 
// http://www.dofactory.com/javascript-proxy-pattern.aspx
 
function GeoCoder() {
    this.getLatLng = function(address) {
         
        if (address === "Amsterdam") {
            return "52.3700° N, 4.8900° E";
        } else if (address === "London") {
            return "51.5171° N, 0.1062° W";
        } else if (address === "Paris") {
            return "48.8742° N, 2.3470° E";
        } else if (address === "Berlin") {
            return "52.5233° N, 13.4127° E";
        } else {
            return "";
        }
    };
}
 
function GeoProxy() {
    var geocoder = new GeoCoder();
    var geocache = {};
 
    return {
        getLatLng: function(address) {
            if (!geocache[address]) {
                geocache[address] = geocoder.getLatLng(address);
            }
 
            log.add(address + ": " + geocache[address]);
            return geocache[address];
        },
        getCount: function() {
            var count = 0;
            for (var code in geocache) { count++; }
            return count;
        }
    };
};
 
// log helper
var log = (function() {
    var log = "";
    return {
        add: function(msg) { log += msg + "\n"; },
        show: function() { alert(log); log = ""; }
    }
})();
 
 
function run() {
 
    var geo = new GeoProxy();
 
    // geolocation requests
    geo.getLatLng("Paris");
    geo.getLatLng("London");
    geo.getLatLng("London");
    geo.getLatLng("London");
    geo.getLatLng("London");
    geo.getLatLng("Amsterdam");
    geo.getLatLng("Amsterdam");
    geo.getLatLng("Amsterdam");
    geo.getLatLng("Amsterdam");
    geo.getLatLng("London");
    geo.getLatLng("London");
 
    log.add("\nCache size: " + geo.getCount());
    log.show();
}
 
</script>
</body>
</html>
