export function ParagraphContainer({title,content}:{title?:string,content?:string}) {
  
    return (
        <div className={title ? "pt-5" : ""}>
        <span className="g-subtitle text-xl text-blue-700">{title}</span>
        <div className={`g-comment ${(title)?"pl-5":""}`}>
          <p className="text-sm text-slate-500">
            {content}
          </p>
        </div>
      </div>
    )
}

export default ParagraphContainer;