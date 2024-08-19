import React from 'react';
import ItemDisplay from './LinkDisplay';


interface linkprops {
  label:string, 
  icon:string | null, 
  to:string 
}
interface Props {
  links:linkprops[]
}


const ListLinks = (props:Props) => {
  const {links} = props

  return (
    <div>
        {links.map((link,index) =>
           <ItemDisplay key={index} label={link.label} icon={link.icon} to={link.to} />
      )}
      </div>
  )
}

export default ListLinks;



