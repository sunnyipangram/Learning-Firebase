import React from 'react';
import { useMovieContext } from '../MovieContext';
import { auth } from '../FirebaseConfig';
import { signOut } from 'firebase/auth';

const MovieForm = () => {
  const { addMovieData, setAddMovieData, addMovie } = useMovieContext();

  const handleMovieDataChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setAddMovieData((prevData) => ({ ...prevData, [name]: newValue }));
  };

  const onSubmitMovie = (e) => {
    e.preventDefault();
    addMovie();
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

  return (
    <form action="">
       <button className="enter" onClick={LogOut}>Log Out</button>
      <div>
        <input
          type="text"
          className="movie-name"
          name="title"
          value={addMovieData.title}
          onChange={handleMovieDataChange}
          placeholder="movie title..."
        />
        <input
          type="number"
          className="release-date"
          name="date"
          value={addMovieData.date}
          onChange={handleMovieDataChange}
        />
        <input type="checkbox" name="oscar" checked={addMovieData.oscar} onChange={handleMovieDataChange} />
        <label htmlFor="">Recieved An Oscar</label>
        <button onClick={onSubmitMovie}>Submit Movie</button>
      </div>
    </form>
  );
};

export default MovieForm;
