<?php
/*
* 简单工厂模式是另一种非常常用的模式，正如其名字所示：确实是对象实例的生产工厂。某些意义上，工厂模式提供了通用的方法有助于我们去获取对象，而不需要关心其具体的内在的实现
*/
interface Factory {
    public function getProduct();
}

interface Product {
    public function getName();
}

class FirstFactory implements Factory {

    public function getProduct() {
        return new FirstProduct();
    }
}

class SecondFactory implements Factory {

    public function getProduct() {
        return new SecondProduct();
    }
}

class FirstProduct implements Product {

    public function getName() {
        return 'The first product';
    }
}

class SecondProduct implements Product {

    public function getName() {
        return 'Second product';
    }
}

$factory = new FirstFactory();
$firstProduct = $factory->getProduct();
$factory = new SecondFactory();
$secondProduct = $factory->getProduct();

print_r($firstProduct->getName());
// The first product
print_r($secondProduct->getName());
// Second product



/*
* 抽象工厂模式是另一种非常常用的模式，正如其名字所示：确实是对象实例的生产工厂。某些意义上，工厂模式提供了通用的方法有助于我们去获取对象，而不需要关心其具体的内在的实现
*/
class Config {
    public static $factory = 1;
}

interface Product {
    public function getName();
}

abstract class AbstractFactory {

    public static function getFactory() {
        switch (Config::$factory) {
            case 1:
                return new FirstFactory();
            case 2:
                return new SecondFactory();
        }
        throw new Exception('Bad config');
    }

    abstract public function getProduct();
}

class FirstFactory extends AbstractFactory {
    public function getProduct() {
        return new FirstProduct();
    }
}
class FirstProduct implements Product {
    public function getName() {
        return 'The product from the first factory';
    }
}

class SecondFactory extends AbstractFactory {
    public function getProduct() {
        return new SecondProduct();
    }
}
class SecondProduct implements Product {
    public function getName() {
        return 'The product from second factory';
    }
}

$firstProduct = AbstractFactory::getFactory()->getProduct();
Config::$factory = 2;
$secondProduct = AbstractFactory::getFactory()->getProduct();

print_r($firstProduct->getName());
// The first product from the first factory
print_r($secondProduct->getName());
// Second product from second factory