// src/components/VideoCall.js
import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Update if deployed

const VideoCall = ({ socketIdToCall }) => {
    const [stream, setStream] = useState();
    const [callAccepted, setCallAccepted] = useState(false);
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                myVideo.current.srcObject = currentStream;
            })
            .catch((err) => {
                alert("Unable to access webcam: " + err.message);
                console.error(err);
            });

        socket.on('call-user', ({ from, signal }) => {
            const peer = new Peer({ initiator: false, trickle: false, stream });
            peer.on('signal', (data) => {
                socket.emit('answer-call', { to: from, signal: data });
            });
            peer.on('stream', (currentStream) => {
                userVideo.current.srcObject = currentStream;
            });
            peer.signal(signal);
            connectionRef.current = peer;
            setCallAccepted(true);
        });

        return () => socket.off('call-user');
    }, []);

    const callUser = () => {
        const peer = new Peer({ initiator: true, trickle: false, stream });
        peer.on('signal', (data) => {
            socket.emit('call-user', {
                userToCall: socketIdToCall,
                signalData: data,
                from: socket.id,
                name: 'User',
            });
        });
        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });
        socket.on('call-accepted', (signal) => {
            setCallAccepted(true);
            peer.signal(signal);
        });

        connectionRef.current = peer;
    };

    return (
        <div>
            <h3>Video Call</h3>
            <div>
                <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />
                {callAccepted && <video playsInline ref={userVideo} autoPlay style={{ width: "300px" }} />}
            </div>
            {!callAccepted && socketIdToCall && (
                <button onClick={callUser}>Call User</button>
            )}
        </div>
    );
};

export default VideoCall;
