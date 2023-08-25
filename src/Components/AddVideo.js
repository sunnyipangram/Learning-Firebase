import React, { useState, useEffect } from 'react';
import { db, storage } from '../FirebaseConfig';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddVideo = () => {
    const [video, setVideo] = useState(null);
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true); // Added loading state
  
    const handleVideoChange = (e) => {
      const file = e.target.files[0];
      setVideo(file);
    };
  
    const handleAddVideo = async () => {
        setLoading(true); // Show loading indicator during fetching
      
        try {
          // Add video details to Firestore
          const videoCollectionRef = collection(db, 'videos');
          const newVideoRef = await addDoc(videoCollectionRef, {
            title,
            year,
          });
      
          // Upload video file to Storage
          if (video) {
            const videoRef = ref(storage, `videos/${newVideoRef.id}`);
            await uploadBytes(videoRef, video);
            const videoUrl = await getDownloadURL(videoRef);
            
            // Update the videos array to include the new video
            setVideos((prevVideos) => [...prevVideos, { title, year, url: videoUrl }]);
            
            toast.success('Video added successfully');
          }
      
          // Clear form
          setTitle('');
          setYear('');
          setVideo(null);
        } catch (error) {
          console.error('Error adding video:', error);
          toast.error('Error adding video');
        } finally {
          setLoading(false); // Hide loading indicator after fetching
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
      
              // Fetch video URL from Storage
              const videoUrl = await getDownloadURL(ref(storage, `videos/${doc.id}`));
      
              fetchedVideos.push({
                id: doc.id,
                title: videoData.title,
                year: videoData.year,
                url: videoUrl, // Include the URL in the fetched video data
              });
            }
            setVideos(fetchedVideos);
          } catch (error) {
            console.error('Error fetching videos:', error);
          } finally {
            setLoading(false); // Hide loading indicator after fetching
          }
        };
      
        fetchVideos();
      }, []);
      
  return (
    <div>
      <h2>Add Video</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Year"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      />
      <input
        type="file"
        accept="video/*"
        onChange={handleVideoChange}
      />
      <button onClick={handleAddVideo}>Add Video</button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        videos.map((video, index) => (
          <div key={index}>
            <p>Title: {video.title}</p>
            <p>Year: {video.year}</p>
            <video controls src={video.url} style={{height:'300px'}} />
          </div>
        ))
      )}

      <ToastContainer />
    </div>
  );
};

export default AddVideo;
