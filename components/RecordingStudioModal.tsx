import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Modal } from './Modal';
import { useTheme } from '../context/ThemeContext';
import type { Question, AnswerObject } from '../types';
import { QuestionType } from '../types';

interface RecordingStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  onAnswerUpdate: (questionId: string, answer: AnswerObject) => void;
}

type Tab = 'Record' | 'View' | 'Assign';
type MediaType = 'video' | 'photo' | 'audio';

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

export const RecordingStudioModal: React.FC<RecordingStudioModalProps> = ({ isOpen, onClose, questions, onAnswerUpdate }) => {
  const [activeTab, setActiveTab] = useState<Tab>('Record');
  const [mediaType, setMediaType] = useState<MediaType>('video');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);
  const [mediaBlobUrl, setMediaBlobUrl] = useState<string>('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isCameraFullScreen, setIsCameraFullScreen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaChunksRef = useRef<Blob[]>([]);

  const theme = useTheme();

  const fileUploadQuestions = useMemo(() => {
    return questions.filter(q => q.type === QuestionType.FILE);
  }, [questions]);
  
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(fileUploadQuestions[0]?.id || '');

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      setActiveTab('Record');
      setMediaBlob(null);
      setMediaBlobUrl('');
      setDescription('');
      setError('');
      setIsCameraFullScreen(false);
    }
  }, [isOpen]);

  // Request media permissions when needed
  useEffect(() => {
    if (isOpen && activeTab === 'Record' && !stream) {
      const getMedia = async () => {
        try {
          const constraints = {
            video: mediaType === 'video' || mediaType === 'photo',
            audio: mediaType === 'video' || mediaType === 'audio',
          };
          const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        } catch (err) {
          console.error("Error accessing media devices.", err);
          setError("Could not access camera or microphone. Please check your browser permissions.");
        }
      };
      getMedia();
    }
     // Cleanup stream if we switch media type or tab
     return () => {
        if (stream && (!isOpen || activeTab !== 'Record')) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };
  }, [isOpen, activeTab, mediaType, stream]);

  const handleStartRecording = () => {
    if (!stream) return;
    mediaChunksRef.current = [];
    // MediaRecorder will choose the best available format, often webm. The file extension is derived from this.
    const mimeType = mediaType === 'video' ? 'video/webm' : 'audio/webm';
    mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
    
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        mediaChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(mediaChunksRef.current, { type: mimeType });
      setMediaBlob(blob);
      setMediaBlobUrl(URL.createObjectURL(blob));
      setActiveTab('View');
      setIsRecording(false);
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
    setIsPaused(false);
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    stream?.getTracks().forEach(track => track.stop());
    setStream(null);
  };

  const handlePauseResume = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    } else if (mediaRecorderRef.current?.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const handleTakePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          setMediaBlob(blob);
          setMediaBlobUrl(URL.createObjectURL(blob));
          setActiveTab('View');
          stream?.getTracks().forEach(track => track.stop());
          setStream(null);
        }
      }, 'image/jpeg');
    }
  };

  const handleSaveAndAssign = () => {
    if (!mediaBlob) return;
    setActiveTab('Assign');
  };

  const handleDelete = () => {
    setMediaBlob(null);
    setMediaBlobUrl('');
    URL.revokeObjectURL(mediaBlobUrl);
    setActiveTab('Record');
  };
  
  const handleDownload = () => {
      if (!mediaBlobUrl || !mediaBlob) return;
      const a = document.createElement('a');
      a.href = mediaBlobUrl;
      const extension = mediaBlob.type.split('/')[1].split(';')[0];
      a.download = `recording-${Date.now()}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  };

  const handleAssign = () => {
    if (!mediaBlob || !selectedQuestionId) {
        alert("Please select a question to assign this media to.");
        return;
    }
    const extension = mediaBlob.type.split('/')[1].split(';')[0];
    const fileName = `${mediaType}-capture-${Date.now()}.${extension}`;
    const mediaFile = new File([mediaBlob], fileName, { type: mediaBlob.type });

    onAnswerUpdate(selectedQuestionId, {
        value: mediaFile,
        source: description || `Captured via Recording Studio on ${new Date().toLocaleString()}`
    });

    alert(`Media assigned to question ${selectedQuestionId} successfully!`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Recording Studio" size="fullscreen">
      <div className="flex flex-col h-full bg-gray-900">
        <nav className="flex-shrink-0 border-b border-gray-700">
          <div className="flex space-x-1 p-2 max-w-lg mx-auto">
            {['Record', 'View', 'Assign'].map(tab => (
              <button
                key={tab}
                disabled={(tab === 'View' || tab === 'Assign') && !mediaBlob}
                onClick={() => setActiveTab(tab as Tab)}
                className={`flex-1 py-2 px-2 text-sm font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${activeTab === tab ? `${theme.background.secondary} text-white` : 'text-gray-300 hover:bg-gray-700'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </nav>

        <main className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center relative">
          {activeTab === 'Record' && (
            <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-4">
              {error && <p className="text-red-400 absolute top-4">{error}</p>}
              <div className={cn(
                  "w-full bg-black rounded-lg flex items-center justify-center relative overflow-hidden transition-all duration-300",
                  isCameraFullScreen ? "absolute inset-0 z-10 rounded-none" : "max-w-4xl aspect-video"
              )}>
                 {stream && (mediaType === 'video' || mediaType === 'photo') ? (
                    <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-contain"></video>
                 ) : (
                    <div className="flex items-center justify-center w-full h-full">
                         <p className="text-gray-500">{mediaType === 'audio' ? 'Audio only mode' : 'Camera is off or loading...'}</p>
                    </div>
                 )}
                {(mediaType === 'video' || mediaType === 'photo') && (
                    <button
                        onClick={() => setIsCameraFullScreen(!isCameraFullScreen)}
                        className="absolute top-2 right-2 z-20 p-2 bg-black/30 rounded-full text-white hover:bg-black/50 transition-colors"
                        title={isCameraFullScreen ? "Exit full screen" : "Enter full screen"}
                    >
                        {isCameraFullScreen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 15.293a1 1 0 010-1.414L8.586 11H5a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-3.586l-3.293 3.293a1 1 0 01-1.414 0zM15 5a1 1 0 011-1h3.586l-3.293-3.293a1 1 0 111.414-1.414L20 2.586V-1a1 1 0 112 0v5a1 1 0 01-1 1h-5a1 1 0 110-2z" clipRule="evenodd" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.5 15.5a1 1 0 01-1-1v-4a1 1 0 012 0v3.586l3.293-3.293a1 1 0 011.414 1.414L6.414 15H10a1 1 0 110 2H5.5a1 1 0 01-1-1zM15.5 4.5a1 1 0 011 1v4a1 1 0 11-2 0V6.414l-3.293 3.293a1 1 0 01-1.414-1.414L13.586 5H10a1 1 0 110-2h4.5a1 1 0 011 1z" clipRule="evenodd" /></svg>
                        )}
                    </button>
                )}
              </div>

              <div className={cn(
                  "flex flex-col items-center gap-4 transition-all duration-300",
                  isCameraFullScreen ? "absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black/30 p-4 rounded-full" : "w-full max-w-4xl pt-4"
              )}>
                <div className="flex justify-center mb-4">
                    <div className="flex items-center bg-gray-800 rounded-lg p-1">
                        <button onClick={() => setMediaType('video')} title="Video" className={`p-2 rounded-md ${mediaType === 'video' ? 'bg-gray-600' : 'hover:bg-gray-700'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /><path d="M14.553 5.447A.5.5 0 0115 5.86v8.28a.5.5 0 01-.447.413l-3-1A.5.5 0 0111 13.14V6.86a.5.5 0 01.553-.413l3 1z" /></svg>
                        </button>
                        <button onClick={() => setMediaType('photo')} title="Photo" className={`p-2 rounded-md ${mediaType === 'photo' ? 'bg-gray-600' : 'hover:bg-gray-700'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
                        </button>
                        <button onClick={() => setMediaType('audio')} title="Audio" className={`p-2 rounded-md ${mediaType === 'audio' ? 'bg-gray-600' : 'hover:bg-gray-700'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                </div>
                <div className="flex justify-center items-center gap-6">
                  {mediaType === 'video' || mediaType === 'audio' ? (
                    isRecording ? (
                      <>
                        <button onClick={handlePauseResume} className="p-4 bg-yellow-600 text-white rounded-full hover:bg-yellow-700" title={isPaused ? "Resume" : "Pause"}>
                          {isPaused ? <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>}
                        </button>
                        <button onClick={handleStopRecording} className="p-4 bg-red-600 text-white rounded-full hover:bg-red-700" title="Stop">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" /></svg>
                        </button>
                      </>
                    ) : (
                      <button onClick={handleStartRecording} className="p-6 bg-red-600 text-white rounded-full hover:bg-red-700" title="Start Recording">
                          <div className="w-6 h-6 bg-white rounded-full"></div>
                      </button>
                    )
                  ) : (
                    <button onClick={handleTakePhoto} className="p-6 bg-blue-600 text-white rounded-full hover:bg-blue-700 border-4 border-gray-900" title="Take Photo">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'View' && mediaBlobUrl && (
             <div className="w-full max-w-4xl space-y-4">
                {mediaBlob.type.startsWith('video') && <video src={mediaBlobUrl} controls className="w-full rounded-lg" />}
                {mediaBlob.type.startsWith('image') && <img src={mediaBlobUrl} alt="Captured" className="w-full rounded-lg" />}
                {mediaBlob.type.startsWith('audio') && <audio src={mediaBlobUrl} controls className="w-full" />}
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Add a description for this media..." rows={3} className={`w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white ${theme.ring.primary}`} />
                <div className="flex justify-center gap-4 flex-wrap">
                    <button onClick={handleDelete} title="Delete & Retake" className="p-3 text-sm bg-red-600 hover:bg-red-700 rounded-full text-white"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg></button>
                    <button onClick={handleDownload} title="Download" className="p-3 text-sm bg-gray-600 hover:bg-gray-700 rounded-full text-white"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
                    <button onClick={handleSaveAndAssign} title="Save & Assign" className={`p-3 text-sm bg-green-600 hover:bg-green-700 rounded-full text-white`}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" /></svg></button>
                </div>
            </div>
          )}
          {activeTab === 'Assign' && mediaBlob && (
            <div className="w-full max-w-xl space-y-4 text-left">
                <h3 className="text-xl font-bold text-white text-center">Assign Media to a Question</h3>
                <div>
                    <label htmlFor="question-select" className="block text-sm font-medium text-gray-300 mb-1">Select Question</label>
                    <select id="question-select" value={selectedQuestionId} onChange={e => setSelectedQuestionId(e.target.value)} className={`w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white ${theme.ring.primary}`}>
                       {fileUploadQuestions.map(q => (
                           <option key={q.id} value={q.id}>
                               {q.id}: {q.text.replace('{Destination}', '')}
                           </option>
                       ))}
                    </select>
                </div>
                 <div className="text-sm text-gray-400 bg-gray-800 p-3 rounded-md">
                    <p><span className="font-semibold text-gray-200">Description:</span> {description || 'N/A'}</p>
                 </div>
                <div className="pt-4 flex justify-center">
                    <button onClick={handleAssign} className={`px-6 py-3 font-semibold text-white ${theme.background.primary} ${theme.background.hover} rounded-md`}>Assign to Question</button>
                </div>
            </div>
          )}
        </main>
      </div>
    </Modal>
  );
};