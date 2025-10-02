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
    }
  }, [isOpen]);

  // Request media permissions when modal opens
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
  }, [isOpen, activeTab, mediaType, stream]);

  const handleStartRecording = () => {
    if (!stream) return;
    mediaChunksRef.current = [];
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

        <main className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center">
          {activeTab === 'Record' && (
            <div className="w-full max-w-4xl text-center space-y-4">
               <div className="flex justify-center mb-4">
                    <div className="flex items-center bg-gray-800 rounded-lg p-1">
                        <button onClick={() => setMediaType('video')} className={`px-4 py-1 text-sm rounded-md ${mediaType === 'video' ? 'bg-gray-600' : 'hover:bg-gray-700'}`}>Video</button>
                        <button onClick={() => setMediaType('photo')} className={`px-4 py-1 text-sm rounded-md ${mediaType === 'photo' ? 'bg-gray-600' : 'hover:bg-gray-700'}`}>Photo</button>
                        <button onClick={() => setMediaType('audio')} className={`px-4 py-1 text-sm rounded-md ${mediaType === 'audio' ? 'bg-gray-600' : 'hover:bg-gray-700'}`}>Audio</button>
                    </div>
                </div>
              {error && <p className="text-red-400">{error}</p>}
              <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center">
                 {stream && (mediaType === 'video' || mediaType === 'photo') ? (
                    <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-contain"></video>
                 ) : (
                    <p className="text-gray-500">Camera is off or loading...</p>
                 )}
              </div>
              <div className="flex justify-center items-center gap-4">
                {mediaType === 'video' || mediaType === 'audio' ? (
                  isRecording ? (
                    <>
                      <button onClick={handlePauseResume} className="p-4 bg-yellow-500 text-white rounded-full">{isPaused ? 'Resume' : 'Pause'}</button>
                      <button onClick={handleStopRecording} className="p-4 bg-red-600 text-white rounded-full">Stop</button>
                    </>
                  ) : (
                    <button onClick={handleStartRecording} className="p-4 bg-red-600 text-white rounded-full">Record</button>
                  )
                ) : (
                  <button onClick={handleTakePhoto} className="p-4 bg-blue-500 text-white rounded-full">Take Photo</button>
                )}
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
                    <button onClick={handleDelete} className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 rounded-md">Delete & Retake</button>
                    <button onClick={handleDownload} className="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-700 rounded-md">Download</button>
                    <button onClick={handleSaveAndAssign} className={`px-4 py-2 text-sm bg-green-600 hover:bg-green-700 rounded-md`}>Save & Assign</button>
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
