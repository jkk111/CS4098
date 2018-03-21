import Logger from './Logger'

let noop = () => {}

let logout = (onLogout) => async() => {
  await fetch('/logout')
  onLogout();
}

let isNatural = (n) => {
  n = `${n}` // force the value incase it is not
  let n1 = Math.abs(n);
  let n2 = parseInt(n, 10);
  return !isNaN(n1) && n2 === n1 && n1.toString() === n;
}

export {
  logout,
  noop,
  Logger,
  isNatural
}
