import Vue from 'vue'
import Vuex from 'vuex'
import authModule from './authModule'
import shareModule from './shareModule'
import metaModule from './metaModule'
import introModule from './introModule'
import searchModule from './searchModule'
import snackbarModule from './snackbarModule'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth: authModule,
    share: shareModule,
    meta: metaModule,
    intro: introModule,
    search: searchModule,
    snackbar: snackbarModule
  }
})
