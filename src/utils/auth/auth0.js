import qs from 'query-string'
import { getUser, setToken, unsetToken } from './auth'
import { CLIENT_ID, ROUTES } from './authConstants'
import config from './authLockConfig.json'
import store from '../../store'
import router from '../../router'
import api from '../../api'

const baseUrl = `${window.location.protocol}//${window.location.host}`

const lock = new Auth0Lock(CLIENT_ID, ROUTES.DOMAIN, config)
let articleIdPendingToFav = null

export const login = (articleId) => {
  articleIdPendingToFav = articleId
  lock.show()
}

export const logout = () => {
  const { path, query } = router.currentRoute
  const logoutRoute = `${baseUrl}${ROUTES.CALLBACK_ROUTE_LOGOUT}`
  if (path === '/') {
    lock.logout({
      returnTo: logoutRoute
    })
  } else {
    let queryStr = qs.stringify(query)
    queryStr = queryStr ? `?${queryStr}` : ''
    lock.logout({
      returnTo: `${logoutRoute}?returnTo=${encodeURIComponent(path + queryStr)}`,
    })
  }
}

export const logoutCallback = (returnTo) => {
  unsetToken()
  store.commit('auth/logout')
  router.push(returnTo || '/')
}

export const initAuth = async () => {
  store.commit('auth/started')
  const user = await checkSession(lock)
  if (user) {
    try {
      const { data: favorites } = await api.getFavorites()
      store.commit('auth/login', user)
      store.commit('auth/updateFavorites', favorites)
    } catch (error) {
      // TODO: loggin you out only if there was an auth error while getting favorites here
      // error.response.status == 403
      // this happens because token expired and we're still saving the info locally
      // temporary fix, logging you out if there was any issue with the favorites request here
      unsetToken()
      store.commit('auth/logout')
    }
  }
  store.commit('auth/finished')
  lock.on('authenticated', async (result) => {
    setToken(result.idToken, result.accessToken)
    const user = getUser()
    const { data: favorites } = articleIdPendingToFav
      ? await api.toggleFavorite(articleIdPendingToFav)
      : await api.getFavorites()
    store.commit('auth/login', user)
    store.commit('auth/updateFavorites', favorites)
    store.commit('snackbar/welcome', user)
    articleIdPendingToFav = null
  })
}

const checkSession = async (lock) => {
  return new Promise((resolve) => {
    // check if only checkSession should be called
    const user = getUser()
    if (user) {
      return resolve(user)
    }
    lock.checkSession({
      redirectUri: baseUrl
    }, (err, result) => {
      if (err) resolve(null) // always resolving
      else {
        setToken(result.idToken, result.accessToken)
        resolve(getUser())
      }
    })
  })
}
