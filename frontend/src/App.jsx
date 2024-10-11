import React, { useState, useEffect } from "react";
import { Godown } from "./comps/Godown";
import backend from "./comps/config"
import ItemView from "./comps/ItemView";

const App = () => {
  const [godowns, setGodowns] = useState([]);
  const [activeItem, setActiveItem] = useState("663a9d18f1894f6e874f7cedd135e248")

  useEffect(() => {
    fetch(`${backend}/root-godowns`)
      .then((response) => response.json())
      .then((data) => setGodowns(data))
      .catch((error) => console.error("Error fetching godowns:", error));
  }, []);

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden justify-between">
    <ItemView item={activeItem}/>
    <div className="flex flex-col items-center m-[2vh] bg-teal-50 max-h-96 md:max-h-[96vh] w-[95vw] overflow-hidden md:max-w-[40vw] lg:max-w-md px-4">
      <h1 className="text-xl my-5 text-teal-500 drop-shadow-xl hidden md:block">Godown List</h1>
      <div className="h-auto w-full overflow-y-scroll flex flex-col items-center shadow-inner mb-4 mt-2 rounded no-scrollbar">
        {godowns.length > 0 ? (
          godowns.map((godown) => (
            <Godown key={godown.id} name={godown.name} id={godown.id} inty={0} onItemClick={handleItemClick}/>
          ))
        ) : (
          <p>No godowns available</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default App;
