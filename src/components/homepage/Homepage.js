import React, { useState, useEffect } from "react";
import "./Homepage.css";
import { Link } from "react-router-dom";

const Homepage = () => {
  const [festivalArray, setFestivalArray] = useState([]);
  const [filteredFestivalArray, setFilteredFestivalArray] = useState([]);
  const [nameFilter, setNameFilter] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/festivals")
      .then((response) => response.json())
      .then((festivalData) => {
        const festivals = festivalData.data; 

        const formattedFestivals = festivals.map(festival => {
          const startDate = new Date(festival.attributes.start_time);
          const endDate = new Date(festival.attributes.end_time);

          festival.attributes.start_time = startDate.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          });

          festival.attributes.end_time = endDate.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          });

          return festival;
        });

        setFestivalArray(formattedFestivals);
        setFilteredFestivalArray(formattedFestivals);
      })
      .catch((error) => console.error("Error fetching festivals:", error));
  }, []);

  useEffect(() => {
      const results = festivalArray.filter((festival) =>
        festival.attributes.name.toLowerCase().includes(nameFilter.toLowerCase()))
      setFilteredFestivalArray(results)
    }, [nameFilter, festivalArray]);

  return (
    <main>
      <header>
        <Link to="/">
          <h1>Show Manager</h1>
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
        {filteredFestivalArray.length ? (
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
    </main>
  );
};

export default Homepage;
