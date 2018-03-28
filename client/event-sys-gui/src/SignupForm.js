import React from 'react';

let SignupForm = ({ onSubmit, registerError = null}) => {
  return <div className="signup-form">
    <h1>Sign Up / Create An Account</h1>
    <form onSubmit = {onSubmit}>
      <div className='error'>
        {registerError}
      </div>
      <div>
        <label>First Name:</label>
        <input type="text" name="f_name" />
      </div>
      <div>
        <label>Last Name:</label>
        <input type="text" name="l_name" />
      </div>
      <div>
        <label>Username:</label>
        <input type="text" name="username" />
      </div>
      <div>
        <label>Email:</label>
        <input type="text" name="email" />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" name="password" autoComplete='off' />
      </div>
      <div>
        <label>Confirm Password:</label>
        <input type="password" name="password_confirm" autoComplete='off' />
      </div>
      <div>
        <input type="submit" value="Sign Up" />
      </div>
    </form>
  </div>


}

export default SignupForm
