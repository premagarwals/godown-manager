import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import backend from "./config"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faCubesStacked, faCircleExclamation, faShirt, faChair, faGamepad, faToolbox, faMicrochip, faCircleInfo, faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

const ItemView = (props) => {
  const placeholderData = {
    "item_id": null,
    "name": "Product Name",
    "quantity": 0,
    "category": "Category",
    "price": 0.00,
    "status": "out_of_stock",
    "godown_id": "gid",
    "brand": "Brand",
    "location":"Nan",
    "attributes": {
      "color": "NaN",
      "size": "NaN",
      "type": "NaN"
    },
    "image_url": "https://psediting.websites.co.in/obaju-turquoise/img/product-placeholder.png"
  }
  const [itemData, setItemData] = useState(placeholderData);

  const navigate = useNavigate();

  useEffect(() => {
    setItemData(placeholderData);
    const token = window.localStorage.getItem("token");
    fetch(`${backend}/item/${props.item}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 'token': token }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.auth===false) navigate('/authenticate');
        else setItemData(data)})
      .catch((error) => console.error("Error fetching godowns:", error));
  }, [props.item]);

  const textColor = itemData.status === "in_stock" ? "text-teal-700" : "text-teal-500";
  const stockColor = itemData.status === "in_stock" ? "bg-green-100 text-green-500" : "bg-red-100 text-red-400";
  const billColor = itemData.status === "in_stock" ? "text-amber-500" : "text-amber-300";

  const correct = {
    "age_range": "Age Range",
    "material": "Material",
    "battery_required": "Battery Required",

    "type": "Type",
    "warranty_years": "Warranty Years",

    "dimensions": "Dimension",
    "color": "Colour",

    "size": "Size",

    "wattage": "Wattage",
    "voltage": "Voltage",

  }

  return (
    <div className='h-[80vh] md:h-[90vh] w-[92vw] md:w-[98vw] mx-auto bg-slate-100 flex flex-col justify-between items-center p-3 rounded-lg text-center'>
      <div className="max-w-5/12 w-[50vw] h-[50vw] md:w-96 md:h-96 rounded-lg overflow-hidden bg-slate-200">
          <img src={itemData.image_url} alt={`Trying to fetch <${itemData.name}> image...`} className="text-center text-zinc-400 min-w-full min-h-full" />
        </div>
      <div className="w-full h-auto flex flex-col items-center justify-center px-2 gap-2 m-2">
        <div className="p-2 text-xs md:text-md flex flex-col justify-center items-center md:w-full">
          <h2 className="text-lg text-teal-600 md:text-2xl text-center">{itemData.name}</h2>
          <h4 className="text-sm text-zinc-600">{itemData.brand}</h4>
        </div>
        <ul className="w-48 md:w-full h-32 md:h-auto bg-slate-300 rounded-lg overflow-hidden text-xs md:text-md flex flex-col md:flex-row gap-1">
          {Object.entries(itemData.attributes).map(([key, value], index) => (
            <li key={index} className={`h-1/3 md:h-full md:w-1/3 bg-slate-200 p-2 flex md:flex-col gap-1 justify-center items-center`}>
              <p className="text-teal-500 text-sm md:text-lg"><strong>{correct[key]} <span className="md:hidden">:</span></strong> </p> <p className="font-light text-zinc-600 md:text-base"> {String(value) === "true" ? <FontAwesomeIcon icon={faCircleCheck} /> : String(value) === "false" ? <FontAwesomeIcon incon={faCircleXmark} /> : String(value)}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full m-auto rounded overflow-hidden">
        <ul className="flex w-full justify-between">
          <li className={`w-1/3 text-center ${stockColor} flex flex-col items-center justify-center p-1`}>
            <h2 className="md:text-lg">Quantity</h2>
            <p className="text-xs md:text-base"><FontAwesomeIcon icon={faCubesStacked} />
            <span> </span>{itemData.quantity}</p>
          </li>
          <li className={`w-1/3 text-center bg-amber-100 ${billColor} flex flex-col items-center justify-center p-1`}>
           <h2 className="md:text-lg">Price</h2>
           <p className="text-xs md:text-base"> <FontAwesomeIcon icon={faDollarSign} />
            <span> </span>{itemData.price}</p>
            </li>
          <li className="w-1/3 text-center bg-teal-200 p-1">
          <h2 className="text-sm md:text-lg">{String(itemData.category).toUpperCase()}</h2>
          <p className="text-xs md:text-base">
            <FontAwesomeIcon icon={
              itemData.category === "Clothing" ? faShirt :
                itemData.category === "Tools" ? faToolbox :
                  itemData.category === "Toys" ? faGamepad :
                    itemData.category === "Furniture" ? faChair :
                      itemData.category === "Electronics" ? faMicrochip :
                        faCircleInfo
            } /></p>
          </li>
        </ul>
      </div>
      <div className={`max-w-96 text-center ${stockColor} rounded mt-1 w-full`}>
        <FontAwesomeIcon icon={
          itemData.status === "in_stock" ? faCircleCheck : faCircleExclamation
        } />
        <span> </span>{itemData.status === "in_stock" ? "Available" : "Out of Stock"}
      </div>
      <h3 className="text-xs mt-4 text-zinc-400">{itemData.location}</h3>
    </div>

  )
}

export default ItemView