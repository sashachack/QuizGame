import { React, useContext, useState, createContext, useEffect } from 'react';
import GlobalContext from '../GlobalContext';
import CreatorContext from '../context/CreatorContext';

const QuestionContext = createContext();
function QuestionBox(props) {
    // const [state, dispatch] = useGlobalState();
    const { page, setPage } = useContext(GlobalContext);
    const [count, setCount] = useState(0);
    const [q_object, setQ_Object] = useState({
        'Question 0': {
            'question': '',
            'answers': {
                'correct': '',
                'incorrect1': '',
                'incorrect2': '',
                'incorrect3': ''
            }
        }
    });

    const [q_object_store, setQ_Object_Store] = useState({
        'Question 0': {
            'question': '',
            'answers': {
                'correct': '',
                'incorrect1': '',
                'incorrect2': '',
                'incorrect3': ''
            }
        }
    });
    const [quiz_name, setQuizName] = useState('');
    const questionInfo = { count, setCount, q_object, setQ_Object, q_object_store, setQ_Object_Store, quiz_name, setQuizName };

    // let questionBox = <div className={classname}><p>{q_text_value}</p></div>;

    return (
        <div>
            <QuestionContext.Provider value={questionInfo}>
                <NameQuiz></NameQuiz>
                <AddQuestion></AddQuestion>
                <ClickedComponents></ClickedComponents>
                <SubmitQuiz></SubmitQuiz>
            </QuestionContext.Provider>
        </div>
    );
}

function ClickedComponents(props) {
    const { count, setCount, q_object, setQ_Object } = useContext(QuestionContext);
    const questions = Object.keys(q_object).map(key =>

        <div key={key}>
            <p>{key}</p>
            {q_object[key].question} <br></br>
            <p>Correct Answer</p>
            {q_object[key].answers.correct}
            <p>Incorrect Answers</p>
            {q_object[key].answers.incorrect1} <br></br>
            {q_object[key].answers.incorrect2} <br></br>
            {q_object[key].answers.incorrect3} <br></br>
        </div>


    )
    return questions;
}

function ComponentA(props) {
    const { count, setCount, q_object, setQ_Object, setQ_Object_Store } = useContext(QuestionContext);
    const [curQues, setCurQues] = useState('');
    // let numQues = '';

    function handleChange(e) {
        let numQues = "Question " + curQues;
        console.log("set question " + numQues + " to " + e.target.value)
        // let quesObj = 
        setQ_Object(prevObject => ({ ...prevObject, [numQues]: { ...prevObject[numQues], 'question': <ComponentA value={e.target.value} num_ques={curQues} /> } }));
        // let numQues = "Question " + curQues;
        // console.log("set question " + numQues + " to " + e.target.value)
        // let quesObj = 
        setQ_Object_Store(prevObject => ({ ...prevObject, [numQues]: { ...prevObject[numQues], 'question': e.target.value } }));
    }


    let quesName = 'creator_question ' + props.num_ques;
    // let quesName = 'creator_answer ' + props.num_ques;
    return (
        <div>

            <input type='text' onChange={n => handleChange(n)} onClick={() => setCurQues(props.num_ques)}
                className={quesName}></input>

        </div>

    );
}

function ComponentB(props) {
    const { count, setCount, q_object, setQ_Object, setQ_Object_Store } = useContext(QuestionContext);
    const [curQues, setCurQues] = useState('');


    // let numQues = '';
    //User effect so we know that we change current answer
    //before we do anything else on screen


    function handleAnswerChange(e) {
        let numQues = "Question " + curQues;
        console.log("set correct answer of" + numQues + " to " + e.target.value)

        //... is when we spread the object to make sure that the rest of 
        //the object is still instact when we set it to something else (our input)
        setQ_Object(prevObject => ({
            ...prevObject,
            [numQues]: {
                ...prevObject[numQues],
                answers: {
                    ...prevObject[numQues].answers,
                    correct: <ComponentB value={e.target.value} num_ques={curQues} />,
                }
            }
        }));

        setQ_Object_Store(prevObject => ({
            ...prevObject,
            [numQues]: {
                ...prevObject[numQues],
                answers: {
                    ...prevObject[numQues].answers,
                    correct: e.target.value
                }
            }
        }));
        // console.log("set answer " + curAns + " of" + numQues + " to " + q_object[numQues].answers.letter_ans.props)
    }
    // let quesName = 'creator_question ' + props.num_ques;
    // let quesName = 'creator_answer ' + props.letter_ans


    return (
        <div>
            <input type='text' onChange={n => handleAnswerChange(n)}
                onClick={() => setCurQues(props.num_ques)}
                className='correct_ans'></input> <br></br> <br></br>
        </div>

    );
}

function ComponentC(props) {
    const { count, setCount, q_object, setQ_Object, setQ_Object_Store } = useContext(QuestionContext);
    const [curQues, setCurQues] = useState('');


    // let numQues = '';
    //User effect so we know that we change current answer
    //before we do anything else on screen


    function handleIncAnswerChange(e) {
        let numQues = "Question " + curQues;

        let numInc = 'incorrect' + props.num_inc;
        console.log("set " + numInc + " of" + numQues + " to " + e.target.value)
        //... is when we spread the object to make sure that the rest of 
        //the object is still instact when we set it to something else (our input)
        setQ_Object(prevObject => ({
            ...prevObject,
            [numQues]: {
                ...prevObject[numQues],
                answers: {
                    ...prevObject[numQues].answers,
                    [numInc]: <ComponentC value={e.target.value} num_ques={curQues} num_inc={props.num_inc} />,
                }
            }
        }));

        setQ_Object_Store(prevObject => ({
            ...prevObject,
            [numQues]: {
                ...prevObject[numQues],
                answers: {
                    ...prevObject[numQues].answers,
                    [numInc]: e.target.value
                }
            }
        }));
    }
    // let quesName = 'creator_question ' + props.num_ques;
    // let quesName = 'creator_answer ' + props.letter_ans


    return (
        <div>
            <input type='text' onChange={n => handleIncAnswerChange(n)}
                onClick={() => setCurQues(props.num_ques)} className='inc_correct_ans'></input> <br></br>
        </div>

    );
}



function AddQuestion() {
    const { count, setCount, q_object_store, setQ_Object, setQ_Object_Store, q_object } = useContext(QuestionContext);
    function handleAddButton() {
        setCount(count + 1)

    }
    useEffect(() => {
        let newQues = "Question " + count;
        // console.log(newQues);
        setQ_Object(prevObject => ({
            ...prevObject,
            [newQues]: {
                'question': <ComponentA num_ques={count} />,
                'answers': {
                    'correct': <ComponentB num_ques={count} num_inc='' />,

                    'incorrect1': <ComponentC num_ques={count} num_inc='1' />,
                    'incorrect2': <ComponentC num_ques={count} num_inc='2' />,
                    'incorrect3': <ComponentC num_ques={count} num_inc='3' />
                }
            }
        }
        )
        );
        setQ_Object_Store(prevObject => ({
            ...prevObject,
            [newQues]: {
                'question': '',
                'answers': {
                    'correct': '',

                    'incorrect1': '',
                    'incorrect2': '',
                    'incorrect3': ''
                }
            }
        }
        )
        );


        // console.log(count)
        // console.log(q_object_store)
        // console.log(q_object)
    }, [count])

    return (
        <button onClick={handleAddButton}>Add Question</button>
    )
}

function NameQuiz() {
    const { quiz_name, setQuizName } = useContext(QuestionContext);
    function handleNameQuiz(e) {
        setQuizName(e.target.value)
    }
    function handleSubmitName() {
        console.log(quiz_name);
    }
    return (
        <div>
            <label>Name Quiz: </label><input type='text' onChange={handleNameQuiz}></input>
            {/* <button onClick={handleSubmitName}>Save Name </button> */}
        </div>
    )
}

function SubmitQuiz() {
    const { page, setPage, socket } = useContext(GlobalContext);
    const { q_object_store, quiz_name } = useContext(QuestionContext);
    const { creator } = useContext(CreatorContext);
    function handleSubmitQuiz() {
        console.log("The name of your quiz is " + quiz_name)
        console.log('The creator id of the quiz is ' + creator)
        console.log(q_object_store);

        socket.emit('submit_quiz', { 'quiz': q_object_store, 'quiz_name': quiz_name, creator: creator })


    }

    useEffect(() => {
        // socket.
    })
    return (

        <button onClick={handleSubmitQuiz}>Submit Quiz</button>
    )
}

export default QuestionBox;