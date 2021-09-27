import { JoinForm, BackButton } from '../items';

function JoinScreen(props) {
    return (
        <div className="enterCode">
            <JoinForm></JoinForm>
            <BackButton page="start"></BackButton>
        </div>
    );
}

export default JoinScreen;