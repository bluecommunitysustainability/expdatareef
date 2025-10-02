import React, { useState } from 'react';
import { Modal } from '../Modal';
import type { UserProfile } from '../../types';

interface ConferenceViewProps {
    teamMembers: UserProfile[];
}

export const ConferenceView: React.FC<ConferenceViewProps> = ({ teamMembers }) => {
    const [isFullScreen, setIsFullScreen] = useState(false);

    // Mock statuses for demonstration
    const getStatus = (email: string) => {
        // Simple hash to get a pseudo-random but consistent status for each user
        const hash = email.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
        const statusIndex = Math.abs(hash) % 3;
        if (statusIndex === 0) return { text: 'In a call', color: 'bg-yellow-500' };
        if (statusIndex === 1) return { text: 'Away', color: 'bg-gray-500' };
        return { text: 'Available', color: 'bg-green-500' };
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 animate-fade-in h-full">
            <div className="md:w-1/3 space-y-4">
                <h3 className="text-xl font-bold text-white">Team Video Calls</h3>
                <p className="text-sm text-gray-400">
                    Schedule a team call, check who's available, or start an on-demand meeting in the virtual venue.
                </p>

                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                    <h4 className="font-semibold text-gray-200 mb-3">Team Status</h4>
                    <ul className="space-y-3 max-h-40 overflow-y-auto">
                        {teamMembers.map(member => {
                            const status = getStatus(member.email);
                            return (
                                <li key={member.id} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-300">{member.name}</span>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${status.color}`} title={status.text}></div>
                                        <span className="text-gray-400">{status.text}</span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                    <h4 className="font-semibold text-gray-200 mb-2">Upcoming Meetings</h4>
                    <ul className="space-y-3">
                        <li className="text-sm">
                            <p className="font-bold text-teal-400">Tomorrow - 10:00 AM</p>
                            <p className="text-gray-300">Weekly Sync: Goals Review</p>
                        </li>
                         <li className="text-sm">
                            <p className="font-bold text-teal-400">Next Friday - 2:00 PM</p>
                            <p className="text-gray-300">Deep Dive: Cultural Heritage Metrics</p>
                        </li>
                    </ul>
                    <button className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold py-2 px-4 rounded">
                        Schedule a New Call
                    </button>
                </div>
            </div>
            <div className="flex-1 min-h-[400px] md:min-h-0 flex flex-col">
                 <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-white">On-Demand Virtual Venue</h3>
                    <button onClick={() => setIsFullScreen(true)} className="p-2 text-sm text-gray-300 hover:text-white bg-gray-700 rounded-md flex items-center gap-2" title="Open in full screen">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" /></svg>
                         Break Out
                    </button>
                 </div>
                 <div className="w-full h-full border-2 border-gray-700 rounded-lg flex-1 bg-gray-900 flex items-center justify-center">
                    <p className="text-white text-lg">Click "Break Out" to join</p>
                 </div>
            </div>

            <Modal isOpen={isFullScreen} onClose={() => setIsFullScreen(false)} title="Virtual Venue" size="fullscreen">
                <div className="w-full h-full bg-gray-900">
                    <iframe 
                        src="https://www.mixily.com/venue/2095640925819505919/embed" 
                        className="w-full h-full border-0"
                        allow="camera; microphone; display-capture"
                        title="Virtual Venue (Full Screen)"
                    ></iframe>
                </div>
            </Modal>
        </div>
    );
};