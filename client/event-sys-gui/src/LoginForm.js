import React from 'react'

let LoginForm = ({ onSubmit }) => {
  return <div className="login-form">
    <h1>Already Have An Account? / Log In</h1>
    <form onSubmit={onSubmit}>
      <div>
        <label>Username:</label>
        <input type="text" name="username" />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" name="password" autoComplete='off' />
      </div>
      <div>
        <input type="submit" value="Log In" />
      </div>
    </form>
  </div>
}

export default LoginForm
