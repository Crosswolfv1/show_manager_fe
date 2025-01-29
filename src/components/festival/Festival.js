import React, { useState, useEffect } from "react"
import "./Festival.css"
import { Link, useParams } from 'react-router-dom'
import homeImage from '../../assets/wordart.png'

const Festival = () => {
  const { festivalId } = useParams();
  const [festivalData, setFestivalData] = useState(null);
  const [festInfo, setFestInfo] = useState(null)
  const [attendeeArtists, setAttendeeArtists] = useState([])
  const [attendeeUsers, setAttendeeUsers] = useState([])

  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/festivals/${festivalId}`)
      .then((response) => response.json())
      .then((data) => {
        const fest = data?.data
        const attend = data?.included

        // Format festival start and end time (month, day, year)
        const formattedFest = { ...fest }
        const festivalStart = new Date(fest.attributes.start_time)
        const festivalEnd = new Date(fest.attributes.end_time)

        formattedFest.attributes.start_time = festivalStart.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })

        formattedFest.attributes.end_time = festivalEnd.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })

        // Separate artist data and user data
        const formattedArtists = fest.attributes.attending_artists_with_times.map((artistTime) => {
          const artist = attend.find(a => a.attributes.name === artistTime.artist_name)
          if (artist) {
            const artistStart = new Date(artistTime.start_time)
            const artistEnd = new Date(artistTime.end_time)

            artist.attributes.start_time = artistStart.toLocaleString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })

            artist.attributes.end_time = artistEnd.toLocaleString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })

            return artist
          }
          return null
        }).filter(artist => artist !== null)

        const formattedUsers = attend.filter((entry) => entry.type === "user")

        setFestInfo(formattedFest)
        setAttendeeArtists(formattedArtists)
        setAttendeeUsers(formattedUsers)
      })
      .catch((error) => console.log(error))
  }, [festivalId])

  const removeArtist = (artistId) => {
    fetch(`http://localhost:3000/api/v1/festivals/${festivalId}/artist/${artistId}`, {
      method: 'DELETE',
    })
      .then(() => {
        const filteredData = attendeeArtists.filter((attendee) => attendee.id !== artistId)
        setAttendeeArtists(filteredData)
      })
      .catch((error) => console.log(error))
  }

  return (
    <main>
      <header>
        <Link to='/'>
          <img src={homeImage} alt="home button" />
        </Link>
      </header>
      <section className="festival-overview">
        <img src={festInfo?.attributes.imageURL} className="festival-image" alt={festInfo?.attributes.name} />
        <div className="text-content">
          <h2>{festInfo?.attributes.name}</h2>
          {/* Dates here are a placeholder for a calender widget */}
          <ul>
            <li>{festInfo?.attributes.start_time}</li>
            <li>{festInfo?.attributes.end_time}</li>
          </ul>
        </div>
      </section>
      <section>
        <h2>{"Attending Bands (double click to remove from festival listing)"}</h2>
      </section>
      <section className="festival-artists-grid">
        {attendeeArtists?.length > 0 ? (
          attendeeArtists.map((artist) => (
            <>
              <article key={artist.id} className="artist-card" onDoubleClick={() => removeArtist(artist.id)}>
                <img src={artist.attributes.imageURL || 'https://i.imgur.com/5cQptOf.png'} className="band-image" alt={artist.attributes.name}/>
                <div className="artist-content">
                  <h3>{artist.attributes.name}</h3>
                  <ul>
                    {artist.attributes.start_time && artist.attributes.end_time ? (
                      <>
                        <li>Start Time: {artist.attributes.start_time}</li>
                        <li>End Time: {artist.attributes.end_time}</li>
                      </>
                    ) : (
                      <p>Times not available</p>
                    )}
                  </ul>
                </div>
              </article>
            </>
          ))
        ) : (
          <p>No Artists found for this Festival</p>
        )}
      </section>
      <section>
        <h2>Attending Users</h2>
      </section>
      <section className="festival-users-grid">
        {attendeeUsers?.length > 0 ? (
          attendeeUsers.map((user) => (
            <article key={user.id} className="user-card">
              <p>{`${user.attributes.first_name} ${user.attributes.last_name}`}</p>
              <p>{user.attributes.email}</p>
            </article>
          ))
        ) : (
          <p>No Users found for this Festival</p>
        )}
      </section>
      <footer className="footer">
        <p>Connect with me:</p>
        <div className="footer-links">
          <a
            href="https://github.com/Crosswolfv1"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/jeremiahross/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </footer>
    </main>
  );
}

export default Festival;
