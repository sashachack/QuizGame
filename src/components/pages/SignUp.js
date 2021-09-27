import GlobalContext from '../GlobalContext';
import { React, useState, useContext, useEffect } from 'react';
import { BackButton } from '../items';
import CreatorContext from '../context/CreatorContext';
// import CreatorContext from '../context/CreatorContext';

function SignUp() {

    const [signin_user, setUser] = useState("");
    const [signin_email, setEmail] = useState("");
    const [signin_pass, setPass] = useState("");
    const { setPage, socket } = useContext(GlobalContext);
    const { creator, setCreator } = useContext(CreatorContext)
    // const { creator, setCreator } = useContext(CreatorContext);


    function handleUser(e) {
        console.log("set user to " + e.target.value)
        setUser(e.target.value);
    }
    function handleEmail(e) {
        console.log("set pass to " + e.target.value)
        setEmail(e.target.value);
    }
    function handlePass(e) {
        console.log("set pass to " + e.target.value)
        setPass(e.target.value);
    }
    function handleSignUp(e) {
        //What to put here slash how do we access user and pass from up there
        // console.log(signin_user)
        // console.log(signin_email)
        // console.log(signin_pass)
        // console.log(firebase)
        let signup_object = { signin_email: signin_email, signin_pass: signin_pass }

        e.preventDefault();
        socket.emit('creatorSignUp', signup_object)
        // setPage('creator_home')

    }

    useEffect(() => {
        socket.on("creatorSignUp", function (data) {
            console.log(data);
            if (data.signin === true) {
                setCreator(data.creatorId)
                setPage('creator_home') //Need to set the new page here because this is asynchronous!!!!! Was firing before this completed before
            }
            else {
                console.log('invalid sign in becase...' + data.err_message)
            }
        });

    }, [socket, setPage]);

    return (
        <div>

            <form id='signup_form'>
                <input id="email" onChange={n => handleEmail(n)} placeholder="E-mail" type="text"></input>
                <input id="pass" placeholder="Password" onChange={n => handlePass(n)} type="text"></input>
                <input id="sign_up" type="submit" value="Sign Up" onClick={n => handleSignUp(n)}></input>
            </form>
            <BackButton page='create'></BackButton>
        </div>
    )
}

export default SignUp;