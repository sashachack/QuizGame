import React from 'react';
import { Nav } from '../items';
import { QuestionBox } from '../items'

function CreateGame() {
    return (
        <div>
            <nav id='nav_bar'>
                <Nav on='on_true' action='create_game' name='Create a Game'></Nav>
                <Nav on='on_false' action='start_game' name='Start a Game'></Nav>
                <Nav on='on_false' action='saved_games' name='Saved Games'></Nav>
                <Nav on='on_false' action='user_info' name='User Info'></Nav>
                <Nav on='on_false' action='creator_home' name='Home'></Nav>

            </nav>
            <div id='game_creator'>
                {/* <AddQuestion ></AddQuestion> */}
                <QuestionBox></QuestionBox>

            </div>
        </div>
    );
}

export default CreateGame;