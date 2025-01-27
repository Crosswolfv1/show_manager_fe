import React from "react";
import Homepage from "./components/homepage/Homepage";
import Festival from "./components/festival/Festival"
import { Routes, Route} from 'react-router-dom';

const App = () => {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/festivals/:festivalId" element={<Festival/>} />
      </Routes>
    </div>
  );
};

export default App;
