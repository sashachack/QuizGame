import { React, useState, useContext } from 'react';
import GlobalContext from './GlobalContext';
import { Quiz, CreateScreen, CreatorPage, Game, JoinScreen, Login, NameScreen, SignUp, StartScreen, CreateGame, SavedGames, StartGame, UserInfo, HostGame } from './pages';
import UserContext from './context/UserContext';
import CreatorContext from './context/CreatorContext';

function Page() {
    const { page } = useContext(GlobalContext);
    // const page = "hostgame";
    // const { user_obj, setUserObj } = React.useContext(UserObjContext);
    const [username, setUsername] = useState('');
    const [roomcode, setRoomcode] = useState('');
    const [creator, setCreator] = useState('');
    const [editCode, setEditCode] = useState('');
    const userContInfo = { username, roomcode, setUsername, setRoomcode }
    const creatorContInfo = { creator, setCreator, editCode, setEditCode }

    return (
        <div>
            {page === "start" && ((<StartScreen></StartScreen>))} {/*<Quiz></Quiz>*/}
            {page === "create" && (<CreateScreen></CreateScreen>)} {/*(<HostGame></HostGame>)*/}
            <UserContext.Provider value={userContInfo}>
                {page === "join" && (<JoinScreen></JoinScreen>)}
                {page === "name" && (<NameScreen></NameScreen>)}
                {page === "game" && (<Game></Game>)}
            </UserContext.Provider>
            <CreatorContext.Provider value={creatorContInfo}>
                {page === "hostgame" && (<HostGame></HostGame>)}
                {page === "login" && (<Login></Login>)}
                {page === "sign up" && (<SignUp></SignUp>)}
                {page === "creator_home" && (<CreatorPage></CreatorPage>)}
                {/* {page === "create_game" && (<CreateGame></CreateGame>)} */}
                {page === "quiz" && (<Quiz></Quiz>)}
                {page === "manage/start games" && (<StartGame></StartGame>)}
                {page === "user_info" && (<UserInfo></UserInfo>)}
                {page === "saved_games" && (<SavedGames></SavedGames>)}
            </CreatorContext.Provider>
        </div>
    );
}

export default Page;