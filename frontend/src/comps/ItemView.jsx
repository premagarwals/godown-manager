import React, { useState, useEffect } from "react";
import backend from "./config"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faCubesStacked, faCircleExclamation, faShirt, faChair, faGamepad, faToolbox, faMicrochip, faCircleInfo, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

const ItemView = (props) => {

  const [itemData, setItemData] = useState({
    "item_id": "663a9d18f1894f6e874f7cedd135e248",
    "name": "Samsung Smartphone 62",
    "quantity": 111,
    "category": "Electronics",
    "price": 102.4,
    "status": "in_stock",
    "godown_id": "f37e12cc6bbf437aba6672628f54efa5",
    "brand": "Samsung",
    "attributes": {
      "wattage": 56,
      "voltage": 220,
      "color": "AntiqueWhite"
    },
    "image_url": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-f62.jpg"
  })

  useEffect(() => {
    fetch(`${backend}/item/${props.item}`)
      .then((response) => response.json())
      .then((data) => setItemData(data))
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
    "warranty_years": "Warranty",

    "dimensions": "Dimension",
    "color": "Colour",

    "size": "Size",

    "wattage": "Wattage",
    "voltage": "Voltage",
  }
  return (
    <div className='h-full md:h-[96vh] mt-3 w-[95vw] mx-auto md:my-[2vh] ml-3 bg-slate-100 flex flex-col justify-between items-center p-3'>
      <img src={itemData.image_url} alt={itemData.name} className="max-w-32 max-h-32" />
      <h2>{itemData.name}</h2>
      <h4>{itemData.brand}</h4>
      <div className="w-full m-auto rounded overflow-hidden">
        <ul className="flex w-full justify-between">
          <li className={`w-1/3 text-center ${stockColor}`}>
            <FontAwesomeIcon icon={faCubesStacked} />
            <span> </span>{itemData.quantity}
          </li>
          <li className={`w-1/3 text-center bg-amber-100 ${billColor}`}>
            <FontAwesomeIcon icon={faDollarSign} />
            <span> </span>{itemData.price}</li>
          <li className="w-1/3 text-center bg-teal-200">
            <FontAwesomeIcon icon={
              itemData.category === "Clothing" ? faShirt :
                itemData.category === "Tools" ? faToolbox :
                  itemData.category === "Toys" ? faGamepad :
                    itemData.category === "Furniture" ? faChair :
                      itemData.category === "Electronics" ? faMicrochip :
                        faCircleInfo
            } />
          </li>
        </ul>
      </div>
      <ul>
        {Object.entries(itemData.attributes).map(([key, value], index) => (
          <li key={index}>
            <strong>{correct[key]}:</strong> {String(value)}
          </li>
        ))}
      </ul>
      <div className={`w-1/3 text-center ${stockColor}`}>
        <FontAwesomeIcon icon={
          itemData.status === "in_stock" ? faCircleCheck : faCircleExclamation
        } />
        <span> </span>{itemData.status === "in_stock" ? "Available" : "Out of Stock"}
      </div>
    </div>

  )
}

export default ItemView