import React, { useState, useEffect } from "react"
import "./Festival.css"
import { Link, useParams } from 'react-router-dom'

const Festival = () => {
  const {festivalId} = useParams();
  const [festivalData, setFestivalData] = useState(null);
  const [festInfo, setfestInfo] = useState(null)
  const [attendeeInfo, setAttendeeInfo] = useState(null)


  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/festivals/${festivalId}`)
      .then(response => response.json())
      .then(data => {
        setFestivalData(data)
      })
      .catch(error => console.log(error))
  }, [festivalId])

  useEffect(() => {
    if (festivalData) {
      const fest = festivalData?.data; 
      const attend = festivalData?.included;  
      
      setfestInfo(fest); 
      setAttendeeInfo(attend); 
    }
  }, [festivalData]); 

  const removeArtist = (artistId) => {
    fetch(`http://localhost:3000/api/v1/festivals/${festivalId}/artist/${artistId}`, {
      method: 'DELETE'
    })
    .then(data => {
      const filteredData = attendeeInfo.filter((attendee) => {
        if (attendee.type !== "artist" || (attendee.type === "artist" && attendee.id !== artistId)) {
          return attendee
    }})
    console.log(filteredData)
    setAttendeeInfo(filteredData)
    })
    .catch(error => console.log(error))
  }
  
  return (
    <main>
      <header>  
        <Link to='/'>
          <h1>Show Manager</h1>
        </Link>
      </header>
      <section className="festival-overview">
        <img src={festInfo?.attributes.imageURL} className="festival-image" alt={festInfo?.attributes.name}></img>
        <div className="text-content">
          <h2>{festInfo?.attributes.name}</h2>
          <ul>
            <li>{festInfo?.attributes.start_time}</li>
            <li>{festInfo?.attributes.end_time}</li>
          </ul>
        </div>
      </section>
      <section>
      <h2>{"Attending Bands (click to remove from festival listing)"}</h2>
      </section>
      <section className="festival-artists-grid">
        {attendeeInfo?.filter((entry) => entry.type === "artist").length > 0 ? (
          attendeeInfo
            ?.filter((entry) => entry.type === "artist")
            .map((artist) => (
              <article key={artist.id} className="artist-card" onClick={() => removeArtist(artist.id)}>
                <h3>{artist.attributes.name}</h3>
                <img 
                  src={artist.attributes.imageURL || 'https://i.imgur.com/5cQptOf.png'} 
                  className="band-image" 
                  alt={artist.attributes.name}
                />
              </article>
                ))) : (<p>No Artists found for this Festival</p>)}
        </section>
      <section>
        <h2>Attending users</h2>
      </section>
      <section className="festival-users-grid">
        {attendeeInfo?.filter((entry) => entry.type === "user").length > 0 ? (
          attendeeInfo
            ?.filter((entry) => entry.type === "user")
            .map((user) => (
              <article key={user.id} className="user-card">
                <p>{`${user.attributes.first_name} ${user.attributes.last_name}`}</p>
                <p>{user.attributes.email}</p>
              </article>
            ))) : (<p>No Users found for this Festival</p>)}
      </section>
    </main>
  );
}
export default Festival;
