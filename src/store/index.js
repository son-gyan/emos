import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex);

import app from './modules/app'
import menu from './modules/menu'
import tab from './modules/tab'
import iframe from './modules/iframe'
import tree from './modules/tree'
import user from './modules/tree'
const store = new vuex.Store({
    modules: {
        app: app,
        menu:menu,
        tab:tab,
        iframe:iframe,        
        user:user,
        tree,
    }
})

export default store