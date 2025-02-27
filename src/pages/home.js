import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');

    const createRoom = (e) => {
        e.preventDefault();
        const id = uuidv4();
        setRoomId(id);
        toast.success("Room created successfully");
    };

    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error("Enter room ID and username");
            return;
        }
        navigate(`/editor/${roomId}`, { state: { username } });
    };

    const handleEnter = (e) => {
        if (e.code === 'Enter') joinRoom();
    };

    return (
        <div className="form">
            <div className="box">
                <img src="./images/cmlogo.png" alt="logo" width={250} />
                <div className="inputs">
                    <p>Page invitation room ID</p>
                    <input
                        type="text"
                        placeholder="Room ID"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        onKeyUp={handleEnter}
                    />
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyUp={handleEnter}
                    />
                </div>
                <div className="button">
                    <button className="btn" onClick={joinRoom}>Join</button>
                    <p>If you don’t have a room?&nbsp;&nbsp;<a href="#" onClick={createRoom}>Create room</a></p>
                </div>
            </div>
            <footer><img src="./images/cmlogo.png" alt="logo" width={100} /></footer>
        </div>
    );
}

export default Home;
