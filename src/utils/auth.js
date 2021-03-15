import Cookies from 'js-cookie'
const TokenKey = 'Admin-Token-Warehouse'
const System = 'System'
export function getToken() {
  return Cookies.get(TokenKey)
}
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setSystem(system) {
  return Cookies.set(System, system)
}
export function getSystem() {
  return Cookies.get(System)
}
