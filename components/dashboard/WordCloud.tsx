import React, { useMemo } from 'react';
import type { Answers, Question } from '../../types';
import { QuestionType } from '../../types';

interface WordCloudProps {
  answers: Answers;
  questions: Question[];
}

// Simple list of common English stop words
const stopWords = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', "aren't", 'as', 'at', 
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 
  'can', "can't", 'cannot', 'com', 'could', "couldn't", 'did', "didn't", 'do', 'does', "doesn't", 'doing', "don't", 'down', 'during', 
  'each', 'else', 'ever', 'few', 'for', 'from', 'further', 'get', 'had', "hadn't", 'has', "hasn't", 'have', "haven't", 'having', 'he', "he'd", "he'll", "he's", 'her', 'here', "here's", 'hers', 'herself', 'him', 'himself', 'his', 'how', "how's",
  'i', "i'd", "i'll", "i'm", "i've", 'if', 'in', 'into', 'is', "isn't", 'it', "it's", 'its', 'itself',
  'just', 'k', 'let', "let's", 'like', 'me', 'more', 'most', "mustn't", 'my', 'myself', 
  'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 
  'r', 'same', 'shall', "shan't", 'she', "she'd", "she'll", "she's", 'should', "shouldn't", 'so', 'some', 'such', 
  'than', 'that', "that's", 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', "there's", 'these', 'they', "they'd", "they'll", "they're", "they've", 'this', 'those', 'through', 'to', 'too', 
  'under', 'until', 'up', 'very', 'was', "wasn't", 'we', "we'd", "we'll", "we're", "we've", 'were', "weren't", 'what', "what's", 'when', "when's", 'where', "where's", 'which', 'while', 'who', "who's", 'whom', 'why', "why's", 'will', 'with', "won't", 'would', "wouldn't", 
  'www', 'you', "you'd", "you'll", "you're", "you've", 'your', 'yours', 'yourself', 'yourselves'
]);

export const WordCloud: React.FC<WordCloudProps> = ({ answers, questions }) => {
  const wordFrequencies = useMemo(() => {
    const textCorpus = questions
      .filter(q => q.type === QuestionType.TEXTAREA && answers[q.id]?.value)
      .map(q => answers[q.id].value as string)
      .join(' ');

    if (!textCorpus.trim()) {
      return [];
    }

    const words = textCorpus
      .toLowerCase()
      .replace(/<[^>]*>?/gm, ' ') // remove html tags
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
      .split(/\s+/);

    const frequencies: { [key: string]: number } = {};
    for (const word of words) {
      if (word && word.length > 2 && !stopWords.has(word) && isNaN(Number(word))) {
        frequencies[word] = (frequencies[word] || 0) + 1;
      }
    }

    const sortedWords = Object.entries(frequencies)
      .filter(([, value]) => value > 1) // Only show words that appear more than once
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30) // Get top 30 words
      .map(([text, value]) => ({ text, value }));
      
    if (sortedWords.length === 0) return [];

    // Normalize font sizes for better visualization
    const maxFreq = sortedWords[0].value;
    const minFreq = sortedWords[sortedWords.length - 1].value;
    const minFontSize = 14;
    const maxFontSize = 48;

    return sortedWords.map(word => ({
        ...word,
        fontSize: minFreq === maxFreq ? 
            (minFontSize + maxFontSize) / 2 :
            minFontSize + ((word.value - minFreq) / (maxFreq - minFreq)) * (maxFontSize - minFontSize)
    })).sort(() => Math.random() - 0.5); // Randomize order for cloud effect

  }, [answers, questions]);

  if (wordFrequencies.length === 0) {
    return (
        <div className="flex items-center justify-center h-[300px] rounded-lg">
            <p className="text-gray-400">Not enough text data for a word cloud.</p>
        </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 p-4 min-h-[300px]">
      {wordFrequencies.map(({ text, fontSize }) => (
        <span
          key={text}
          style={{ fontSize: `${fontSize}px`, lineHeight: '1' }}
          className="font-bold text-gray-300 transition-colors hover:text-teal-400"
        >
          {text}
        </span>
      ))}
    </div>
  );
};