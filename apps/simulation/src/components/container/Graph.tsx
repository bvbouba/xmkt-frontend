
export function GraphContainer({children,className}:{children?: React.ReactNode;className?:string}) {
  
    return (
        <div className={`col-graph border border-gray-400 p-4 m-4 max-h-72 ${className}`}>
            {children}
        </div>
    )
}

export default GraphContainer;