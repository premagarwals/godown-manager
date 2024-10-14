import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Item } from "./Item";
import backend from "./config"

export const Godown = (props) => {
    const [subGodowns, setSubGodowns] = useState([]);
    const [items, setItems] = useState([]);
    const [opened, setOpened] = useState(false);
    const [faDir, setFaDir] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const getColorClasses = (inty) => {
        const colors = {
            0: ['bg-teal-100', 'border-teal-300', 'bg-teal-200'],
            100: ['bg-teal-200', 'border-teal-400', 'bg-teal-300'],
        };
        return colors[inty] || ['bg-slate-100', 'border-slate-300', 'bg-slate-200'];
    };

    const [color, setColor] = useState(getColorClasses(props.inty));

    const getSubGodowns = async () => {
        var token = window.localStorage.getItem("token");
        setIsLoading(true);
        try {
            const response = await fetch(`${backend}/sub-godowns/${props.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'token': token }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setIsLoading(false);
            if (data.auth===false) navigate('/authenticate');
            else return data;
        } catch (error) {
            console.error(error);
        }
    };

    const getItems = async () => {
        var token = window.localStorage.getItem("token");
        setIsLoading(true);
        try {
            const response = await fetch(`${backend}/godown-items/${props.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'token': token }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setIsLoading(false);
            if (data.auth===false) navigate('/authenticate');
            else return data;
        } catch (error) {
            console.error(error);
        }
    };

    const toggleSubGodowns = async () => {
        try {
            if (subGodowns.length === 0 && items.length === 0) {
                const godown = await getSubGodowns();
                const items = await getItems();
                setSubGodowns(godown);
                setItems(items);
                setOpened(true);
            } else {
                setSubGodowns([]);
                setItems([]);
                setOpened(false);
            }
        } catch (error) {
            console.error(error);
        }
        setFaDir((faDir + 180) % 360);
        setOpened(!opened)
    };

    return (
        <div className={`w-11/12 p-1 ${color[0]} cursor-pointer transition-all flex flex-col  items-end rounded-lg mb-2 shadow-md`}>
            <div className={`w-full rounded-lg border-b-2 border-r-2 ${color[1]} ${color[2]} p-3 text-teal-700 flex justify-between items-center mb-4 shadow-lg hover:scale-105 transition-all`} onClick={toggleSubGodowns}>
                <h2>{props.name}</h2>
                <FontAwesomeIcon className={`transition-all ${isLoading ? 'fa-spin' : ''}`}  icon={isLoading ? faSpinner : faCaretDown} rotation={faDir} />
            </div>
            {
                items.map((item) => (
                    <Item key={item.item_id} name={item.name} id={item.item_id} status={item.status} price={item.price} quantity={item.quantity} category={item.category} onClick={props.onItemClick} />
                )
                )}
            {subGodowns.map((subGodown) => (
                <Godown key={subGodown.id} name={subGodown.name} id={subGodown.id} inty={(props.inty + 100) % 200} onItemClick={props.onItemClick} />
            ))}
            {
                items.length === 0 && subGodowns.length === 0 && opened ? <p className="ml-6"> Nothing found here...</p> : <p></p>
            }

        </div>
    );
};
