import React, { useState, useEffect } from "react";
import "./Homepage.css";
import { Link } from "react-router-dom";

const Homepage = () => {
  const [festivalArray, setFestivalArray] = useState([]);
  const [filteredFestivalArray, setFilteredFestivalArray] = useState([]);
  const [nameFilter, setNameFilter] = useState("");

  // Fetch festivals from the API
  useEffect(() => {
    fetch("http://localhost:3000/api/v1/festivals")
      .then((response) => response.json())
      .then((festivalData) => {
        const festivals = festivalData.data; 
        setFestivalArray(festivals); 
        setFilteredFestivalArray(festivals); 
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
