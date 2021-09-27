import GlobalContext from '../GlobalContext';
import { React, useContext, useEffect, useState } from 'react';
import UserContext from '../context/UserContext';
import { useSpring, animated } from 'react-spring'


function NameForm() {
    const [value, setValue] = useState('');
    const [failure, setFailure] = useState(false);
    const { setPage, socket } = useContext(GlobalContext);
    const { setUsername, roomcode } = useContext(UserContext);

    const fade = useSpring({ opacity: failure ? '1' : '0' });
    const fadeTime = 2000;

    function handleChange(e) {
        setValue(e.target.value);
    }
    function handleSubmit(e) {
        e.preventDefault();
        console.log('Room code: ' + roomcode);
        socket.emit('join-with-name', { name: value, room: roomcode });
    }
    useEffect(() => {
        socket.on('join-with-name', (data) => {
            if (data.res === 1) {
                console.log("Name: " + data.name);
                setUsername(data.name);
                setPage('game');
            }
            else {
                const rsn = data.reason;
                console.log("Failed: " + rsn);
                setFailure(true);
                setTimeout(() => setFailure(false), fadeTime);
            }
        });
    }, [socket, setUsername, setPage]);

    return (
        <form className='formFlex' autoComplete="off" onSubmit={handleSubmit}>
            <div id="text">
                <strong>Enter Name:</strong>
            </div>
            <input id="code" value={value} onChange={handleChange} type="text" maxLength="15"></input>
            <br></br>
            <input id="joinRoom" type="submit" value="Join"></input>
            <br></br>
            <animated.p className="formFailure" style={fade}>Invalid Name</animated.p>
        </form>
    )
}

export default NameForm;