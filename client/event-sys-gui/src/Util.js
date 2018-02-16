import Logger from './Logger'

let noop = () => {}

let logout = (onLogout) => async() => {
  await fetch('/logout')
  onLogout();
}

export {
  logout,
  noop,
  Logger
}