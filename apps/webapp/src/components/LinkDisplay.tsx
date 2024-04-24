import React from 'react';

interface linkprops {
  label:string, 
  icon:string | null, 
  to:string 
}


const ItemDisplay = ({icon:Icon, ...props}:linkprops) => {

  return (
    <div>
     {props.label}
     </div>
  )
}

export default ItemDisplay;
