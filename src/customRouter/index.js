/**
 * hash类型
 */
class HashHistory {
  constructor() {
    this.current = null;
    this.initListener()
  }

  initListener (){
    location.hash ? '' : location.hash = '/';
    window.addEventListener('load', () => {
      // 页面加载的时候初始化，存储hash值到history的current上，并且去掉开头的#
      this.current = location.hash.slice('1');
    });
    window.addEventListener('hashchange', () => {
      // hash改变的时候更新history的current
      this.current = location.hash.slice('1');
    })
  }
}

/**
 * history模式
 */

class HTML5History {
  constructor() {
    this.current = null;
    this.initListener()
  }

  initListener (){
    // 如果url没有pathname，给一个默认的根目录pathname
    location.pathname ? '' : location.pathname = '/';
    window.addEventListener('load', () => {
      // 页面加载的时候初始化，存储pathname值到history的current上
      this.current = location.pathname;
    });
    window.addEventListener('popstate', () => {
      // pathname改变的时候更新history的current
      this.current = location.pathname;
    })
  }
}


//定义路由类
class CustomRouter {
  constructor(options) {
    this.mode = options.mode || 'hash';
    this.routers = options.routers || [];
    // 将数组结构的routes转化成一个更好查找的对象
    this.routesMap = this.mapRoutes(this.routers);
    this.init();
  }

  // 初始化history
  init() {
    if (this.mode === 'hash') {
      this.history = new HashHistory()
    } else {
      this.history = new HTML5History()
    }
  }

  /*
  将 [{path: '/', component: Hello}]
  转化为 {'/': Hello} 方便查找
  */
  mapRoutes(routes) {
    return routes.reduce((res, current) => {
      res[current.path] = current.component;
      return res;
    }, {})
  }
}

// 添加install属性，用来执行插件
CustomRouter.install = function (vue) {
  vue.mixin({
    beforeCreate() {
      // 获取new Vue时传入的参数
      if (this.$options && this.$options.router) {
        this._root = this;
        this._router = this.$options.router;
        // 监听current, defineReactive(obj, key, val)不传第三个参数，第三个参数默认是obj[key]
        // 第三个参数传了也会被监听，效果相当于，第一个参数的子级
        vue.util.defineReactive(this, 'current', this._router.history);
        // vue.set(this, 'current', this._router.history);

      } else {
        // 如果不是根组件，就往上找
        this._root = this.$parent &&  this.$parent._root || this ;
      }

      // 暴露一个只读的$router
      Object.defineProperty(this, '$router', {
        get() {
          return this._root._router;
        }
      })
    }
  });


  // 注册 router-link组件，进行路由跳转
  vue.component('router-link', {
    props:['to'],
    render(h) {
      const tag = 'a' // a 标签
      const config = {
        attrs:{
          href:this._self._root._router.mode =='hash'? '#'+this.to: this.to  // 根据路由mode 设置不同的 href 属性
        }
      }
      return h(tag,config,this.$slots.default);
    }
  })

  // 注册router-view组件，这个组件根据current不同会render不同的组件
  vue.component('router-view', {
    render(h) {
      //获取当前的path路径
      const current = this._self._root._router.history.current;
      //获取转换后的路由对象 {`path`:`component`} 组合
      const routesMap = this._self._root._router.routesMap;
      //根据path 获取对应的组件
      const component = routesMap[current];
      //渲染组件
      return h(component);
    }
  })

}

export default CustomRouter;
