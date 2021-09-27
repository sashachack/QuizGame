import { NameForm, BackButton } from '../items';

function NameScreen(props) {
    return (
        <div className="enterName">
            <NameForm></NameForm>
            <BackButton page="join"></BackButton>
        </div>
    );
}

export default NameScreen;