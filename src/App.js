import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import { auth, googleProvider, db,storage } from './FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { getDocs, collection, addDoc, deleteDoc,updateDoc, doc } from 'firebase/firestore';
import { ref,uploadBytes,listAll,getDownloadURL } from 'firebase/storage';
import {AiFillDelete, AiFillEdit, AiOutlineDelete} from 'react-icons/ai'
import Modal from 'react-modal'
import {v4} from 'uuid'

function App() {
  const [Data, setData] = useState({ email: '', password: '' });
  const [MovieList, setMovieList] = useState([]);
  const [AddMovieData, setAddMovieData] = useState({ title: '', date: 0, oscar: false });
  const [IsUpdateMovieModal, setIsUpdateMovieModal] = useState(false)
 const [editMovieData, setEditMovieData] = useState({id: '', title: '',  date: 0,  oscar: false,});
  const [uploadfile, setuploadfile] = useState(null)
  const [ImageList, setImageList] = useState([])

const ImageListREf=ref(storage,'images/')

  useEffect(() => {
    GetMovieList();
    listAll(ImageListREf).then((response)=>{
      console.log(response)
      response.items.forEach((item) => {
        getDownloadURL(item).then((downloadURL) =>{
          setImageList((preValue)=>[...preValue,downloadURL]);
          console.log(ImageList)
        })
      })
    })
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
      setAddMovieData({title:'',date:0,oscar:false})
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
  const handleEditMovieChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setEditMovieData((prevData) => ({ ...prevData, [name]: newValue }));
  };
  
  const updateMovie = async (e) => {
    e.preventDefault();
    try {
      const movieDocRef = doc(db, 'movies', editMovieData.id);
      await updateDoc(movieDocRef, {
        title: editMovieData.title,
        releaseDate: editMovieData.date,
        recievedAnOscar: editMovieData.oscar,
      });
      setIsUpdateMovieModal(false);
      GetMovieList();
      console.log('Movie updated successfully');
    } catch (err) {
      console.error('Error updating movie', err);
    }
  };

  const editMovie = (movie) => {
    setEditMovieData({
      id: movie.id,
      title: movie.title,
      date: movie.releaseDate,
      oscar: movie.recievedAnOscar,
    });
    setIsUpdateMovieModal(true);
  };
  


  const UploadImage=async()=>{
    if(uploadfile==null)return;
    const imageRef=ref(storage,`images/${uploadfile.name +v4()}`)
     uploadBytes(imageRef,uploadfile).then((response)=>{
      console.log(response,"upload file successfully")
    
      
     }).catch((err)=>{
      console.log(err)
     });


  }
 

  

  return (
    <div className="App">
      <Modal
  isOpen={IsUpdateMovieModal}
  onRequestClose={() => setIsUpdateMovieModal(false)}
  contentLabel="Edit Movie"
>
  <h2>Edit Movie</h2>
  <form onSubmit={updateMovie}>
    <label>Title:</label>
    <input
      type="text"
      name="title"
      value={editMovieData.title}
      onChange={handleEditMovieChange}
    />
    <label>Release Date:</label>
    <input
      type="number"
      name="date"
      value={editMovieData.date}
      onChange={handleEditMovieChange}
    />
    <label>Recieved An Oscar:</label>
    <input
      type="checkbox"
      name="oscar"
      checked={editMovieData.oscar}
      onChange={handleEditMovieChange}
    />
    <button type="submit">Update</button>
    <button onClick={() => setIsUpdateMovieModal(false)}>Cancel</button>
  </form>
</Modal>

      
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
              <th scope="col">Action</th>
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
                  <button style={{color:'#75757e',border:'none',outline:'0',borderRadius:'50%',width:'25px',height:'25px',fontSize:'20px'}} onClick={() => editMovie(Movie)}><AiFillEdit/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
<input type="file"  onChange={(e)=>setuploadfile(e.target.files[0])} name="" id="" />
<button onClick={UploadImage}>Upload Image</button>

<br /><br />
<div className="d-flex">
{ImageList.map((imgSrc,index)=>{
  return <img src={imgSrc}  style={{width:'200px'}} />
})}
</div>

    </div>
  );
}

export default App;
