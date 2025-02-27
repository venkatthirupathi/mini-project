
// import { io } from 'socket.io-client';

// export const initSocket = async () => {
    
//     const options = {
//         forceNew: true,
//         reconnectionAttempts: Infinity,
//         transports: [ 'websocket'], // Allow fallback to polling if WebSocket fails
//         timeout: 1000,
//     };
    
//     return io(process.env.REACT_APP_BACKEND_URL, options); // Use http if https is not properly configured
// };

import { io } from 'socket.io-client';

export const initSocket = async () => {
    const options = {
        forceNew: true,
        reconnectionAttempts: Infinity,
        transports: ['websocket'],
        timeout : 1000,
    };

    return io(process.env.REACT_APP_BACKEND_URL , options);
};
