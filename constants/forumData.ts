import type { ForumPost, ForumCategory } from '../types';

export const forumCategories: ForumCategory[] = ['Question for Team', 'Resource Share', 'Ideas Needed', 'General Discussion'];

export const getInitialForumPosts = (destination: string): ForumPost[] => [
  {
    id: `post-1-${destination.toLowerCase()}`,
    destination: destination,
    authorId: 'mr.christopher.harris@gmail.com',
    title: `Brainstorming Session: Improving Waste Management in ${destination}`,
    category: 'Ideas Needed',
    content: `Hey team,\n\nI was looking at our waste management data (q73a-q75a) and it seems like there's room for improvement in our recycling rates. Does anyone have ideas for local initiatives we could support or propose to boost recycling and composting efforts in ${destination}?`,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    comments: [
      {
        id: 'comment-1-1',
        authorId: 'atozenith@landsurveyorsunited.com',
        content: `Great point. I know of a local non-profit that does beach cleanups. Maybe we can partner with them for a community recycling drive? I'll find their contact info.`,
        timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
        reactions: [{ emoji: '👍', userId: 'blue.community.info@gmail.com' }],
      },
    ],
    reactions: [
      { emoji: '💡', userId: 'atozenith@landsurveyorsunited.com' }
    ],
    readBy: [],
  },
  {
    id: `post-2-${destination.toLowerCase()}`,
    destination: destination,
    authorId: 'atozenith@landsurveyorsunited.com',
    title: `Resource: ${destination}'s Official Tourism Development Plan`,
    category: 'Resource Share',
    content: `For anyone who needs it for the Governance & Planning section, I've bookmarked the official Tourism Development Plan for ${destination}. It has some great data on visitor statistics and future projects. Let me know if you have trouble accessing it!`,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    comments: [],
    reactions: [{ emoji: '❤️', userId: 'mr.christopher.harris@gmail.com' }],
    readBy: [],
  },
  {
    id: `post-3-${destination.toLowerCase()}`,
    destination: destination,
    authorId: 'blue.community.info@gmail.com',
    title: `Question: Who is the best contact for local energy consumption data in ${destination}?`,
    category: 'Question for Team',
    content: `I'm trying to fill out the Energy Management section (q60a-q62a) and am struggling to find a reliable source for our total energy consumption. Does anyone have a direct contact at the local utility or the county's sustainability office?`,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    comments: [],
    reactions: [],
    readBy: [],
  }
];
