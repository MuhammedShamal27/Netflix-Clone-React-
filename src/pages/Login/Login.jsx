import React, { useState } from 'react';
import './Login.css';
import logo from '../../assets/logo.png';
import { login, signup } from '../../firebase';
import netflix_spinner from '../../assets/netflix_spinner.gif';

const Login = () => {
  const [signState, setSignState] = useState('Sign In');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const validateName = (name) => {
    const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
    return nameRegex.test(name);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6; 
  };

  const user_auth = async (event) => {
    event.preventDefault();
    setLoading(true);
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    let valid = true;

    if (signState === 'Sign Up' && !validateName(name)) {
      setNameError('Name can only contain alphabets and spaces.');
      valid = false;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    }

    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 6 characters long.');
      valid = false;
    }

    if (!valid) {
      setLoading(false);
      return;
    }

    try {
      if (signState === 'Sign In') {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
    } catch (err) {
      setGeneralError(err.message);
    }

    setLoading(false);
  };

  return (
    loading ? <div className="login-spinner">
      <img src={netflix_spinner} alt="Loading" />
    </div> :
    <div className="login">
      <img src={logo} className="login-logo" alt="Netflix" />
      <div className="login-form">
        <h1>{signState}</h1>
        <form onSubmit={user_auth}>
          {signState === 'Sign Up' && (
            <>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Your Name"
              />
              {nameError && <div className="error">{nameError}</div>}
            </>
          )}
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
          />
          {emailError && <div className="error">{emailError}</div>}
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
          {passwordError && <div className="error">{passwordError}</div>}
          <button type="submit">{signState}</button>
          <div className="form-help">
            <div className="remember">
              <input type="checkbox" />
              <label htmlFor="">Remember Me</label>
            </div>
            <p>Need Help?</p>
          </div>
          {generalError && <div className="error">{generalError}</div>}
        </form>
        <div className="form-switch">
          {signState === 'Sign In' ? (
            <p>New to Netflix? <span onClick={() => setSignState('Sign Up')}>Sign Up Now</span></p>
          ) : (
            <p>Already have account? <span onClick={() => setSignState('Sign In')}>Sign In Now</span></p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
