import { Nav } from '../items';
import React, { useContext, useEffect, createContext, useState } from 'react'
import GlobalContext from '../GlobalContext';
import CreatorContext from '../context/CreatorContext';
// import { QuizBox, Box } from '../items';
import UserContext from '../context/UserContext';
import { useSpring, animated } from 'react-spring';
import Quiz from './Quiz';


const QuizzesContext = createContext();

function QuizBox(props) {
    const i = props.index;
    const { quizzes, setQuizzes, setPopup, setPopIndex } = useContext(QuizzesContext);

    const click = () => {
        setPopIndex(i)
        setPopup(true);
    }

    const [iconsVis, setIconsVis] = useState(false);
    const enterRight = useSpring({ transform: iconsVis ? 'translate3d(0px,0px,0px)' : 'translate3d(300px,0px,0px)' });
    // style={enterRight}

    return (
        <div className='question' onMouseOver={() => setIconsVis(true)} onMouseLeave={() => setIconsVis(false)}>
            <p className='qTitle'> {quizzes[i].name} </p>
            {/* <input type='text' value={quiz.name} onChange={(e) => handleNameChange(e.target.value)}></input> */}

            {/* {iconsVis && (
                <div className='icons' >
                    <Icon sym={'S'}></Icon>
                    <Icon sym={'E'}></Icon>
                    <Icon sym={'D'}></Icon>
                </div>
            )} */}
            <animated.div className='icons' style={enterRight} >
                <Icon sym={'S'} i={i} code={props.code}></Icon>
                <Icon sym={'E'} i={i} code={props.code}></Icon>
                <Icon sym={'D'} i={i} code={''}></Icon>
            </animated.div>
        </div>
    );
}

function Icon(props) {
    const { quizzes, setQuizzes } = useContext(QuizzesContext);
    const { setEditCode } = useContext(CreatorContext);
    const { setPage, socket } = useContext(GlobalContext);

    const sym = props.sym;
    const i = props.i;
    const id = sym.toLowerCase();

    let icon = sym === 'S' ? 'play_arrow' : 'edit';
    icon = sym === 'D' ? 'delete' : icon;

    const click = async () => {
        const name = quizzes[i].name;
        const code = quizzes[i].code;
        if (sym === 'S') {
            await setEditCode(code);
            console.log(`Start quiz ${name}`);
            setPage('hostgame')
        }

        else if (sym === 'E') {
            console.log(`Edit quiz ${name}`)
            await setEditCode(code);
            console.log('set edit code to ' + code);

            setPage('quiz');
        }
        else if (sym === 'D') {
            let temp = JSON.parse(JSON.stringify(quizzes));
            socket.emit('deleteQuiz', code);
            console.log(`Delete quiz ${name}`);
            temp.splice(i, 1);
            setQuizzes(temp);
        }
    }


    return (
        <div id={id} onClick={click} className='icon'>
            <i className="material-icons">{icon}</i>
        </div>
    )
}

const AddQuiz = () => {
    const { socket, page, setPage } = useContext(GlobalContext);
    const { quizzes, setQuizzes, setPopup, setPopIndex } = useContext(QuizzesContext);
    const { creator } = useContext(CreatorContext);
    const add = () => {
        let temp = JSON.parse(JSON.stringify(quizzes));
        console.log(`Create new quiz`);
        socket.emit('createQuiz', creator);
    };
    return (
        <div className='icon' onClick={add}>
            <i className="material-icons">add</i>
        </div>
    )
};

function QuizzesHeader(props) {
    const { socket } = useContext(GlobalContext);
    return (
        <div className="quizzesHeader">
            <p id='logout' onClick={() => window.location.reload()}>Logout</p>
            <strong>Quizzes</strong>
            {/* <p>Login</p> */}
        </div>
    )
}

function CreatorPage(props) {
    const { socket, page, setPage } = useContext(GlobalContext);
    const { creator, setEditCode } = useContext(CreatorContext);

    const [quizzes, setQuizzes] = useState();

    /* #region socket effects */
    useEffect(() => {
        // console.log("hmm");
        socket.emit('getQuizNamesById', creator);
        // setQuizzes([{}]
    }, []);

    useEffect(() => {
        socket.on('quizCreated', async (code) => {
            await setEditCode(code);
            console.log('set edit code to ' + code);
            setPage('quiz');
        });
    }, [socket, setEditCode]);

    // else {
    //     console.log(quizzes[0].name);
    // }

    useEffect(() => {
        socket.on('getQuizNamesById', async (data) => {
            setQuizzes(data);
            console.log('got it at least');
            console.log(data);
        });
    }, [socket, setQuizzes]);
    /* #endregion */

    let quizMap;
    if (quizzes) {
        quizMap = quizzes;
    }
    else {
        quizMap = [{}];
    }
    let allQuizzes = quizMap.map((quiz, index) => {
        return <QuizBox key={index} index={index}></QuizBox>
    });


    const cont = { quizzes, setQuizzes }

    return (
        <QuizzesContext.Provider value={cont}>
            <QuizzesHeader></QuizzesHeader>
            <div className='questions'>
                {quizzes && allQuizzes}
                <AddQuiz></AddQuiz>
                <br></br>
                <br></br>
            </div>
        </QuizzesContext.Provider>
    );
}

export default CreatorPage;