// -------------------------------------------------------------
// This is the Client component
import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import ACTIONS from '../Actions';
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import {
    useLocation,
    useNavigate,
    Navigate,
    useParams,
} from 'react-router-dom';

const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again');
                reactNavigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            // Listening for joined event   
            socketRef.current.on(
                ACTIONS.JOINED,
                ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room.`);
                        console.log(`${username} joined`);
                    }
                    setClients(clients);
                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId,
                    });
                }
            );

            // Listening for disconnected
            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({ socketId, username }) => {
                    toast.success(`${username} left the room.`);
                    setClients((prev) => {
                        return prev.filter(
                            (client) => client.socketId !== socketId
                        );
                    });
                }
            );
        };
        init();
        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        };
    }, []);

    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to your clipboard');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    } 
    

    function leaveRoom() {
        reactNavigator('/');
    }

    if (!location.state) {
        return <Navigate to="/" />;
    }
    return (
        <div className="mainBox">
            <div className="aside">
                <div className="divimg">
                    <img src="/images/cmlogo.png" alt="logo" />
                </div>
                <div className="connectedPeople">
                    <div className="clientlist">
                        {clients.map(c => (
                            <Client key={c.socketId} username={c.username} />
                        ))}
                    </div>
                </div>
                <div className="asidebtn">
                    <button className="copybtn btn" onClick={copyRoomId}> copy roomId</button>
                    <button className="lbtn btn" onClick={() => reactNavigator("/")}>Leave</button>
                </div>
            </div>
            <div className="mainside">
                <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => { codeRef.current = code; }} />
            </div>

            <div id="chatbot-icon">💬</div>
    <div id="chatbot-container" class="hidden">
      <div id="chatbot-header">
        <span>ChatBot</span>
        <button id="close-btn">&times;</button>
      </div>
      <div id="chatbot-body">
        <div id="chatbot-messages"></div>
      </div>
      <div id="chatbot-input-container">
        <input type="text" id="chatbot-input" placeholder="Type a message" />
        <button id="send-btn">Send</button>
      </div>
    </div>
    <script src="./mini-project/src/pages/chatbotscript.js"></script>
        </div>

        
    );
}

export default EditorPage;