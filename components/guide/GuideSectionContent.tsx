import React from 'react';

interface GuideSectionContentProps {
  destination: string;
  content: string;
}

export const GuideSectionContent: React.FC<GuideSectionContentProps> = ({ destination, content }) => {
    const formattedContent = content.replace(/{destination}/g, destination);

  return (
    <div className="space-y-6 animate-fade-in border-t border-gray-700 pt-6" style={{animationDuration: '200ms'}}>
      <div 
        className="prose prose-invert prose-p:text-gray-300 prose-li:text-gray-300 prose-strong:text-white prose-a:text-teal-400 hover:prose-a:text-teal-300"
        dangerouslySetInnerHTML={{ __html: formattedContent }}
      />
    </div>
  );
};