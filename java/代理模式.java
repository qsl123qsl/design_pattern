/*
* 代理模式  为其他对象提供一种代理以控制对这个对象的访问。也可以说，在出发点到目的地之间有一道中间层，意为代理
* 为什么要使用
* 授权机制不同级别的用户对同一对象拥有不同的访问权利，如在论坛系统中，就使用Proxy进行授权机制控制，访问论坛有两种人：注册用户和游客(未注册用户)，论坛就通过类似ForumProxy这样的代理来控制这两种用户对论坛的访问权限。
* 某个客户端不能直接操作到某个对象，但又必须和那个对象有所互动。
*/

public class ForumPermissions implements Cacheable {
    /**
    * Permission to read object.
    */
    public static final int READ = 0;

    /**
    * Permission to administer the entire sytem.
    */
    public static final int SYSTEM_ADMIN = 1;

    /**
    * Permission to administer a particular forum.
    */
    public static final int FORUM_ADMIN = 2;

    /**
    * Permission to administer a particular user.
    */
    public static final int USER_ADMIN = 3;

    /**
    * Permission to administer a particular group.
    */
    public static final int GROUP_ADMIN = 4;

    /**
    * Permission to moderate threads.
    */
    public static final int MODERATE_THREADS = 5;

    /**
    * Permission to create a new thread.
    */
    public static final int CREATE_THREAD = 6;

    /**
    * Permission to create a new message.
    */
    public static final int CREATE_MESSAGE = 7;

    /**
    * Permission to moderate messages.
    */
    public static final int MODERATE_MESSAGES = 8;
  
    public boolean isSystemOrForumAdmin() {
        return (values[FORUM_ADMIN] || values[SYSTEM_ADMIN]);
    }

//相关操作代码
}


public class ForumProxy implements Forum {
    private ForumPermissions permissions;
    private Forum forum;
    this.authorization = authorization;

    public ForumProxy(Forum forum, Authorization authorization,ForumPermissions permissions){
        this.forum = forum;
        this.authorization = authorization;
        this.permissions = permissions;
    }
    .....
    public void setName(String name) throws UnauthorizedException,
        ForumAlreadyExistsException{
        //只有是系统或论坛管理者才可以修改名称
      if (permissions.isSystemOrForumAdmin()) {
        forum.setName(name);
      }
　　  else {
　　　 throw new UnauthorizedException();
　　  }
    }
    ...

} 



public class DbForum implements Forum, Cacheable {
    ...
    public void setName(String name) throws ForumAlreadyExistsException {
　　....
        this.name = name;
　　     //这里真正将新名称保存到数据库中
　　     saveToDb();
　　....
    }
    ...
}