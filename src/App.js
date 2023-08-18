import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import { auth, googleProvider, db } from './FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { getDocs, collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import {AiFillDelete, AiOutlineDelete} from 'react-icons/ai'

function App() {
  const [Data, setData] = useState({ email: '', password: '' });
  const [MovieList, setMovieList] = useState([]);
  const [AddMovieData, setAddMovieData] = useState({ title: '', date: 0, oscar: false });

  useEffect(() => {
    GetMovieList();
  }, []);

  const movieCollectionRef = collection(db, 'movies');

  const GetMovieList = async () => {
    try {
      const response = await getDocs(movieCollectionRef);
      const filteredData = response.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setMovieList(filteredData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setData((preValue) => ({ ...preValue, [name]: value }));
  };

  const signIn = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, Data.email, Data.password);
      console.log('User created');
    } catch (err) {
      console.log('Error: Could not create user', err.message);
    }
  };

  const LogOut = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      console.log('User signed out');
    } catch (err) {
      console.log(err.message);
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

  const handleMovieDataChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setAddMovieData((preValue) => ({ ...preValue, [name]: newValue }));
  };

  const onSubmitMovie = async (e) => {
    e.preventDefault();
    try {
      await addDoc(movieCollectionRef, {
        title: AddMovieData.title,
        releaseDate: AddMovieData.date,
        recievedAnOscar: AddMovieData.oscar,
      });
      GetMovieList();
      console.log('Movie added successfully');
    } catch (err) {
      console.error(err.message);
    }
  };

  const deleteMovie = async (id) => {
    try {
      const movieDocRef = doc(db, 'movies', id);
      await deleteDoc(movieDocRef);
      GetMovieList();
      console.log('Movie deleted successfully');
    } catch (err) {
      console.error('Error deleting movie', err);
    }
  };
  

  return (
    <div className="App">
      <form action="">
        <input
          type="email"
          name="email"
          id=""
          value={Data.email}
          onChange={handleOnchange}
          className="email-input"
        />
        <input
          type="password"
          name="password"
          value={Data.password}
          onChange={handleOnchange}
          id=""
        />
        <button onClick={signIn}>Simple SignIn</button>
        <button onClick={signInWithGoogle}>SignIn with Google</button>
        <button onClick={LogOut}>Logout</button>
      </form>
      <form action="">
        <div>
          <input
            type="text"
            className="movie-name"
            name="title"
            value={AddMovieData.title}
            onChange={handleMovieDataChange}
            placeholder="movie title..."
          />
          <input
            type="number"
            className="release-date"
            name="date"
            value={AddMovieData.date}
            onChange={handleMovieDataChange}
          />
          <input
            type="checkbox"
            name="oscar"
            checked={AddMovieData.oscar}
            onChange={handleMovieDataChange}
          />
          <label htmlFor="">Recieved An Oscar</label>
          <button onClick={onSubmitMovie}>Submit Movie</button>
        </div>
      </form>
      <div>
        <table>
          <caption>Statement Summary</caption>
          <thead>
            <tr>
              <th scope="col">Movie Name</th>
              <th scope="col">Release Date</th>
              <th scope="col">Oscar</th>
            </tr>
          </thead>
          <tbody>
            {MovieList.map((Movie) => (
              <tr key={Movie.id}>
                <td
                  data-label="Account"
                  style={{ color: Movie.recievedAnOscar ? 'green' : 'red' }}
                >
                  {Movie.title}
                </td>
                <td data-label="Due Date">{Movie.releaseDate}</td>
                <td data-label="Amount">{Movie.recievedAnOscar ? 'Yes' : 'No'}</td>
                <td data-label="Amount">
                  <button style={{color:'red',border:'none',outline:'0',borderRadius:'50%',width:'25px',height:'25px',fontSize:'20px'}} onClick={() => deleteMovie(Movie.id)}><AiFillDelete/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
