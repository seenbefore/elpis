import { createApp } from "vue";

// 引入 element-plus
import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css';

import './asserts/custom.css';

import pinia from '$store';

import { createRouter, createWebHashHistory } from 'vue-router';

/**
 * vue 页面主入口，用于启动 vue
 * @params pageComponent vue 入口组件
 * @params routes 路由配置
 * @params libs 页面依赖的第三方包
 */
export default (pageComponent, {routes, libs} = {}) => {
  const app = createApp(pageComponent);

  // 应用 element-plus
  app.use(ElementPlus);

  // 应用 pinia
  app.use(pinia);

  // 应用第三方库
  if(libs && libs.length){
    for(let i = 0; i < libs.length; i++){
      app.use(libs[i]);
    }
  }

  // 页面路由
  if(routes && routes.length){
    const router = createRouter({
      history: createWebHashHistory(),
      routes
    });
    app.use(router);
    router.isReady().then(() => {
      app.mount("#root");
    });
  } else {
    app.mount("#root");
  }
}