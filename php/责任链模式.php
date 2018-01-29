<?php
/*
*这种模式有另一种称呼：控制链模式。它主要由一系列对于某些命令的处理器构成，每个查询会在处理器构成的责任链中传递，在每个交汇点由处理器判断是否需要对它们进行响应与处理。每次的处理程序会在有处理器处理这些请求时暂停。
*/
interface Command {
    function onCommand($name, $args);
}

class CommandChain {
    private $_commands = array();

    public function addCommand($cmd) {
        $this->_commands[]= $cmd;
    }

    public function runCommand($name, $args) {
        foreach($this->_commands as $cmd) {
            if ($cmd->onCommand($name, $args))
                return;
        }
    }
}

class CustCommand implements Command {
    public function onCommand($name, $args) {
        if ($name != 'addCustomer')
            return false;
        echo("This is CustomerCommand handling 'addCustomer'\n");
        return true;
    }
}

class MailCommand implements Command {
    public function onCommand($name, $args) {
        if ($name != 'mail')
            return false;
        echo("This is MailCommand handling 'mail'\n");
        return true;
    }
}

$cc = new CommandChain();
$cc->addCommand( new CustCommand());
$cc->addCommand( new MailCommand());
$cc->runCommand('addCustomer', null);
$cc->runCommand('mail', null);