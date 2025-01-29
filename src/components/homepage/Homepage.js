import React, { useState, useEffect } from "react";
import "./Homepage.css";
import { Link } from "react-router-dom";
import homeImage from '../../assets/wordart.png'

const Homepage = () => {
  const [festivalArray, setFestivalArray] = useState([]);
  const [filteredFestivalArray, setFilteredFestivalArray] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [apiError, setApiError] = useState(false); // State to track API errors

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/festivals")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((festivalData) => {
        const festivals = festivalData.data;

        const formattedFestivals = festivals.map((festival) => {
          const startDate = new Date(festival.attributes.start_time);
          const endDate = new Date(festival.attributes.end_time);

          festival.attributes.start_time = startDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          });

          festival.attributes.end_time = endDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          });

          return festival;
        });

        setFestivalArray(formattedFestivals);
        setFilteredFestivalArray(formattedFestivals);
        setApiError(false); // Clear any previous API errors
      })
      .catch((error) => {
        console.error("Error fetching festivals:", error);
        setApiError(true); // Set API error to true
      });
  }, []);

  useEffect(() => {
    const results = festivalArray.filter((festival) =>
      festival.attributes.name.toLowerCase().includes(nameFilter.toLowerCase())
    );
    setFilteredFestivalArray(results);
  }, [nameFilter, festivalArray]);

  return (
    <main>
      <header>
        <Link to="/">
        <img src={homeImage} alt="home button" />
        </Link>
        <input
          className="festival-search"
          placeholder={`Search`}
          type="text"
          value={nameFilter}
          onChange={(event) => setNameFilter(event.target.value)}
        />
      </header>
      <section className="festival-grid">
        {apiError ? ( // Check if there was an API error
          <p>Error fetching festivals. Please try again later.</p>
        ) : filteredFestivalArray.length ? (
          filteredFestivalArray.map((festival, index) => (
            <article key={index}>
              <Link to={`/festivals/${festival.id}`}>
                <h2>{festival.attributes.name}</h2>
                <img
                  src={festival.attributes.imageURL}
                  alt={festival.attributes.name}
                />
              </Link>
              <ul>
                <li>Start Date: {festival.attributes.start_time}</li>
                <li>End Date: {festival.attributes.end_time}</li>
              </ul>
            </article>
          ))
        ) : (
          <p>No festivals found</p>
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
};

export default Homepage;
