import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import { roomAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

// --- Icons ---
const MicIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
);
const MicOffIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="1" x2="23" y1="1" y2="23" stroke="currentColor"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" stroke="currentColor"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" stroke="currentColor"/><line x1="12" x2="12" y1="19" y2="23" stroke="currentColor"/></svg>
);
const VideoIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
);
const VideoOffIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10.66 5H14a2 2 0 0 1 2 2v2.34l1 1L22 7v10"/><path d="M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2l10 10Z"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
);
const MonitorIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
);
const PhoneOffIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/><line x1="22" x2="2" y1="2" y2="22"/></svg>
);
const CopyIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);
const PinIcon = ({ className, filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" x2="12" y1="17" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/></svg>
);

// --- Video Player Component ---
const VideoPlayer = ({ stream, isLocal = false, onPin, isPinned, label }) => {
  const ref = useRef();

  useEffect(() => {
    if (ref.current && stream) {
      ref.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className={`relative bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-800 shadow-xl transition-all ${isPinned ? 'w-full h-full' : 'w-full h-full'}`}>
      <video
        ref={ref}
        autoPlay
        playsInline
        muted={isLocal} 
        style={{ transform: isLocal && !label?.toLowerCase().includes('screen') ? 'scaleX(-1)' : 'none' }}
        className="w-full h-full object-contain bg-black"
      />
      
      {/* Overlay Info */}
      <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/70 to-transparent flex justify-between items-start opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="bg-black/40 backdrop-blur-md px-2 py-1 rounded text-xs font-medium text-white">
          {label || 'User'}
        </div>
        <button 
          onClick={onPin}
          className={`p-1.5 rounded-full backdrop-blur-md transition-colors ${isPinned ? 'bg-blue-600 text-white' : 'bg-black/40 text-gray-300 hover:bg-white/20'}`}
          title={isPinned ? "Unpin" : "Pin"}
        >
          <PinIcon className="w-3.5 h-3.5" filled={isPinned} />
        </button>
      </div>
    </div>
  );
};

const VideoRoom = () => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [peers, setPeers] = useState([]); // Array of { peerID, peer }
  const [remoteStreams, setRemoteStreams] = useState([]); // Array of { id, stream, peerID }
  const [userStream, setUserStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [pinnedStreamId, setPinnedStreamId] = useState(null); // ID of pinned stream
  
  // Controls
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [roomInfo, setRoomInfo] = useState(null);
  const [showCopied, setShowCopied] = useState(false);

  // Refs
  const socketRef = useRef();
  const peersRef = useRef([]); // Keep track of peers for cleanup
  const userStreamRef = useRef();
  const screenStreamRef = useRef(); // Corrected declaration
  const isMounted = useRef(true); // Track mount status

  // --- Initialization & Cleanup ---
  useEffect(() => {
    isMounted.current = true;

    // Prevent accidental refresh
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    const init = async () => {
        try {
            await fetchRoomInfo();
            if (isMounted.current) {
                await initializeMedia();
            }
        } catch (err) {
            console.error(err);
        }
    };
    
    init();

    return () => {
      isMounted.current = false;
      window.removeEventListener('beforeunload', handleBeforeUnload);
      cleanupConnection();
    };
  }, [roomId]); 

  const cleanupConnection = () => {
    console.log("Cleaning up connections...");
    
    // 1. Stop Local Camera
    if (userStreamRef.current) {
      userStreamRef.current.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      userStreamRef.current = null;
    }

    // 2. Stop Screen Share
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
    }

    // 3. Destroy Peers
    peersRef.current.forEach(({ peer }) => {
      if (peer && !peer.destroyed) {
        peer.destroy();
      }
    });
    peersRef.current = [];
    
    // Clear state only if mounted to avoid react warnings
    if (isMounted.current) {
        setPeers([]);
        setRemoteStreams([]);
        setUserStream(null);
        setScreenStream(null);
    }

    // 4. Disconnect Socket
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  const fetchRoomInfo = async () => {
    try {
      const response = await roomAPI.getRoom(roomId);
      if (isMounted.current) {
          setRoomInfo(response.data.room);
          await roomAPI.joinRoom(roomId);
      }
    } catch (error) {
      console.error('Error fetching room:', error);
      if (isMounted.current) navigate('/dashboard');
    }
  };

  // --- WebRTC Logic ---
  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      
      // CRITICAL: Check if still mounted after async call
      if (!isMounted.current) {
          // If unmounted during getUserMedia, immediately stop these tracks
          stream.getTracks().forEach(t => t.stop());
          return;
      }

      // If there was an old stream pending in ref (race condition), stop it
      if (userStreamRef.current) {
         userStreamRef.current.getTracks().forEach(t => t.stop());
      }

      userStreamRef.current = stream;
      setUserStream(stream);

      socketRef.current = io(process.env.REACT_APP_SOCKET_URL);
      socketRef.current.emit('join-room', roomId, user.id);

      // --- Socket Events ---

      socketRef.current.on('user-connected', (userId) => {
        if (!isMounted.current) return;
        const peer = createPeer(userId, socketRef.current.id, stream);
        peersRef.current.push({ peerID: userId, peer });
        setPeers(prev => [...prev, { peerID: userId, peer }]);
      });

      socketRef.current.on('user-disconnected', (userId) => {
        if (!isMounted.current) return;
        const peerObj = peersRef.current.find(p => p.peerID === userId);
        if (peerObj && peerObj.peer) peerObj.peer.destroy();
        
        peersRef.current = peersRef.current.filter(p => p.peerID !== userId);
        setPeers(prev => prev.filter(p => p.peerID !== userId));
        setRemoteStreams(prev => prev.filter(s => s.peerID !== userId));
      });

      socketRef.current.on('offer', (offer, id) => {
        if (!isMounted.current) return;
        const peer = addPeer(offer, id, stream);
        peersRef.current.push({ peerID: id, peer });
        setPeers(prev => [...prev, { peerID: id, peer }]);
      });

      socketRef.current.on('answer', (answer, id) => {
        const p = peersRef.current.find(p => p.peerID === id);
        if (p) p.peer.signal(answer);
      });

      socketRef.current.on('ice-candidate', (candidate, id) => {
        const p = peersRef.current.find(p => p.peerID === id);
        if (p) p.peer.signal(candidate);
      });

      // Notification only - stream handling is done via peer.on('stream')
      socketRef.current.on('screen-share-started', (id) => {
        console.log(`User ${id} started screen sharing`);
      });

      socketRef.current.on('screen-share-stopped', (id) => {
        console.log(`User ${id} stopped screen sharing`);
        setRemoteStreams(prev => prev.filter(s => {
           // Keep streams; simple-peer usually removes track automatically or we can add logic here if needed
           return true; 
        }));
      });

    } catch (error) {
      console.error('Media Error:', error);
      if (isMounted.current) {
        alert('Could not access camera/microphone');
        navigate('/dashboard');
      }
    }
  };

  const createPeer = (userToSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', signal => {
      socketRef.current.emit('offer', signal, roomId);
    });

    peer.on('stream', remoteStream => {
      handleRemoteStream(remoteStream, userToSignal);
    });

    return peer;
  };

  const addPeer = (incomingSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', signal => {
      socketRef.current.emit('answer', signal, roomId);
    });

    peer.on('stream', remoteStream => {
      handleRemoteStream(remoteStream, callerID);
    });

    peer.signal(incomingSignal);
    return peer;
  };

  const handleRemoteStream = (stream, peerID) => {
    setRemoteStreams(prev => {
      if (prev.some(s => s.id === stream.id)) return prev;
      return [...prev, { id: stream.id, stream, peerID }];
    });
  };

  // --- Controls ---

  const toggleMute = () => {
    if (userStreamRef.current) {
      const track = userStreamRef.current.getAudioTracks()[0];
      if (track) {
        track.enabled = !track.enabled;
        setIsMuted(!track.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (userStreamRef.current) {
      const track = userStreamRef.current.getVideoTracks()[0];
      if (track) {
        track.enabled = !track.enabled;
        setIsVideoOff(!track.enabled);
      }
    }
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      screenStreamRef.current = stream;
      setScreenStream(stream);
      setIsScreenSharing(true);
      setPinnedStreamId('local-screen'); // Auto-pin my screen

      // Add stream to all peers
      peersRef.current.forEach(({ peer }) => {
        peer.addStream(stream);
      });

      // Handle native stop button
      stream.getVideoTracks()[0].onended = () => stopScreenShare();
      
      socketRef.current.emit('screen-share-started', roomId);
    } catch (error) {
      console.error("Screen share failed", error);
    }
  };

  const stopScreenShare = () => {
    if (screenStreamRef.current) {
      // Remove stream from peers
      peersRef.current.forEach(({ peer }) => {
        peer.removeStream(screenStreamRef.current);
      });
      // Stop tracks
      screenStreamRef.current.getTracks().forEach(t => t.stop());
      screenStreamRef.current = null;
    }
    setScreenStream(null);
    setIsScreenSharing(false);
    
    // Unpin if necessary
    setPinnedStreamId(prev => (prev === 'local-screen' ? null : prev));
    
    socketRef.current.emit('screen-share-stopped', roomId);
  };

  const leaveRoom = () => {
    cleanupConnection();
    navigate('/dashboard');
  };

  const copyLink = () => {
    const link = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(link);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  // --- Render Helpers ---

  const getAllStreams = () => {
    const streams = [];
    
    // 1. Local Camera
    if (userStream) {
      streams.push({ id: 'local-cam', stream: userStream, isLocal: true, label: 'You' });
    }
    
    // 2. Local Screen
    if (screenStream) {
      streams.push({ id: 'local-screen', stream: screenStream, isLocal: true, label: 'Your Screen' });
    }
    
    // 3. Remote Streams
    remoteStreams.forEach(rs => {
      streams.push({ 
        id: rs.id, 
        stream: rs.stream, 
        isLocal: false, 
        label: `Participant ${rs.peerID.substr(0,4)}` 
      });
    });

    return streams;
  };

  const allStreams = getAllStreams();
  const pinnedStream = allStreams.find(s => s.id === pinnedStreamId);

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden">
      
      {/* Header */}
      <div className="h-16 border-b border-gray-800 bg-[#0a0a0f] flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-8 w-8" onError={(e) => e.target.style.display='none'} />
          <div>
            <h1 className="text-white font-semibold text-sm">{roomInfo?.name || 'Meeting Room'}</h1>
            <span className="text-gray-500 text-xs">{roomId}</span>
          </div>
        </div>
        <button 
          onClick={copyLink} 
          className="flex items-center gap-2 bg-[#222] hover:bg-[#333] text-white text-xs px-3 py-1.5 rounded-full transition-colors"
        >
          <CopyIcon className="w-3 h-3" />
          {showCopied ? "Copied" : "Copy Link"}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {pinnedStream ? (
          // Pinned Layout
          <div className="flex-1 flex flex-col md:flex-row w-full h-full p-4 gap-4">
            
            {/* Main Stage */}
            <div className="flex-1 relative bg-[#111] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
              <VideoPlayer 
                stream={pinnedStream.stream} 
                isLocal={pinnedStream.isLocal}
                label={pinnedStream.label}
                isPinned={true}
                onPin={() => setPinnedStreamId(null)} // Unpin
              />
            </div>

            {/* Side Filmstrip */}
            <div className="md:w-64 w-full flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto custom-scrollbar">
              {allStreams.filter(s => s.id !== pinnedStreamId).map(s => (
                <div key={s.id} className="flex-shrink-0 w-48 md:w-full aspect-video">
                  <VideoPlayer 
                    stream={s.stream} 
                    isLocal={s.isLocal} 
                    label={s.label}
                    isPinned={false}
                    onPin={() => setPinnedStreamId(s.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Grid Layout
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr h-full content-center">
                {allStreams.map(s => (
                  <div key={s.id} className="aspect-video w-full h-full max-h-[400px]">
                    <VideoPlayer 
                      stream={s.stream} 
                      isLocal={s.isLocal} 
                      label={s.label}
                      isPinned={false}
                      onPin={() => setPinnedStreamId(s.id)}
                    />
                  </div>
                ))}
                {allStreams.length === 0 && (
                  <div className="col-span-full flex items-center justify-center text-gray-500">
                    Waiting for others...
                  </div>
                )}
             </div>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="h-20 bg-[#0a0a0f] border-t border-gray-800 flex items-center justify-center gap-4 z-20">
        <button
          onClick={toggleMute}
          className={`p-3 rounded-full transition-all ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-[#222] hover:bg-[#333]'}`}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <MicOffIcon className="w-5 h-5 text-white" /> : <MicIcon className="w-5 h-5 text-white" />}
        </button>

        <button
          onClick={toggleVideo}
          className={`p-3 rounded-full transition-all ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-[#222] hover:bg-[#333]'}`}
          title={isVideoOff ? "Turn On Camera" : "Turn Off Camera"}
        >
          {isVideoOff ? <VideoOffIcon className="w-5 h-5 text-white" /> : <VideoIcon className="w-5 h-5 text-white" />}
        </button>

        <button
          onClick={isScreenSharing ? stopScreenShare : startScreenShare}
          className={`p-3 rounded-full transition-all ${isScreenSharing ? 'bg-green-600 hover:bg-green-700' : 'bg-[#222] hover:bg-[#333]'}`}
          title="Share Screen"
        >
          <MonitorIcon className="w-5 h-5 text-white" />
        </button>

        <div className="w-px h-8 bg-gray-700 mx-2"></div>

        <button
          onClick={leaveRoom}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full flex items-center gap-2 transition-all shadow-lg shadow-red-900/20"
        >
          <PhoneOffIcon className="w-5 h-5" />
          <span>Leave</span>
        </button>
      </div>

    </div>
  );
};

export default VideoRoom;