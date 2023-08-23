import React, { useState } from 'react';
import { auth, googleProvider } from '../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

const SignInForm = () => {
  const [data, setData] = useState({ email: '', password: '' });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const signIn = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      console.log('User created');
    } catch (err) {
      console.log('Error: Could not create user', err.message);
    }
  };

  const signInWithGoogle = async (e) => {
    e.preventDefault();
    try {
      await signInWithPopup(auth, googleProvider);
      console.log('User signed up');
    } catch (err) {
      console.log('Could not sign in', err.message);
    }
  };

  return (
    <form action="">
      <input type="email" name="email" value={data.email} onChange={handleOnChange} className="email-input" />
      <input type="password" name="password" value={data.password} onChange={handleOnChange} />
      <button onClick={signIn}>Simple SignIn</button>
      <button onClick={signInWithGoogle}>SignIn with Google</button>
    </form>
  );
};

export default SignInForm;
