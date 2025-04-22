// import React, { useState, useRef, useEffect } from 'react';
// import toast from 'react-hot-toast';
// import ACTIONS from '../Actions';
// import Client from '../components/Client';
// import Editor from '../components/Editor';
// import { initSocket } from '../socket';
// import { useParams, useLocation, useNavigate, Navigate } from 'react-router-dom';

// const EditorPage = () => {
//     const socketRef = useRef(null);
//     const codeRef = useRef(null);
//     const location = useLocation();
//     const { roomId } = useParams();
//     const reactNavigator = useNavigate();
//     const [clients, setClients] = useState([]);
//     const username = location.state?.username;

//     useEffect(() => {
//         const init = async () => {
//             socketRef.current = await initSocket();
//             socketRef.current.on('connect_error', handleErrors);
//             socketRef.current.on('connect_failed', handleErrors);

//             function handleErrors(e) {
//                 console.log('socket error', e);
//                 toast.error('Socket connection failed, try again');
//                 reactNavigator('/');
//             }

//             socketRef.current.emit(ACTIONS.JOIN, {
//                 roomId,
//                 username,
//             });

//             socketRef.current.on(ACTIONS.JOINED, ({ clients, username: joinedUser, socketId }) => {
//                 if (joinedUser !== username) {
//                     toast.success(`${joinedUser} joined the room.`);
//                 }
//                 setClients(clients);
//                 socketRef.current.emit(ACTIONS.SYNC_CODE, {
//                     code: codeRef.current,
//                     socketId,
//                 });
//             });

//             socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
//                 toast.success(`${username} left the room.`);
//                 setClients(prev => prev.filter(client => client.socketId !== socketId));
//             });
//         };

//         init();

//         return () => {
//             socketRef.current.disconnect();
//             socketRef.current.off(ACTIONS.JOINED);
//             socketRef.current.off(ACTIONS.DISCONNECTED);
//         };
//     }, [roomId, username, reactNavigator]);

//     async function copyRoomId() {
//         try {
//             await navigator.clipboard.writeText(roomId);
//             toast.success('Room ID has been copied to your clipboard');
//         } catch (err) {
//             toast.error('Could not copy the Room ID');
//             console.error(err);
//         }
//     }

//     async function copySessionLink() {
//         try {
//             const link = `${window.location.origin}/editor/${roomId}`;
//             await navigator.clipboard.writeText(link);
//             toast.success('Session link copied to clipboard!');
//         } catch (err) {
//             toast.error('Failed to copy session link');
//             console.error(err);
//         }
//     }

//     function leaveRoom() {
//         reactNavigator('/');
//     }

//     const downloadCode = () => {
//         const code = codeRef.current || '';  // Get the code from the editor
//         const blob = new Blob([code], { type: 'text/plain' });
//         const link = document.createElement('a');
//         link.download = `codemett-${roomId}.txt`;  // Set the file name based on roomId
//         link.href = URL.createObjectURL(blob);
//         link.click();  // Trigger the download
//     };

//     if (!username) {
//         return <Navigate to="/" />;
//     }

//     return (
//         <div className="mainBox">
//             <div className="aside">
//                 <div className="divimg">
//                     <img src="/images/cmlogo.png" alt="logo" />
//                 </div>

//                 <div className="connectedPeople">
//                     <div className="clientlist">
//                         {clients.map(c => (
//                             <Client key={c.socketId} username={c.username} />
//                         ))}
//                     </div>
//                 </div>

//                 <div className="asidebtn">
//                     <button className="copybtn btn" onClick={copyRoomId}>Copy Room ID</button>
//                     <button className="copybtn btn" onClick={copySessionLink}>Copy Session Link</button>
//                     <button className="btn" onClick={downloadCode}>Download Code</button> {/* Added download button */}
//                     <button className="lbtn btn" onClick={leaveRoom}>Leave</button>
//                 </div>
//             </div>

//             <div className="mainside">
//                 <Editor
//                     socketRef={socketRef}
//                     roomId={roomId}
//                     onCodeChange={(code) => { codeRef.current = code; }}
//                 />
//             </div>

//             {/* Chatbot placeholder */}
//             <div id="chatbot-icon">💬</div>
//             <div id="chatbot-container" className="hidden">
//                 <div id="chatbot-header">
//                     <span>ChatBot</span>
//                     <button id="close-btn">&times;</button>
//                 </div>
//                 <div id="chatbot-body">
//                     <div id="chatbot-messages"></div>
//                 </div>
//                 <div id="chatbot-input-container">
//                     <input type="text" id="chatbot-input" placeholder="Type a message" />
//                     <button id="send-btn">Send</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditorPage;




import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import ACTIONS from '../Actions';
import Client from '../components/Client';
import Editor from '../components/Editor';
import VideoCall from '../components/VideoCall';
import VideoButton from '../components/VideoButton';
import { initSocket } from '../socket';
import { useParams, useLocation, useNavigate, Navigate } from 'react-router-dom';

const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);
    const [showVideoCall, setShowVideoCall] = useState(false);
    const [otherSocketId, setOtherSocketId] = useState(null);

    const username = location.state?.username;

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', handleErrors);
            socketRef.current.on('connect_failed', handleErrors);

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again');
                reactNavigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username,
            });

            socketRef.current.on(ACTIONS.JOINED, ({ clients, username: joinedUser, socketId }) => {
                if (joinedUser !== username) {
                    toast.success(`${joinedUser} joined the room.`);
                }
                setClients(clients);

                // set otherSocketId if there's another user in the room (excluding current)
                const others = clients.filter(c => c.socketId !== socketRef.current.id);
                if (others.length > 0) {
                    setOtherSocketId(others[0].socketId);
                }

                socketRef.current.emit(ACTIONS.SYNC_CODE, {
                    code: codeRef.current,
                    socketId,
                });
            });

            socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                toast.success(`${username} left the room.`);
                setClients(prev => prev.filter(client => client.socketId !== socketId));
            });
        };

        init();

        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        };
    }, [roomId, username, reactNavigator]);

    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to your clipboard');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    }

    async function copySessionLink() {
        try {
            const link = `${window.location.origin}/editor/${roomId}`;
            await navigator.clipboard.writeText(link);
            toast.success('Session link copied to clipboard!');
        } catch (err) {
            toast.error('Failed to copy session link');
            console.error(err);
        }
    }

    function leaveRoom() {
        reactNavigator('/');
    }

    const downloadCode = () => {
        const code = codeRef.current || '';
        const blob = new Blob([code], { type: 'text/plain' });
        const link = document.createElement('a');
        link.download = `codemett-${roomId}.txt`;
        link.href = URL.createObjectURL(blob);
        link.click();
    };

    if (!username) {
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
                    <button className="copybtn btn" onClick={copyRoomId}>Copy Room ID</button>
                    <button className="copybtn btn" onClick={copySessionLink}>Copy Session Link</button>
                    <button className="btn" onClick={downloadCode}>Download Code</button>
                    <button className="lbtn btn" onClick={leaveRoom}>Leave</button>
                    {/* <VideoButton
                        onClick={() => setShowVideoCall(prev => !prev)}
                        isInCall={showVideoCall}
                    /> */}
                </div>
            </div>

            <div className="mainside">
                <Editor
                    socketRef={socketRef}
                    roomId={roomId}
                    onCodeChange={(code) => { codeRef.current = code; }}
                />
                {showVideoCall && otherSocketId && (
                    <div style={{ marginTop: '20px' }}>
                        <VideoCall socketIdToCall={otherSocketId} />
                    </div>
                )}
            </div>

            {/* Chatbot placeholder */}
            <div id="chatbot-icon">💬</div>
            <div id="chatbot-container" className="hidden">
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
        </div>
    );
};

export default EditorPage;
