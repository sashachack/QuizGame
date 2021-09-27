import { React, useContext } from 'react';
import GlobalContext from '../GlobalContext';


function BackButton(props) {
    // const [state, dispatch] = useGlobalState();
    const { setPage } = useContext(GlobalContext);
    return (
        <div onClick={() => setPage(props.page)}><p id="backButton">&#x279C;</p></div>
    );
}

export default BackButton;