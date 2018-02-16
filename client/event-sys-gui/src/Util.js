
let logout = (onLogout) => async() => {
  await fetch('/logout')
  onLogout();
}

export {
  logout
}