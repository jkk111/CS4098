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

export function isNatural(n){
  n = n.toString(); // force the value incase it is not
  var n1 = Math.abs(n),
      n2 = parseInt(n, 10);
  return !isNaN(n1) && n2 === n1 && n1.toString() === n;
}
