import React, { useState, useEffect } from "react";
import { Godown } from "./comps/Godown";
import backend from "./comps/config"

const App = () => {
  const [godowns, setGodowns] = useState([]);

  useEffect(() => {
    fetch(`${backend}/root-godowns`)
      .then((response) => response.json())
      .then((data) => setGodowns(data))
      .catch((error) => console.error("Error fetching godowns:", error));
  }, []);

  return (
    <div className="flex flex-col items-center mt-6 bg-teal-50 h-full ">
      <h1 className="text-xl my-5 text-teal-500 drop-shadow-xl">Godown List</h1>
      {godowns.length > 0 ? (
        godowns.map((godown) => (
          <Godown key={godown.id} name={godown.name} id={godown.id} inty={0}/>
        ))
      ) : (
        <p>No godowns available</p>
      )}
    </div>
  );
};

export default App;
