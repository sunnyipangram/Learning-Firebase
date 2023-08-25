import React, { useEffect } from 'react';

import SignInForm from './Components/SignInForm';
import MovieForm from './Components/MovieForm';
import MovieTable from './Components/MovieList';
import PaginationComponent from './Components/PaginationComponent';
import ImageUploader from './Components/ImageUploader';
import './App.css'
import { useMovieContext } from './MovieContext';
import AddVideo from './Components/AddVideo';

function App() {
  const {User,setUser}=useMovieContext()
 
  
  return (
    
      <div className="App">
        {User===null ? <SignInForm /> :
        <>
         <MovieForm />
        <MovieTable />
        <PaginationComponent />
        <ImageUploader />
        <AddVideo/>
        </> }
       
       
      </div>
   
  );
}

export default App;
