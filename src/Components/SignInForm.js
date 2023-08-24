import React, { useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithPopup,signOut } from 'firebase/auth';
import { useMovieContext } from '../MovieContext';

const SignInForm = () => {
  const [data, setData] = useState({ email: '', password: '' });
  const {User,setUser}=useMovieContext()
 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user, password) => {
      if(user){
        setUser(user.email )
      }
      else{
        setUser(null)
      }
    })
  
    
   return ()=>unsubscribe()
  }, [User])
  console.log(User)
  
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
    <>
    <div className="signin-container">
    <form action="" >
  <div className="card">
  
    <p className="singup">Sign Up</p>
    <div className="inputBox1">
      <input type="text" name='email' value={data.email} onChange={handleOnChange} required="required" />
      <span className="user">Email</span>
    </div>
   
    <div className="inputBox">
      <input type="password" required="required" name="password" value={data.password} onChange={handleOnChange} />
      <span>Password</span>
    </div>
<div className="btn-div">
    <button className="enter" onClick={signIn}>Sign In</button>
   
    </div>
    <div className='' style={{width:"100%",display:'flex',justifyContent:'center'}}>
    <button class="button-google" onClick={signInWithGoogle}>
  <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262">
  <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
  <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
  <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
  <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
</svg>
  Continue with Google
</button>
     
    </div>
    
  </div>
  </form>
</div>

   
    </>
  );
};

export default SignInForm;
