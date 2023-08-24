import React,{ createContext, useContext, useEffect, useState } from 'react';
import { db, storage } from './FirebaseConfig';
import { getDocs, collection, addDoc, deleteDoc, updateDoc, doc, query, orderBy, startAfter, limit } from 'firebase/firestore';
import { ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieContextProvider = ({ children }) => {
  const [movieList, setMovieList] = useState([]);
  const [addMovieData, setAddMovieData] = useState({ title: '', date: 0, oscar: false });
  const [editMovieData, setEditMovieData] = useState({ id: '', title: '', date: 0, oscar: false });
  const [uploadFile, setUploadFile] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [totalMovies, setTotalMovies] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastDocument, setLastDocument] = useState(null);
  const [User,setUser] = useState(null)
  const moviesPerPage = 5;

  const movieCollectionRef = collection(db, 'movies');
  const imageListRef = ref(storage, 'images/');

  useEffect(() => {
    fetchTotalMovies();
    fetchMovieList();
    fetchImages();
  }, [currentPage]);

  const fetchTotalMovies = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'movies'));
      setTotalMovies(snapshot.size);
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchMovieList = async () => {
    try {
      let moviesQuery = collection(db, 'movies');
      if (lastDocument) {
        moviesQuery = query(moviesQuery, orderBy('releaseDate'), startAfter(lastDocument), limit(moviesPerPage));
      } else {
        moviesQuery = query(moviesQuery, orderBy('releaseDate'), limit(moviesPerPage));
      }

      const snapshot = await getDocs(moviesQuery);

      const movieData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMovieList(movieData);

      if (snapshot.docs.length > 0) {
        setLastDocument(snapshot.docs[snapshot.docs.length - 1]);
      } else {
        setLastDocument(null);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await listAll(imageListRef);
      const urls = await Promise.all(response.items.map((item) => getDownloadURL(item)));
      setImageList(urls);
    } catch (err) {
      console.error(err.message);
    }
  };

  const addMovie = async () => {
    try {
      await addDoc(movieCollectionRef, {
        title: addMovieData.title,
        releaseDate: addMovieData.date,
        recievedAnOscar: addMovieData.oscar,
      });
      setAddMovieData({ title: '', date: 0, oscar: false });
      fetchMovieList();
    } catch (err) {
      console.error(err.message);
    }
  };

  const deleteMovie = async (id) => {
    try {
      const movieDocRef = doc(db, 'movies', id);
      await deleteDoc(movieDocRef);
      fetchMovieList();
    } catch (err) {
      console.error('Error deleting movie', err);
    }
  };

  const updateMovie = async () => {
    try {
      const movieDocRef = doc(db, 'movies', editMovieData.id);
      await updateDoc(movieDocRef, {
        title: editMovieData.title,
        releaseDate: editMovieData.date,
        recievedAnOscar: editMovieData.oscar,
      });
      fetchMovieList();
    } catch (err) {
      console.error('Error updating movie', err);
    }
  };

  const uploadImage = async () => {
    if (uploadFile === null) return;
    const imageRef = ref(storage, `images/${uploadFile.name + v4()}`);
    try {
      await uploadBytes(imageRef, uploadFile);
      fetchImages();
    } catch (err) {
      console.log(err);
    }
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  return (
   
    <MovieContext.Provider value={{ movieList,addMovieData,setAddMovieData, editMovieData,setEditMovieData,uploadFile,setUploadFile,imageList, totalMovies, currentPage, setCurrentPage,  addMovie, deleteMovie, updateMovie, uploadImage, handlePageChange,User,setUser }} >
      {children}
    </MovieContext.Provider>
   
  );
};
