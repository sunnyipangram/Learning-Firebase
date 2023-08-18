import logo from './logo.svg';
import './App.css';
import React,{useState} from 'react'
import { app,auth,googleProvider } from './FirebaseConfig';
import { createUserWithEmailAndPassword,signInWithPopup,signOut } from 'firebase/auth';


function App() {
  const [Data, setData] = useState({email:'', password:''})

  const handleOnchange = (e) => {
    console.log(e.target.value)
     let {name, value} = e.target;
     setData((preValue)=>({...preValue, [name]: value}));
     

  }
  const signIn=async(e)=>{
    e.preventDefault()
    try{
      await createUserWithEmailAndPassword(auth,Data.email,Data.password)
      console.log('user created')
    }
    catch(err){
      console.log('Error wrong input could not be create user',err.message)
    }
    

  }
  const LogOut=async(e) => {
    e.preventDefault()
    try{
      await signOut(auth)
      console.log('user signed out')
    }
    catch(err) {
      console.log(err.message)
    }


  }

  // console.log(auth?.currentUser?.email===undefined?"No User   In":auth?.currentUser?.email)

console.log(auth?.currentUser?.email)

  const signInWithGoogle = async(e) => {
    e.preventDefault()
    
try{
  await signInWithPopup(auth,googleProvider)
  console.log('user signed up')

}
catch(err){
  console.log(err.message,'could not sign in')
}
  }

  // console.log(auth?.currentUser?.email ,"hfhjdfh")
  return (
    <div className="App">
     
      <form action="" >
      <input type="email" name="email" id="" value={Data.email} onChange={handleOnchange}  className="email-input" />
      <input type="password" name="password" value={Data.password} onChange={handleOnchange}    id="" />
      <button onClick={signIn}>Simple SignIn</button>
      <button onClick={signInWithGoogle}>SignIn with Google</button>
      <button onClick={LogOut}>Logout</button>
      </form>
    </div>
  );
}

export default App;
