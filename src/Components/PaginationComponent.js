import React from 'react';
import { useMovieContext } from '../MovieContext';
import { Pagination } from '@mui/material';

const PaginationComponent = () => {
  const { totalMovies, currentPage, handlePageChange } = useMovieContext();
  const moviesPerPage = 5;

  return (
    <div className='container'>
      <Pagination
        count={Math.ceil(totalMovies / moviesPerPage)}
        page={currentPage}
        onChange={handlePageChange}
      />
    </div>
  );
};

export default PaginationComponent;
