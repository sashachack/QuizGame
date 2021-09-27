import GameButton from './GameButton';

function GameButtons(props) {

    if (props.clicked === "") {
        return (
            <div className="gameButtons">
                <GameButton name="A" id="A" onClick={() => props.buttonClick(0)}></GameButton>
                <GameButton name="B" id="B" onClick={() => props.buttonClick(1)}></GameButton>
                <GameButton name="C" id="C" onClick={() => props.buttonClick(2)}></GameButton>
                <GameButton name="D" id="D" onClick={() => props.buttonClick(3)}></GameButton>
            </div>
        );
    }
    else {
        return (
            <div className="gameButtons">
                <GameButton name="A" id={0 === props.clicked ? "A" : "O"} onClick={() => props.buttonClick(0)}></GameButton>
                <GameButton name="B" id={1 === props.clicked ? "B" : "O"} onClick={() => props.buttonClick(1)}></GameButton>
                <GameButton name="C" id={2 === props.clicked ? "C" : "O"} onClick={() => props.buttonClick(2)}></GameButton>
                <GameButton name="D" id={3 === props.clicked ? "D" : "O"} onClick={() => props.buttonClick(3)}></GameButton>
            </div>
        );
    }

}

export default GameButtons;