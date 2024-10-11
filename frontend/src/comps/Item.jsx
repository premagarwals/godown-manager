import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight, faDollarSign, faCubesStacked, faCircleExclamation, faShirt, faChair, faGamepad, faToolbox, faMicrochip, faCircleInfo } from '@fortawesome/free-solid-svg-icons';

export const Item = (props) => {

    const textColor = props.status === "in_stock" ? "text-teal-700" : "text-teal-500";
    const stockColor = props.status === "in_stock" ? "bg-green-100 text-green-500" : "bg-red-100 text-red-400";
    const billColor = props.status === "in_stock" ? "text-amber-500" : "text-amber-300";
    return (
        <div className={`w-[95%] m-auto border-b-2 border-r-2 border-teal-400 bg-teal-300 shadow-md mb-4 p-3 flex flex-col rounded-lg justify-between items-center ${textColor} transition-all hover:scale-110 hover:-translate-y-1 hover:shadow-lg hover:rotate-1 hover:z-10`}>
            <p className="mb-2 inline"><h2>{props.name} <FontAwesomeIcon icon={faCaretRight} /></h2></p>

            <div className="w-full m-auto rounded overflow-hidden">
                <ul className="flex w-full justify-between">
                    <li className={`w-1/3 text-center ${stockColor}`}>
                        <FontAwesomeIcon icon={
                            props.status === "in_stock" ? faCubesStacked : faCircleExclamation
                        } />
                        <span> </span>{props.quantity}
                    </li>
                    <li className={`w-1/3 text-center bg-amber-100 ${billColor}`}>
                        <FontAwesomeIcon icon={faDollarSign} />
                        <span> </span>{props.price}</li>
                    <li className="w-1/3 text-center bg-teal-200">
                        <FontAwesomeIcon icon={
                            props.category === "Clothing" ? faShirt :
                                props.category === "Tools" ? faToolbox :
                                    props.category === "Toys" ? faGamepad :
                                        props.category === "Furniture" ? faChair :
                                            props.category === "Electronics" ? faMicrochip :
                                                faCircleInfo
                        } />
                    </li>
                </ul>
            </div>
        </div>
    );
};
