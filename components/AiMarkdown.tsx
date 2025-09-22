import React from 'react';

const parseInlineFormatting = (text: string): React.ReactNode => {
    const parts = text.split('**');
    return parts.map((part, index) => {
        return index % 2 === 1 ? <strong key={index}>{part}</strong> : part;
    });
};

export const AiMarkdown: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  const renderedElements: React.ReactNode[] = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isListItem = line.startsWith('* ') || line.startsWith('- ');
    
    if (isListItem && !inList) {
      inList = true;
      const listItems = [];
      let j = i;
      while (j < lines.length && (lines[j].startsWith('* ') || lines[j].startsWith('- '))) {
        listItems.push(
          <li key={`li-${j}`} className="my-1">
            {parseInlineFormatting(lines[j].substring(2))}
          </li>
        );
        j++;
      }
      renderedElements.push(<ul key={`ul-${i}`} className="list-disc pl-6 my-2 space-y-1">{listItems}</ul>);
      i = j - 1; 
    } else if (!isListItem) {
      inList = false;
      if (line.startsWith('## ')) {
         renderedElements.push(<h3 key={`h3-${i}`} className="text-xl font-bold mt-4 mb-2 text-gray-200">{parseInlineFormatting(line.substring(3))}</h3>);
      } else if (line.startsWith('# ')) {
        renderedElements.push(<h2 key={`h2-${i}`} className="text-2xl font-bold mt-6 mb-3 text-white">{parseInlineFormatting(line.substring(2))}</h2>);
      } else if (line.trim() !== '') {
        renderedElements.push(<p key={`p-${i}`} className="my-2">{parseInlineFormatting(line)}</p>);
      }
    }
  }

  return <div className="text-gray-300 whitespace-pre-wrap">{renderedElements}</div>;
};
