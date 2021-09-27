
import React, { useState, useContext, useEffect } from 'react';
import GlobalContext from '../GlobalContext';
import CreatorContext from '../context/CreatorContext';
// import { BackButton } from '../items';
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

function HostGameHeader(props) {
    return (
        <div className="hostGameHeader">
            <p>{props.text}</p>
        </div>
    )
}

function GameChoice(props) {
    return (
        <div className="gameChoice" id={props.id}>
            <p>{`${props.name}: ${props.text}`}</p>
        </div>
    )
}

function GameChoices(props) {
    const choices = props.choices;
    console.log(choices);
    if (props.correct === "") {
        return (
            <div className='gameChoices'>
                <GameChoice name="A" text={choices[0]} id="A"></GameChoice>
                <GameChoice name="B" text={choices[1]} id="B"></GameChoice>
                <GameChoice name="C" text={choices[2]} id="C"></GameChoice>
                <GameChoice name="D" text={choices[3]} id="D"></GameChoice>
            </div>
        );
    }
    else {
        return (
            <div className='gameChoices'>
                <GameChoice name="A" text={choices[0]} id={"A" === props.correct ? "A" : "O"}></GameChoice>
                <GameChoice name="B" text={choices[1]} id={"B" === props.correct ? "B" : "O"}></GameChoice>
                <GameChoice name="C" text={choices[2]} id={"C" === props.correct ? "C" : "O"}></GameChoice>
                <GameChoice name="D" text={choices[3]} id={"D" === props.correct ? "D" : "O"}></GameChoice>
            </div>
        );
    }
}

function InGame(props) {
    const data = props.data;
    console.log(data);
    const [correct, setCorrect] = useState('');
    return (
        <div>
            <HostGameHeader text={data.q}></HostGameHeader>
            <GameChoices correct={correct} choices={data.a}></GameChoices>
        </div>
    )
}

function rankify(place) {
    let dig = parseInt(place, 10) % 10;
    let end;
    switch (dig) {
        case '':
            end = '';
            break;
        case 1:
            end = "st";
            break;
        case 2:
            end = "nd";
            break;
        case 3:
            end = "rd";
            break;
        default:
            end = "th";
            break;
    }
    return place + end;
}

function PlayerRank(props) {
    return (
        <div className='playerRank'>
            <span className='rank'>{props.rank}</span>
            <span className='name'>{props.name}</span>
            <span className='score'>{props.score}</span>
        </div>
    );
}

function PlayerBox(props) {
    if (props.id === "startBtn") {
        return (
            <div onClick={props.click} id={props.id} className='playerBox'>
                <p>{props.name}</p>
            </div>
        );
    }
    else {
        return (
            <div className='playerBox'>
                <p>{props.name}</p>
            </div>
        );
    }
}

function Scores(props) {
    const data = props.data;
    let places = data.map((user, index) => {
        return <PlayerRank key={index} rank={rankify(index + 1)} name={user.name} score={user.score}></PlayerRank>
    });

    return (
        <div>
            <HostGameHeader text={'Scores'}></HostGameHeader>
            <div className='playerRanks'>
                {places}
            </div>
        </div>
    );
}

function Wait(props) {
    const data = props.data;
    console.log("Waiting...")
    // console.log(data);
    let users;
    if (data) {
        users = data.map((user, index) => {
            return <PlayerBox key={index} name={user.name}></PlayerBox>
        });
    }

    return (
        <div>
            <HostGameHeader text={`Join with code: ${props.code}`}></HostGameHeader>
            {/* <div onClick={props.click}>Start</div> */}
            <div className='playerBoxes'>
                <PlayerBox click={props.click} id="startBtn" name="Start"></PlayerBox>
                {users}
            </div>
        </div>
    )
}

function BackButton(props) {
    // const [state, dispatch] = useGlobalState();
    const { setPage, socket } = useContext(GlobalContext);

    const click = () => {
        socket.emit('endGame', props.code);
        setPage(props.page);
    }

    return (
        <div onClick={click}><p id="backButton">&#x279C;</p></div>
    );
}

function HostGame() {
    const { socket } = useContext(GlobalContext);
    const { editCode } = useContext(CreatorContext);
    const [qs, setQs] = useState();
    const [key, setKey] = useState(0);
    const [gameDone, setGameDone] = useState(false);
    // const code = '1234';

    useEffect(() => {
        socket.emit('hostGame', editCode);
    }, [socket]);

    const [data, setData] = useState();

    const [mode, setMode] = useState('wait');
    const startGame = () => {
        socket.emit('startGame', { code: editCode });
        // setMode('play');
    };
    useEffect(() => {
        socket.on('startGame', (question) => {
            setQs({ q: question.q, a: question.a });
            setMode('play');
            setKey(prev => prev + 1);
        });
    }, [socket, setMode]);
    useEffect(() => {
        socket.on('playerChange', ({ players }) => {
            console.log(players);
            setData(players);
        });
    }, [socket, setData]);

    useEffect(() => {
        socket.on('roundOver', () => {
            console.log('received round over');
            setMode('scores');
            setKey(prev => prev + 1);
        });
    }, [socket, setMode, setKey]);

    useEffect(() => {
        socket.on('allRoundsOver', () => {
            // setCorr(-1)
            console.log('we played all the rounds!');
            // setPlaying(false);
            setGameDone(true);
            setMode('scores');
        });
    }, [socket]);

    const bBtn = (<BackButton page='creator_home' code={editCode}></BackButton>);
    const timeText = (remainingTime, elapsedTime) => {
        return (<p id='timerTime'>{remainingTime}</p>);
    }

    if (mode === 'play') {
        return (
            <div>
                <InGame data={qs}></InGame>
                <div className='timer'>
                    <CountdownCircleTimer
                        onComplete={() => {
                            console.log('times up, end round: ' + editCode);
                            socket.emit('roundOver', { code: editCode });
                        }}
                        key={key}
                        isPlaying
                        duration={20}
                        colors={
                            [['#A347B7', 0.33],
                            ['#27B8FF', 0.33],
                            ['#66AAA3', 0.33]
                            ]}
                        children={({ remainingTime, elapsedTime }) => timeText(remainingTime, elapsedTime)}
                    />
                </div>
                {bBtn}
            </div>
        );
    }
    else if (mode === 'scores') {
        return (
            <div>
                <Scores data={data}></Scores>
                {!gameDone && (
                    <div className='timer'>
                        <CountdownCircleTimer
                            onComplete={() => {
                                console.log('times up, next round!');
                                socket.emit('startGame', { code: editCode });
                            }}
                            key={key}
                            isPlaying
                            duration={5}
                            colors={
                                [['#A347B7', 0.33],
                                ['#27B8FF', 0.33],
                                ['#66AAA3', 0.33]
                                ]}
                            children={({ remainingTime, elapsedTime }) => timeText(remainingTime, elapsedTime)}
                        />
                    </div>
                )}
                {bBtn}
            </div>
        );
    }
    else if (mode === 'wait') {
        return (
            <div>
                <Wait data={data} code={editCode} click={startGame}></Wait>
                {bBtn}
            </div>
        );
    }
}

export default HostGame;