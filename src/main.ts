import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import '@/style/global.scss'

createApp(App).use(router).use(ElementPlus).use(createPinia().use(persist)).mount('#app')
