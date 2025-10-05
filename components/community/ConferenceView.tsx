import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '../Modal';
import type { UserProfile, ScheduledEvent } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface ConferenceViewProps {
    teamMembers: UserProfile[];
    destination: string;
}

export const ConferenceView: React.FC<ConferenceViewProps> = ({ teamMembers, destination }) => {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [tick, setTick] = useState(0);

    // Event scheduling state
    const [events, setEvents] = useLocalStorage<ScheduledEvent[]>(`conference-events_${destination}`, []);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventDate, setNewEventDate] = useState('');
    const [newEventTime, setNewEventTime] = useState('');

    const getStatus = (email: string, currentTimeTick: number) => {
        const hash = email.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
        const statusIndex = (Math.abs(hash) + currentTimeTick) % 7; 
        if (statusIndex === 0) return { text: 'In a call', color: 'bg-yellow-500' };
        if (statusIndex === 1) return { text: 'Away', color: 'bg-gray-500' };
        return { text: 'Available', color: 'bg-green-500' };
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setTick(t => t + 1);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const statuses = useMemo(() => {
        return teamMembers.reduce((acc, member) => {
            acc[member.id] = getStatus(member.email, tick);
            return acc;
        }, {} as Record<string, { text: string; color: string }>);
    }, [teamMembers, tick]);
    
    const sortedEvents = useMemo(() => {
        return [...events].sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
    }, [events]);

    const handleScheduleCall = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEventTitle || !newEventDate || !newEventTime) {
            alert("Please fill out all fields to schedule a call.");
            return;
        }
        const newEvent: ScheduledEvent = {
            id: `event-${Date.now()}`,
            title: newEventTitle,
            date: newEventDate,
            time: newEventTime,
        };
        setEvents(prev => [...prev, newEvent]);
        setNewEventTitle('');
        setNewEventDate('');
        setNewEventTime('');
    };

    const handleDeleteEvent = (eventId: string) => {
        if (window.confirm("Are you sure you want to delete this scheduled call?")) {
            setEvents(prev => prev.filter(event => event.id !== eventId));
        }
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
                            const status = statuses[member.id];
                            return (
                                <li key={member.id} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-300">{member.name}</span>
                                    {status && (
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${status.color}`} title={status.text}></div>
                                            <span className="text-gray-400">{status.text}</span>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <form onSubmit={handleScheduleCall} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 space-y-3">
                    <h4 className="font-semibold text-gray-200">Schedule a New Call</h4>
                    <input type="text" placeholder="Meeting Title" value={newEventTitle} onChange={e => setNewEventTitle(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-md py-1.5 px-2 text-sm text-white" />
                    <div className="flex gap-2">
                        <input type="date" value={newEventDate} onChange={e => setNewEventDate(e.target.value)} required className="w-1/2 bg-gray-700 border border-gray-600 rounded-md py-1.5 px-2 text-sm text-white" />
                        <input type="time" value={newEventTime} onChange={e => setNewEventTime(e.target.value)} required className="w-1/2 bg-gray-700 border border-gray-600 rounded-md py-1.5 px-2 text-sm text-white" />
                    </div>
                    <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold py-2 px-4 rounded">
                        Schedule Call
                    </button>
                </form>

                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                    <h4 className="font-semibold text-gray-200 mb-2">Upcoming Meetings</h4>
                    <ul className="space-y-3 max-h-48 overflow-y-auto">
                        {sortedEvents.length > 0 ? sortedEvents.map(event => (
                            <li key={event.id} className="text-sm group relative">
                                <p className="font-bold text-teal-400">{new Date(`${event.date}T${event.time}`).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
                                <p className="text-gray-300">{event.title}</p>
                                <button onClick={() => handleDeleteEvent(event.id)} className="absolute top-0 right-0 p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" title="Delete event">
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                </button>
                            </li>
                        )) : <p className="text-sm text-gray-500 italic">No meetings scheduled.</p>}
                    </ul>
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
