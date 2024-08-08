import renderToString from "preact-render-to-string";

export function generateTHBadge(text: string, url: string) {
  return renderToString(
    <div
      className="th-badge-wrapper"
      data-a-target="th-badge-cnt"
      data-provider="thehitless"
    >
      <span className="chat-badge user-thehitless" data-a-target="th-badge-txt">
        <img src={url} width={20} height={20} alt={text} />
      </span>
      <div className="th-tooltip" role="tooltip">{text}</div>
    </div>
  );
}
