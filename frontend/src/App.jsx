import React, { useState, useEffect } from "react";
import { Godown } from "./comps/Godown";
import backend from "./comps/config"
import ItemView from "./comps/ItemView";

const App = () => {
  const [godowns, setGodowns] = useState([]);

  useEffect(() => {
    fetch(`${backend}/root-godowns`)
      .then((response) => response.json())
      .then((data) => setGodowns(data))
      .catch((error) => console.error("Error fetching godowns:", error));
  }, []);

  return (
    <div className="h-screen w-screen flex overflow-hidden">
    <div className="flex flex-col items-center m-[2vh] bg-teal-50 max-h-[96vh] overflow-hidden max-w-sm px-4">
      <h1 className="text-xl my-5 text-teal-500 drop-shadow-xl">Godown List</h1>
      <div className="h-auto w-full overflow-y-scroll flex flex-col items-center shadow-inner mb-4 rounded no-scrollbar">
        {godowns.length > 0 ? (
          godowns.map((godown) => (
            <Godown key={godown.id} name={godown.name} id={godown.id} inty={0} />
          ))
        ) : (
          <p>No godowns available</p>
        )}
      </div>
    </div>
    <ItemView />
    </div>
  );
};

export default App;
