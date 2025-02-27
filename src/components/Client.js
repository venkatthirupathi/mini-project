import React from 'react'
import Avatar from 'react-avatar'

function Client( {username}){
    return (
        <div className='clientavatar'>
            <Avatar name={username} size={50} round="14px"/>
            <span>{username}</span>
        </div>
    )
}

export  default Client