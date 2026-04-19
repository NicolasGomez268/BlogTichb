import { Fragment } from "react";

const BOLD_PATTERN = /\*\*(.*?)\*\*/g;

function renderInlineBold(text) {
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = BOLD_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    parts.push(
      <strong key={`bold-${match.index}`} className="font-extrabold text-white">
        {match[1]}
      </strong>,
    );

    lastIndex = BOLD_PATTERN.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

export function renderRichText(content) {
  if (!content) {
    return null;
  }

  const lines = content.split("\n");

  return lines.map((line, index) => (
    <Fragment key={`line-${index}`}>
      {renderInlineBold(line)}
      {index < lines.length - 1 ? <br /> : null}
    </Fragment>
  ));
}