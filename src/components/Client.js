// import React from 'react'
// import Avatar from 'react-avatar'

// function Client( {username}){
//     return (
//         <div className='clientavatar'>
//             <Avatar name={username} size={60} round="16px"/>
//             <span>{username}</span>
//         </div>
//     )
// }

// export  default Client


import React from 'react'
import Avatar from 'react-avatar'

function Client({ username }) {
    return (
        <div className="clientavatar">
            <div className="avatar-wrapper">
                <Avatar
                    name={username}
                    size={55}
                    round="15px"
                    textSizeRatio={2.0}
                    // color="#f1c40f" // yellow background
                    // fgColor='#'
                    fgColor="#ffff" // black text
                    
                />
            </div>
            <span className="username">{username}</span>
        </div>
    )
}

export default Client
