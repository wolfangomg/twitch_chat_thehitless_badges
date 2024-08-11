import renderToString from "preact-render-to-string";

export function generateTHBadge(text: string, url: string, user: string) {
  return renderToString(
    <div
      className="th-badge-wrapper"
      data-a-target="th-badge-cnt"
      data-provider="thehitless"
    >
      <span className="chat-badge user-thehitless" data-a-target="th-badge-txt">
        <a href={`https://thehitless.com/runners/${user}/`} target="_blank">
          <img src={url} width={20} height={20} alt={text} />
        </a>
      </span>
      <div className="th-tooltip" role="tooltip"> 
        <div className="th-tooltip-data">
          <img src={url} width={64} height={64} alt={text} />
          <span>TheHitless - {text}</span>
        </div>
      </div>
    </div>
  );
}
