import { Box, BackButton } from '../items';

function CreateScreen() {
    return (
        <div>
            <div className='boxes'>
                <Box name="Login" just="right"></Box>
                <Box name="Sign Up" just="left"></Box>
            </div>
            <BackButton page="start"></BackButton>
        </div>
    )
}

export default CreateScreen;