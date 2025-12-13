import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useAuth } from '../context/AuthContext';

const VideoRoom = () => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // ---------------------------------------------------------
  // TODO: Replace these with your actual keys from ZEGOCLOUD Console
  // ---------------------------------------------------------
  const appID = 1640240737; // <--- Your App ID (Number)
  const serverSecret = "3e40957c8492c97484655a3159a6836f"; // <--- Your Server Secret (String)

  const myMeeting = async (element) => {
    if (!element) return;

    // Generate the Token
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      user?.id || Date.now().toString(),
      user?.username || "Guest"
    );

    // Create the instance
    const zp = ZegoUIKitPrebuilt.create(kitToken);

    // Join the room
    zp.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference, // 1-on-1 or Group calls
      },
      sharedLinks: [
        {
          name: 'Copy Link',
          url: window.location.origin + '/room/' + roomId,
        },
      ],
      showScreenSharingButton: true,
      onLeaveRoom: () => {
        navigate('/dashboard'); // Go back to dashboard when leaving
      },
    });
  };

  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
  );
};

export default VideoRoom;
