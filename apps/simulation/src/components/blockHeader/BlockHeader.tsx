
export function BlockHeader({title}:{title?:string}) {
    return ( 
        <div className="pb-2">
        <span className="g-title text-2xl uppercase text-gray-500">
          {title}
        </span>
        </div>
     );
}

export default BlockHeader;