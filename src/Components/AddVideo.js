import React, { useState, useEffect } from 'react';
import { db, storage } from '../FirebaseConfig';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiFillPlusCircle, AiFillUpCircle, AiOutlineCloudUpload, AiOutlineVideoCameraAdd } from 'react-icons/ai';

const AddVideo = () => {
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideo(file);
  };

  const handleAddVideo = async () => {
    setLoading(true);

    if (!title || !description || !year) {
      toast.error('Please provide title, description, and year');
      setLoading(false);
      return;
    }

    try {
      const videoCollectionRef = collection(db, 'videos');
      const newVideoRef = await addDoc(videoCollectionRef, {
        title,
        description,
        year,
        timestamp: Date.now(),
      });

      if (video) {
        const videoRef = ref(storage, `videos/${newVideoRef.id}`);
        await uploadBytes(videoRef, video);
        const videoUrl = await getDownloadURL(videoRef);

        setVideos((prevVideos) => [
          ...prevVideos,
          { title, description, year, url: videoUrl },
        ]);

        toast.success('Video added successfully');
      }

      setTitle('');
      setDescription('');
      setYear('');
      setVideo(null);
    } catch (error) {
      console.error('Error adding video:', error);
      toast.error('Error adding video');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videoCollectionRef = collection(db, 'videos');
        const querySnapshot = await getDocs(videoCollectionRef);

        const fetchedVideos = [];
        for (const doc of querySnapshot.docs) {
          const videoData = doc.data();

          const videoUrl = await getDownloadURL(ref(storage, `videos/${doc.id}`));

          fetchedVideos.push({
            id: doc.id,
            title: videoData.title,
            description: videoData.description,
            year: videoData.year,
            url: videoUrl,
          });
        }
        setVideos(fetchedVideos);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div>
      <div className="add-video">
      <h2>Add Video</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Year"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      />
      {/* <input
        type="file"
        accept="video/*"
        onChange={handleVideoChange}
      /> */}
    <div className="input-div">
  <input className="input" type="file" accept="video/*" onChange={handleVideoChange}/>
  <AiOutlineVideoCameraAdd className='icon' />
</div>

      <button onClick={handleAddVideo} className='add-vid-btn'><AiOutlineCloudUpload/> UPLOAD</button>
      </div>
<div className="container">
  <div className="row">

  {loading ? (
        <p>Loading...</p>
      ) : (
        
        videos.map((video, index) =>{ console.log(video.description.length)
          let truncatedDescription = video.description;
  const maxDescriptionLength = 150; // Set the maximum length you want

  if (truncatedDescription.length > maxDescriptionLength) {
    truncatedDescription = truncatedDescription.substring(0, maxDescriptionLength) + '...';
  }
         
          return ( 
            <div className="col-md-4">
            <div class="video-card">
            <div class="card-image">
            <video controls src={video.url} style={{ height: '300px',maxWidth:"100%",objectFit:'cover' }} />
            </div>
            <div className="text-div">
            <p class="card-title">{video.title.slice(0,35)}...</p>
            <p class="card-body">
            {truncatedDescription}
            </p>
            <p class="footer">Written by <span class="by-name">Sunny Jadaun</span> on <span class="date">{video.year}</span></p>
            </div>
          </div>
          </div>
         
//           <div key={index} className="col-md-4" style={{padding:"0px",marginTop:'30px'}}>
// <div  style={{width:'95%',margin:'auto',background:'#e9e9e9'}}>
//             <div className="col-12 " style={{background:'#244464',boxSizing:'border-box',padding:'15px'}}>
//             <video controls src={video.url} style={{ height: '300px',maxWidth:"100%",objectFit:'cover' }} />
//             </div>
//             <div className="col-12" style={{textAlign:'left'}}>
//             <div class="two" style={{boxSizing:'border-box',padding:'25px'}}>
//   <h1>Title: {video.title}
//     <span>Description: {video.description}</span>
//     <span>Year: {video.year}</span>
//   </h1>
// </div>
// </div>
//             </div>
           
           
//           </div>
         
        )})
      )}
     </div>
    


      <ToastContainer />
    </div>
    </div>
  );
};

export default AddVideo;
