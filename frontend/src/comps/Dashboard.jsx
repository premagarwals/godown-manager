import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { Godown } from "./Godown";
import backend from "./config"
import ItemView from "./ItemView";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";


const Dashboard = (props) => {
  const [godowns, setGodowns] = useState([]);
  const [activeItem, setActiveItem] = useState("")

  const navigate = useNavigate();
  useEffect(() => {
    fetch(`${backend}/root-godowns`)
      .then((response) => response.json())
      .then((data) => setGodowns(data))
      .catch((error) => console.error("Error fetching godowns:", error));
  }, []);

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  const unAuth = () => {
    props.unAuth();
    navigate('/authenticate');
  }

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden justify-between">
    <ItemView item={activeItem}/>
    <div className="flex flex-col items-center m-[2vh] mx-auto bg-teal-50 max-h-64 mb-2 md:max-h-[96vh] w-[92vw] overflow-hidden md:max-w-[40vw] lg:max-w-md px-4">
      <h1 className="text-xl my-5 text-teal-500 drop-shadow-xl hidden md:block">Godown List</h1>
      <div className="h-auto w-full overflow-y-scroll flex flex-col items-center shadow-inner mb-4 mt-2 rounded no-scrollbar">
        <button  className="w-7/12 rounded-lg border-b-2 border-r-2 bg-red-200 border-red-300 p-3 text-red-600 my-4 shadow-lg hover:scale-105 transition-all" onClick={unAuth}>Lock Godown <span> </span><FontAwesomeIcon icon={faLock}/></button>
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

export default Dashboard;
