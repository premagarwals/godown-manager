import React, { useState } from "react";
import GodownList from "./GodownList";
import ItemView from "./ItemView";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStore, faStoreSlash, faLock, faSearch } from "@fortawesome/free-solid-svg-icons"
import Search from "./Search";

const Dashboard = (props) => {
  const [activeItem, setActiveItem] = useState();
  const [isExploring, setIsExploring] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const selectItem = (item) => {
    setActiveItem(item);
  };

  const unAuth = () => {
    props.unAuth();
    navigate('/authenticate');
  }

  const closeIfOpen = () => {
    if (isExploring) setIsExploring(false);
    if (isSearching) setIsSearching(false);
  }

  return (
    <>
      <div onClick={closeIfOpen}>
        <div className="z-30 h-12 my-[1vh] bg-teal-400 rounded-lg w-[94vw] mx-[3vw] md:mx-auto md:w-[98vw] mx-[1vw] flex justify-between items-center p-3">
          <h2 className="text-teal-200 float-left ">Godown Manager</h2>
          <div className="h-full w-fit flex gap-3 items-center">
            <button className="float-right bg-red-50 text-red-400 rounded p-1 px-4" onClick={unAuth}> <span className="hidden md:inline mr-1">Lock Godown  </span><span> </span><FontAwesomeIcon icon={faLock} /></button>
            <FontAwesomeIcon icon={faSearch} className="text-teal-300 p-2 rounded-2xl my-1 bg-teal-100" onClick={() => setIsSearching(!isSearching)}/>
            <FontAwesomeIcon icon={isExploring ? faStoreSlash : faStore} className="text-teal-100 transition-all text-2xl float-right my-1" onClick={() => setIsExploring(!isExploring)} />
          </div>
        </div>
        <ItemView item={activeItem} />
      </div>
      <Search isOpen={isSearching} selectItem={selectItem}/>
      <GodownList unAuth={unAuth} selectItem={selectItem} isOpen={isExploring} />
    </>
  );
};

export default Dashboard;
