import React,{useState} from 'react';
import { useMovieContext } from '../MovieContext';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { Modal,Box,Typography,TextField,Button } from '@mui/material';



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};



const MovieTable = () => {
  const { movieList, deleteMovie, updateMovie,editMovieData, setEditMovieData } = useMovieContext();
  const [IsUpdateMovieModal, setIsUpdateMovieModal] = useState(false)



  

  const updatingMovie=(movie)=>{
    setEditMovieData({
      id: movie.id,
      title: movie.title,
      date: movie.releaseDate,
      oscar: movie.recievedAnOscar,
    });
    setIsUpdateMovieModal(true);
  }

  // Function to handle edit form submission
  
  return (
    <>
      <Modal
        open={IsUpdateMovieModal}
        onClose={() => setIsUpdateMovieModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit Movie
          </Typography>
          <form onSubmit={updateMovie}>
            <TextField
              label="Title"
              value={editMovieData.title}
              onChange={(e) =>
                setEditMovieData({ ...editMovieData, title: e.target.value })
              }
              required
            />
            <TextField
              label="Release Date"
              type="number"
              value={editMovieData.date}
              onChange={(e) =>
                setEditMovieData({ ...editMovieData, date: e.target.value })
              }
              required
            />
            <label>
              Recieved an Oscar:
              <input
                type="checkbox"
                checked={editMovieData.oscar}
                onChange={(e) =>
                  setEditMovieData({
                    ...editMovieData,
                    oscar: e.target.checked,
                  })
                }
              />
            </label>
            <Button type="submit" variant="contained" color="primary">
              Update
            </Button>
          </form>
        </Box>
      </Modal>
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
                  <AiFillDelete/>
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
                  onClick={() => updatingMovie(movie)}
                >
                  <AiFillEdit/>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
   </>
  );
};

export default MovieTable;
