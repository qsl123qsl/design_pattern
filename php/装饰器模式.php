<?php
/*
*装饰器模式允许我们根据运行时不同的情景动态地为某个对象调用前后添加不同的行为动作。
*/
class HtmlTemplate {
    // any parent class methods
}
 
class Template1 extends HtmlTemplate {
    protected $_html;
     
    public function __construct() {
        $this->_html = "<p>__text__</p>";
    }
     
    public function set($html) {
        $this->_html = $html;
    }
     
    public function render() {
        echo $this->_html;
    }
}
 
class Template2 extends HtmlTemplate {
    protected $_element;
     
    public function __construct($s) {
        $this->_element = $s;
        $this->set("<h2>" . $this->_html . "</h2>");
    }
     
    public function __call($name, $args) {
        $this->_element->$name($args[0]);
    }
}
 
class Template3 extends HtmlTemplate {
    protected $_element;
     
    public function __construct($s) {
        $this->_element = $s;
        $this->set("<u>" . $this->_html . "</u>");
    }
     
    public function __call($name, $args) {
        $this->_element->$name($args[0]);
    }
}