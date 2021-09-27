import GlobalContext from '../GlobalContext';
import React, { useState, useContext, useEffect } from 'react';
import UserContext from '../context/UserContext';
import { useSpring, animated } from 'react-spring'

function JoinForm() {

    const [value, setValue] = useState('');
    const [failure, setFailure] = useState(false);
    // const [tempCode, setTempCode] = useState('');
    const { setPage, socket } = useContext(GlobalContext);
    const { setRoomcode } = useContext(UserContext);

    const fade = useSpring({ opacity: failure ? '1' : '0' });
    const fadeTime = 2000;

    const handleChange = (e) => {
        setValue(e.target.value);
    }
    const handleSubmit = (e) => {
        setFailure(false);
        // setTempCode(value)
        console.log('Go to room ' + value);
        socket.emit('joinRoom', value);
        e.preventDefault();
    }
    useEffect(() => {
        socket.on("joinRoom", function (data) {
            if (data.res === 1) {
                console.log("Successfully joined room: " + data.room);
                setRoomcode(data.room);
                setPage('name');
            }
            else {
                console.log("Join room unsuccessful");
                setFailure(true);
                setTimeout(() => setFailure(false), fadeTime);
            }
        });
    }, [socket, setRoomcode, setPage]);
    return (
        <form className='formFlex' autoComplete="off" onSubmit={handleSubmit}>
            <div id="text">
                <strong>Enter Code:</strong>
            </div>
            <input id="code" value={value} onChange={handleChange} type="text" maxLength="4"></input>
            <br></br>
            <input id="joinRoom" type="submit" value="Join"></input>
            <br></br>
            <animated.p className="formFailure" style={fade}>Invalid Room</animated.p>
        </form>
    );
}

export default JoinForm;