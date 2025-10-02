import React from 'react';

interface GuideSectionContentProps {
  destination: string;
  content: string;
}

export const GuideSectionContent: React.FC<GuideSectionContentProps> = ({ destination, content }) => {
    const formattedContent = content.replace(/{destination}/g, `<strong>${destination}</strong>`);

  return (
    <div className="space-y-6 animate-fade-in border-t border-gray-700 pt-6" style={{animationDuration: '200ms'}}>
      <div 
        className="prose prose-invert max-w-none 
                   prose-h4:text-teal-300 prose-h4:font-semibold prose-h4:mb-2 prose-h4:mt-6 prose-h4:border-b prose-h4:border-gray-600 prose-h4:pb-1
                   prose-strong:text-gray-100 
                   prose-p:text-gray-300 prose-p:leading-relaxed 
                   prose-ul:pl-5 prose-ul:my-4 prose-ul:space-y-2
                   prose-ol:pl-5 prose-ol:my-4 prose-ol:space-y-2
                   prose-li:my-2 prose-li:marker:text-teal-400
                   prose-a:text-teal-400 hover:prose-a:text-teal-300 prose-a:font-medium prose-a:no-underline hover:prose-a:underline"
        dangerouslySetInnerHTML={{ __html: formattedContent }}
      />
    </div>
  );
};