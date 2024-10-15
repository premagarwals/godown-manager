import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEraser } from "@fortawesome/free-solid-svg-icons"
import { Item } from './Item'
import backend from "./config"

const Search = (props) => {
    const [searchParam, setSearchParam] = useState("");
    const [items, setItems] = useState([]);
    const [fetchStatus, setFetchStatus] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = window.localStorage.getItem("token");
        if (searchParam.length > 2) {
            const fetchData = async () => {
                setFetchStatus(true);
                try {
                    const response = await fetch(`${backend}/search/${searchParam}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ 'token': token }),
                    });
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    const data = await response.json();
                    setFetchStatus(false);
                    if (data.auth === false) navigate('/authenticate');
                    else setItemData(data)
                    setItems(data);
                } catch (error) {
                    console.error("Fetch error:", error);
                }
            };

            fetchData();
        }
    }, [searchParam]);
    return (
        <div className={`w-5/6 md:w-[500px] glass shadow-xl z-5 h-4/6 rounded-lg fixed flex flex-col gap-3 p-3 ${props.isOpen ? "top-32" : "-top-full"} left-2/4 -translate-x-2/4 z-10 transition-all duration-500`}>
            <div className='h-[10%] bg-teal-50 w-full rounded-md flex'>
                <input type="text" name="" id="" className='w-5/6 rounded-md p-3 outline-none text-teal-500' value={searchParam} onChange={(e) => setSearchParam(e.target.value)} />
                <FontAwesomeIcon icon={faEraser} className="text-teal-300 w-1/6 my-auto" onClick={() => { setItems([]); setSearchParam("") }} />
            </div>
            <div className="h-auto w-full p-5 overflow-y-scroll overflow-x-visible flex flex-col items-center shadow-inner mb-4 mt-2 rounded no-scrollbar">
                {
                    items.map((item) => (
                        <Item key={item.item_id} name={item.name} id={item.item_id} status={item.status} price={item.price} quantity={item.quantity} category={item.category} onClick={props.selectItem} />
                    ))
                }
                {fetchStatus ? "Loading" : ""}
            </div>
        </div>
    )
}

export default Search