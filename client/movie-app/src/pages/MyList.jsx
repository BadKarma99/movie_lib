import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getTokenFromLocalStorage } from '../utils/auth';
import Navbar from '../components/Navbar';

export default function GetMovies() {
  const [movies, setMovies] = useState([]);
  const [showList, setShowList] = useState(false);
  const [isPrivate, setIsPrivate] = useState(true);
  const [userId, setUserId] = useState('');
  const [isUserId,setIsUserId]=useState("add movies")

  useEffect(() => {
    // Fetch movies when the component mounts
    fetchMovies();

    // Retrieve isPrivate from localStorage
    const storedIsPrivate = localStorage.getItem('isPrivate');
    if (storedIsPrivate !== null) {
      setIsPrivate(JSON.parse(storedIsPrivate));
    }
  }, []); // Empty dependency array ensures that this effect runs only once

  async function fetchMovies() {
    try {
      const token = getTokenFromLocalStorage();
      const response = await axios.get('http://localhost:8000/movies', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const { movies, userId } = response.data;
      setUserId(userId);
      setMovies(movies);
      setShowList(true); // Set showList to true to display the movie list
    } catch (error) {
      console.error('Error fetching movies:', error);
      // Handle error
    }
  }

  async function updatePrivacySetting(newIsPrivate) {
    try {
      const token = getTokenFromLocalStorage();
      await axios.post(
        'http://localhost:8000/isprivate',
        { userId: userId, isPrivate: newIsPrivate },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setIsPrivate(newIsPrivate);
      // Save isPrivate to localStorage
      localStorage.setItem('isPrivate', JSON.stringify(newIsPrivate));
    } catch (error) {
      console.error('Error updating privacy setting:', error);
      // Handle error
    }
  }

  function handleClick() {
    const newIsPrivate = !isPrivate;
    updatePrivacySetting(newIsPrivate);
  }

  return (
    <>
      <Navbar />
      <div className='bg-gray-900 h-screen'>
        <h2 className='relative text-center font-extrabold text-3xl text-cyan-500'>My Movies</h2>
        <button  type='button' value={isPrivate} onClick={handleClick} className='absolute bg-stone-100 text-black w-14 p-1 text-center m-2 rounded-md top-14 hover:scale-110 transition'>
          {isPrivate ? 'Private' : 'Public'}
        </button>
        <div className=' bg-gray-300 p-1 w-72 rounded-xl m-2 text-center '>
        <p>User Id: {movies.length > 0 ? <span>{userId}</span> : <span className="text-red-500">Add Movies</span>}</p>
        </div>
        <ul className='flex gap-2 flex-wrap items-center justify-center'>
          {showList &&
            movies.map((movie, index) => (
              <li key={index} className='m-2 p-2 bg-gray-700 rounded-md'>
                <div>Title: {movie.title}</div>
                <div>Year: {movie.year}</div>
                <div>Image: <img src={movie.image} alt={movie.title} /></div>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}
