import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { Godown } from './Godown'
import backend from "./config"

const GodownList = (props) => {
    const [godowns, setGodowns] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = window.localStorage.getItem("token");
        fetch(`${backend}/root-godowns`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'token': token }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.auth === false) navigate('/authenticate');
                else setGodowns(data)
            })
            .catch((error) => console.error("Error fetching godowns:", error));
    }, []);

    return (
        <div className={`z-3 rounded-lg fixed shadow-xl md:mt-2 flex flex-col items-center mx-auto glass max-h-[70vh] mb-2 md:max-h-[94vh] w-[94vw] left-[3vw] overflow-hidden md:max-w-md md:bottom-1 ${ props.isOpen ? "bottom-3 md:left-10" : "bottom-[-100%] md:left-[-100%]" } transition-all duration-500 px-4`}>
            <h1 className="text-xl my-5 text-teal-500 drop-shadow-xl">Godown List</h1>
            <div className="h-auto w-full overflow-y-scroll flex flex-col items-center shadow-inner mb-4 mt-2 rounded no-scrollbar">
                    {godowns.length > 0 ? (
                    godowns.map((godown) => (
                        <Godown key={godown.id} name={godown.name} id={godown.id} inty={0} onItemClick={props.selectItem} />
                    ))
                ) : (
                    <p>No godowns available</p>
                )}
            </div>
        </div>
    )
}

export default GodownList