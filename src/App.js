import React from "react";
import Homepage from "./components/homepage/Homepage";
import Festival from "./components/festival/Festival"
import { Routes, Route} from 'react-router-dom';

const App = () => {

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/festivals/:festivalId" element={<Festival/>} />
      </Routes>
    </div>
  );
};

export default App;
