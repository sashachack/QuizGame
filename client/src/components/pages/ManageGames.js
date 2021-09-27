import { Nav, QuizBox } from '../items';
import { React, useEffect, useContext, useState } from 'react' 
import GlobalContext from '../GlobalContext';
import CreatorContext from '../context/CreatorContext';


// import React from 'react';

function ManagerHeader(){
    // const { page, setPage } = useContext(GlobalContext);
    const {creator} = useContext(CreatorContext)
    const {socket, setPage} = useContext(GlobalContext)
    const [creator_name, setName] = useState('')
    socket.emit('getUsername', {creator: creator})

    useEffect(() => {
        socket.on('getUsername', (data) => {
            console.log(data)
            console.log('Your display name is ' + data.user_obj.displayName)
            setName(data.user_obj.displayName)

        })
    }, [socket])

    let header_text = creator_name + '\'s quizzes' 

    return(
        <div>
            {header_text}
        </div>
    )
}

function ManageGames(props) {
    

    return (
        <div>
            <div>
                <ManagerHeader></ManagerHeader>
            </div>
            <div id="quizzes">
                <QuizBox></QuizBox>
            </div>
        </div>
    );
}

export default ManageGames;