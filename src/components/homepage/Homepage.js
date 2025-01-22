import React, { useState, useEffect } from "react";
import "./Homepage.css";
import { Link, useNavigate } from 'react-router-dom'

const Homepage = () => {
  const [festivalArray, setFestivalArray] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/festivals")
      .then(response => response.json())
      .then(festivalData => setFestivalArray(festivalData))
      .catch(error => console.log(error));
  }, []);
  
  return (
    <main>
      <header>  
        <h1>Show Manager</h1>
      </header>
      <section className="festival-grid">
        {festivalArray?.data?.map((festival, index) => {
          return (
            <>
            <article key={index}>
              <Link to={`/festivals/${festival.id}`}>
                <h2>{festival.attributes.name}</h2>
                <img src={festival.attributes.imageURL} alt={festival.attributes.name} />
              </Link>
              <ul>
                <li>Start Date: {festival.attributes.start_time}</li>
                <li>End Date: {festival.attributes.end_time}</li>
              </ul>
            </article>
            </>
        )})}
      </section>
      <footer>
        <p> footer placeholders be like</p>
      </footer>
    </main>
  );
}
export default Homepage;
