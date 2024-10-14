import React, { useState } from "react";
import GodownList from "./GodownList";
import ItemView from "./ItemView";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStore, faStoreSlash, faLock } from "@fortawesome/free-solid-svg-icons"

const Dashboard = (props) => {
  const [activeItem, setActiveItem] = useState();
  const [isOpen, setIsOpen] = useState(false);

  const selectItem = (item) => {
    setActiveItem(item);
  };

  const unAuth = () => {
    props.unAuth();
    navigate('/authenticate');
  }

  const closeIfOpen = () => {
    if (isOpen) setIsOpen(false);
  }

  return (
    <>
      <div onClick={closeIfOpen}>
        <div className="h-12 my-[1vh] bg-teal-400 rounded-lg w-[94vw] mx-[3vw] md:mx-auto md:w-[98vw] mx-[1vw] flex justify-between items-center p-3">
          <h2 className="text-teal-200 float-left ">Godown Manager</h2>
          <div>
            <FontAwesomeIcon icon={isOpen ? faStoreSlash : faStore} className="text-teal-100 transition-all text-2xl float-right my-1" onClick={() => setIsOpen(!isOpen)} />
            <button className="float-right mr-5 bg-red-50 text-red-400 rounded p-1 px-4" onClick={unAuth}> <span className="hidden md:inline mr-1">Lock Godown  </span><span> </span><FontAwesomeIcon icon={faLock} /></button>
          </div>
        </div>
        <ItemView item={activeItem} />
      </div>
      <GodownList unAuth={unAuth} selectItem={selectItem} isOpen={isOpen} />
    </>
  );
};

export default Dashboard;
