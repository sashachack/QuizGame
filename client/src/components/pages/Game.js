import { React, useContext, useEffect, useState } from 'react';
import { GameHeader, GameButtons } from '../items';
import UserContext from '../context/UserContext';
import GlobalContext from '../GlobalContext';

function InGame(props) {
    return (
        <div>
            <GameHeader name={props.username} rank={props.rank} score={props.score}></GameHeader>
            <GameButtons clicked={props.clicked} buttonClick={n => props.click(n)}></GameButtons>
        </div>
    )
}

function Waiting(props) {
    return (
        <div className='waiting'>
            <GameHeader name={props.username} rank={props.rank} score={props.score}></GameHeader>
            <br></br><br></br>
            <strong id='message'>{props.message}</strong>
        </div>
    )
}

function Game(props) {
    const [clicked, setClicked] = useState("");
    const [playing, setPlaying] = useState(false);
    const [rank, setRank] = useState('1');
    const [score, setScore] = useState('0');
    const { socket, setPage } = useContext(GlobalContext);
    const { username, setUsername } = useContext(UserContext);
    const [corr, setCorr] = useState(-1);
    const [gameStage, setGameStage] = useState('wait');

    useEffect(() => {
        socket.on('startGame', ({ c }) => {
            setCorr(c);
            setClicked("");
            setGameStage('play')
            setPlaying(true);
        });
    }, [socket, setPlaying]);

    useEffect(() => {
        socket.on('gameOver', () => {
            console.log('the game has ended');
            setUsername('');
            setPage('join')
        });
    });

    useEffect(() => {
        socket.on('playerChange', ({ players }) => {
            let me;
            for (let p of players) {
                if (p.name === username) {
                    me = p;
                    break;
                }
            }
            if (!me)
                console.log("You don't exist, " + username);
            else {
                setScore(me.score);
                const rank = players.indexOf(me) + 1;
                setRank(rank);
            }
        });
    }, [socket]);

    useEffect(() => {
        socket.on('roundOver', () => {
            setCorr(-1);
            setPlaying(false);
        });
    }, [socket]);
    useEffect(() => {
        socket.on('allRoundsOver', () => {
            setCorr(-1);
            setGameStage('done');
            setPlaying(false);
        });
    }, [socket]);

    const userClick = ((n) => {
        if (clicked === "") {
            setClicked(n);
            console.log(corr + ' ' + n);
            let correct = corr === n;
            socket.emit('userClick', { user: username, ans: correct });
        }
    });

    let msg = gameStage === 'wait' ? 'The game will begin soon!' : 'The round will begin soon!';
    msg = gameStage === 'done' ? 'Good game!' : msg;

    return (
        <div>
            {playing && (<InGame username={username} rank={rank} score={score} clicked={clicked} click={n => userClick(n)}></InGame>)}
            {!playing && (<Waiting username={username} rank={rank} score={score} message={msg}> </Waiting>)}
        </div>
    );
}
export default Game;