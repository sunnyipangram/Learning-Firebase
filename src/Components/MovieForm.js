import React, { useEffect } from 'react';
import { useMovieContext } from '../MovieContext';
import { auth } from '../FirebaseConfig';
import { signOut } from 'firebase/auth';





const MovieForm = () => {
  const { addMovieData, setAddMovieData, addMovie,User } = useMovieContext();

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
      window.location.reload(); // Reload the app
      console.log('User signed out');
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    
  }, [LogOut]);
  console.log(User)
  

  return (
    <form action="">
    
       <button className="logout-btn" onClick={LogOut}>Log Out({User})</button>
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
