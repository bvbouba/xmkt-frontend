import { BlockHeader } from "../blockHeader";

export function HeaderContainer({title,content}:{title?:string,content?:string}) {
  
    return (
        <>
        <BlockHeader title={title}/>
        <span className="g-comment">
        <p className="text-sm text-slate-500 ">
          {content}
        </p>
      </span>
        </>
    )
}

export default HeaderContainer;