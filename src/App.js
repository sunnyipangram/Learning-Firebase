import React from 'react';

import SignInForm from './Components/SignInForm';
import MovieForm from './Components/MovieForm';
import MovieTable from './Components/MovieList';
import PaginationComponent from './Components/PaginationComponent';
import ImageUploader from './Components/ImageUploader';
import './App.css'

function App() {
  return (
    
      <div className="App">
        <SignInForm />
        <MovieForm />
        <MovieTable />
        <PaginationComponent />
        <ImageUploader />
      </div>
   
  );
}

export default App;
