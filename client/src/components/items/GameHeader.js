import { UserRank, UserName, UserScore } from '.';

function GameHeader(props) {
    return (
        <div className="gameHeader">
            <UserRank rank={props.rank}></UserRank>
            <UserName name={props.name}></UserName>
            <UserScore score={props.score}></UserScore>
        </div>
    )
}

export default GameHeader;