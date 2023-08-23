import React from 'react';
import { useMovieContext } from '../MovieContext';

const ImageUploader = () => {
  const { uploadFile, setUploadFile, uploadImage, imageList } = useMovieContext();

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setUploadFile(e.target.files[0])}
      />
      <button onClick={uploadImage}>Upload Image</button>
      <br /><br />
      <div className="d-flex">
        {imageList.map((imgSrc, index) => (
          <img key={index} src={imgSrc} style={{ width: '200px' }} alt={`Image ${index}`} />
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
