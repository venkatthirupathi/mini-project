import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaCode, FaUsers, FaComments, FaLaptopCode } from 'react-icons/fa';
import '../styles/Home.css';

const Home = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');

    const createRoom = (e) => {
        e.preventDefault();
        const id = uuidv4();
        setRoomId(id);
        // Add animation class
        const boxElement = document.querySelector('.box');
        boxElement.classList.add('shake');
        // Remove class after animation
        setTimeout(() => {
            boxElement.classList.remove('shake');
        }, 500);
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
        <div className="homepage-container">
            <div className="hero-section">
                <div className="hero-content">
                    <h1>Welcome to CodeMeet</h1>
                    <p>A real-time collaborative coding platform for teams</p>
                </div>
            </div>

            <div className="main-content">
                <div className="left-panel">
                    <h2>Start Coding Together</h2>
                    <p>Join thousands of developers who are already using CodeMeet for:</p>
                    <ul className="features-list">
                        <li>Real-time collaboration</li>
                        <li>Pair programming</li>
                        <li>Code reviews</li>
                        <li>Teaching & Learning</li>
                    </ul>
                </div>

                <div className="form">
                    <div className="box">
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
                            <p>If you don't have a room?&nbsp;&nbsp;
                                <a href="#" onClick={createRoom}>Create room</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="features-grid">
                <div className="feature-card">
                    <FaCode className="feature-icon" />
                    <h3>Live Coding</h3>
                    <p>Code together in real-time with syntax highlighting</p>
                </div>
                <div className="feature-card">
                    <FaUsers className="feature-icon" />
                    <h3>Team Collaboration</h3>
                    <p>Work seamlessly with your team members</p>
                </div>
                <div className="feature-card">
                    <FaLaptopCode className="feature-icon" />
                    <h3>Multiple Languages</h3>
                    <p>Support for various programming languages</p>
                </div>
            </div>

            <footer>
                {/* <img src="./images/cmlogo.png" alt="logo" width={100} /> */}
            </footer>
        </div>
    );
};

export default Home;