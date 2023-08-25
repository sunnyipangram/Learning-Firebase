import React, { useEffect, useState } from 'react';
import { auth, googleProvider } from '../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useMovieContext } from '../MovieContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignInForm = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ email: '', password: '' });
  const { User, setUser } = useMovieContext();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user.email);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      let response = await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      console.log('User Logged In Successfully!');
      toast.success(response.message);
      console.log(response);
    } catch (err) {
      console.log('Error: Could not log in', err.message);
      toast.error('Could not log in. Please check your credentials.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupData.password.length < 6) {
      toast.error('Password should be at least 6 characters long.');
      return;
    }
    
    if (!/[A-Z]/.test(signupData.password)) {
      toast.error('Password should contain at least one uppercase letter.');
      return;
    }

    if (!/[0-9]/.test(signupData.password)) {
      toast.error('Password should contain at least one numeric digit.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, signupData.email, signupData.password);
      console.log('User Created Successfully');
      toast.success('User created successfully!');
    } catch (err) {
      console.log('Error: Could not create user', err.message);
      toast.error('Could not create user. Please try again.');
    }
  };

  const signInWithGoogle = async (e) => {
    e.preventDefault();
    try {
      await signInWithPopup(auth, googleProvider);
      console.log('User signed up');
    } catch (err) {
      console.log('Could not sign in', err.message);
      toast.error('Could not sign in. Please try again.');
    }
  };

  return (
    <>
     <div className="signin-container">
   <div className="form-container">
  <p className="title">Login</p>
  <form className="form">
    <div className="input-group">
      <label htmlFor="username">Username</label>
      <input type="text" name='email' value={loginData.email} onChange={handleLoginChange} required />
    </div>
    <div className="input-group">
      <label htmlFor="password">Password</label>
      <input type="password" name="password" value={loginData.password} onChange={handleLoginChange} required />
      <div className="forgot">
        {/* <a rel="noopener noreferrer" href="#">Forgot Password ?</a> */}
      </div>
    </div>
    <button className="sign" onClick={handleLogin}>Log in</button>
  </form>
  <div className="social-message">
    <div className="line" />
    
    <div className="line" />
  </div>
  <div className="social-icons">
    <button aria-label="Log in with Google" className="icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current">
        <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z" />
      </svg>
    </button>
  
  </div>
 
</div>

    <form action="" >
  <div className="card">
  
    <p className="singup">Sign Up</p>
    <div className="inputBox1">
      <input type="text" name='email' value={signupData.email} onChange={handleSignupChange} required="required" />
      <span className="user">Email</span>
    </div>
   
    <div className="inputBox">
      <input type="password" required="required" name="password" value={signupData.password} onChange={handleSignupChange} />
      <span>Password</span>
    </div>
<div className="btn-div">
    <button className="enter" onClick={handleSignup}>Sign In</button>
   
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
      <ToastContainer />
    </>
  );
};

export default SignInForm;
























// import React, { useContext, useEffect, useState } from 'react';
// import { auth, googleProvider } from '../FirebaseConfig';
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup,signOut } from 'firebase/auth';
// import { useMovieContext } from '../MovieContext';

// const SignInForm = () => {
//   const [data, setData] = useState({ email: '', password: '' });
//   const {User,setUser}=useMovieContext()
 

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user, password) => {
//       if(user){
//         setUser(user.email )
//       }
//       else{
//         setUser(null)
//       }
//     })
  
    
//    return ()=>unsubscribe()
//   }, [User])
//   console.log(User)
  
//   const handleOnChange = (e) => {
//     const { name, value } = e.target;
//     setData((prevData) => ({ ...prevData, [name]: value }));
//   };
//   const LogIn = async (e) => {
//     e.preventDefault();
//     try {
//  let response=     await signInWithEmailAndPassword(auth, data.email, data.password);
//       console.log('User Loggd In Success !');
//       console.log(response);
      
//     } catch (err) {
//       console.log('Error: Could not create user', err.message);
//     }
//   };

//   const signIn = async (e) => {
//     e.preventDefault();
//     try {
//       await createUserWithEmailAndPassword(auth, data.email, data.password);
//       console.log('User created');
//     } catch (err) {
//       console.log('Error: Could not create user', err.message);
//     }
//   };

//   const signInWithGoogle = async (e) => {
//     e.preventDefault();
//     try {
//       await signInWithPopup(auth, googleProvider);
//       console.log('User signed up');
//     } catch (err) {
//       console.log('Could not sign in', err.message);
//     }
//   };


//   return (
//     <>
   

   
//     </>
//   );
// };

// export default SignInForm;
