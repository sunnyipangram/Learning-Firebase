import React from 'react';
import { useMovieContext } from '../MovieContext';

const MovieTable = () => {
  const { movieList, deleteMovie, editMovie } = useMovieContext();

  return (
    
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
          {movieList.map((movie) => (
            <tr key={movie.id}>
              <td
                data-label="Account"
                style={{ color: movie.recievedAnOscar ? 'green' : 'red' }}
              >
                {movie.title}
              </td>
              <td data-label="Due Date">{movie.releaseDate}</td>
              <td data-label="Amount">
                {movie.recievedAnOscar ? 'Yes' : 'No'}
              </td>
              <td data-label="Amount">
                <button
                  style={{
                    color: 'red',
                    border: 'none',
                    outline: '0',
                    borderRadius: '50%',
                    width: '25px',
                    height: '25px',
                    fontSize: '20px',
                  }}
                  onClick={() => deleteMovie(movie.id)}
                >
                  Delete
                </button>
                <button
                  style={{
                    color: '#75757e',
                    border: 'none',
                    outline: '0',
                    borderRadius: '50%',
                    width: '25px',
                    height: '25px',
                    fontSize: '20px',
                  }}
                  onClick={() => editMovie(movie)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
   
  );
};

export default MovieTable;
