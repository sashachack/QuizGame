import { React, useContext } from 'react';
import GlobalContext from '../GlobalContext';


function Box(props) {
    // const [state, dispatch] = useGlobalState();
    const { setPage } = useContext(GlobalContext);

    const name = props.name;
    const classname = 'box ' + props.just;
    return (
        <div onClick={() => setPage(name.toLowerCase())} className={classname}>
            <p>{name}</p>
        </div>
    );
}

export default Box;