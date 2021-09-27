const app = require('express')();
const http = require('http').createServer(app);
const socketio = require('socket.io');
let admin = require("firebase-admin");

// let serviceAccount = require("./serviceAccountKey.json");
let serviceAccount = require("./sasha-firebase.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: 'https://quiz.firebaseio.com'
    databaseURL: 'https://quiz-game.firebaseio.com'
});
// let app = admin.initializeApp();

const db = admin.firestore();
// console.log(db);
const getQuizByName = async (name) => {
    const quizzes = db.collection('quizzes');
    const snapshot = await quizzes.where('quiz_name', '==', name).get();
    if (snapshot.empty) {
        console.log("uh");
        return;
    }
    snapshot.forEach(doc => {
        console.log(doc.data());
    });
};

const getQuizByCode = async (code) => {
    const quizzes = db.collection('quizzes').doc(code);
    const doc = await quizzes.get();
    if (!doc.exists) {
        console.log(`No quiz found with code ${code}`);
        return;
    }
    return doc.data();
    // console.log(snap[0].data());
    // return snap[0];
};

// getQuizByCode("6891").then(doc => {
//     console.log(doc);
// });

const getQuizzesByCreatorId = async (id) => {
    const quizzes = db.collection('quizzes');
    const snap = await quizzes.where('creatorId', '==', id).get();
    if (snap.empty) {
        console.log('This user has no quizzes!');
        return null;
    }
    let arr = [];
    snap.forEach(doc => {
        let thing = doc.data();
        thing.roomCode = doc.id;
        arr.push(thing);
    });
    return arr;
}

const getRoomCodes = async () => {
    const quizzes = db.collection('quizzes').doc('rooms');
    const doc = await quizzes.get();
    if (!doc.exists) {
        console.log("failed");
        return null;
    }
    else {
        return doc.data().codes;
    }
}

// getQuiz('Basic Facts');
// getQuizzesByCreatorId("i4pArCZaNKcnmUTK4nM2IA0muJ02").then(arr => {
//     if (arr) {
//         for (doc of arr) {
//             console.log(doc);
//         }
//     }
// });

// getRoomCodes().then(arr => {
//     if (arr) {
//         console.log(arr);
//     }
// });

// .then((docs) => {
//     docs.forEach(doc => {
//         console.log(doc.data());
//     });
// });

const io = socketio(http, {
    cors: {
        origin: 'http://172.27.123.188:3000',
        methods: ['GET', 'POST']
    }
});

let data =
{
    rooms: {
    }
};


const endGame = async (room, socket) => {
    console.log("Game Over for room " + room);
    io.to(room).emit('gameOver');

    // const s = await io.of('/').in(room).fetchSockets();
    // const sock = io.of('/').connected[s[0]];
    socket.leave(room);

    delete data.rooms[room];
    // let ppl = io.sockets.adapter.rooms[room];
    // console.log(ppl);
    // ((error, sIds) => {
    //     if (error) throw error;
    //     sIds.forEach((s) => io.sockets.connected[s].disconnect(true));
    // });
    // io.of('/').in(room).disconnectSockets();
    io.socketsLeave(room);
    console.log(data);
};

const roundOver = (room) => {
    console.log('all users have answered');
    data.rooms[room].stats.round++;
    io.to(room).emit('playerChange', { players: rankPlayers(room) })
    if (data.rooms[room].stats.round === data.rooms[room].questions.length) {
        // endGame(room);
        io.to(room).emit('allRoundsOver');
        return;
    }
    io.to(room).emit('roundOver');
    for (person of data.rooms[room].users) {
        person.answered = false;
    }

}

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function joinRoom(room, socket) {
    const ans = Object.keys(data.rooms).includes(room);
    if (ans) {
        console.log(`Someone successfully joined room ${room}`);
        socket.join(room);
        socket.room = room;
        socket.emit("joinRoom", { res: 1, room: room });
    }
    else {
        console.log(room + ' is not valid');
        socket.emit("joinRoom", { res: 0, room: room });
    }
}

function joinWithName(name, room, socket) {
    console.log(`Does room ${room} already include ${name}?`);
    let failure = false;
    for (user of data.rooms[room].users) {
        if (user.name === name) {
            failure = true;
            break;
        }
    }
    if (failure) {
        console.log("Name taken");
        socket.emit('join-with-name', { res: 0, name: name, reason: 'name_taken' });
    }
    else {
        socket.username = name;
        console.log("Name available");
        data.rooms[room].users.push({ name: name, answered: false, score: 0 });
        console.log(data.rooms);
        socket.emit('join-with-name', { res: 1, name: name, reason: 'na' });
        console.log('Here we are')
        console.log(data.rooms[room].users);
        //io.to(room)
        io.to(room).emit('playerChange', { players: data.rooms[room].users })
    }
}

function rankPlayers(room) {
    const info = data.rooms[room].users;
    info.sort((a, b) => {
        return b.score - a.score;
    });
    console.log("Sorted order is:");
    // console.log(info);
    return info;
}



io.on('connection', (socket) => {
    console.log("user connected");
    // console.log(firebase);


    socket.on('joinRoom', (room) => {
        joinRoom(room, socket);
    });
    socket.on('join-with-name', ({ name, room }) => {
        joinWithName(name, room, socket);
    });
    socket.on('userClick', ({ user, ans }) => {
        // console.log(`${user} clicked on ${ans}; is it correct?`);
        const pointCalc = (round) => {
            return 100 + 50 * round;
        }
        let points = pointCalc(data.rooms[socket.room].stats.round)
        let count = 0;
        for (this_user of data.rooms[socket.room].users) {
            if (this_user.name === user) {
                if (ans)
                    this_user.score += points;
                this_user.answered = true;
                count++;
                // break;
            }
            else if (this_user.answered)
                count++;
        }
        console.log('the count is: ' + count);
        console.log('the players are: ' + data.rooms[socket.room].users.length)
        if (ans) {
            console.log(`${user} was correct! They earned ${points} points.`);

        }
        else {
            console.log(`${user} was incorrect :(`);
        }
        if (count === data.rooms[socket.room].users.length) {
            roundOver(socket.room);
        }

        // rankPlayers(socket.room);
    });

    socket.on('startGame', ({ code }) => {
        console.log(`Start game: ${code}`);
        // io.to(code)

        let round = data.rooms[code].stats.round;
        console.log(round);
        console.log(data.rooms[code].questions[round]);
        // { q: 'How many days are in a week?', a: ['7', '4', '9', '2'] }
        let { q, c, i1, i2, i3 } = data.rooms[code].questions[round];
        let temp = [c, i1, i2, i3];
        console.log(temp);
        shuffle(temp);
        console.log(temp);
        let question = { q: q, a: temp, c: temp.indexOf(c) }
        io.to(code).emit('startGame', question);
    });
    socket.on('roundOver', ({ code }) => roundOver(code));

    socket.on('hostGame', async (code) => {
        let quiz = await getQuizByCode(code);
        data.rooms[code] = quiz;
        socket.join(code);
        // delete data.rooms[code].roomCode;
        data.rooms[code].users = [];
        data.rooms[code].stats = { round: 0 };
        console.log(data);
        console.log(data.rooms[code]);

    });
    socket.on('getQuizNamesById', async (id) => {
        console.log('get all quizes from this user');
        const quizzes = await getQuizzesByCreatorId(id);
        console.log('User quizzes is ' + quizzes)
        let ans; //needed to declare ans out here
        if (quizzes != null) {
            ans = quizzes.map((x) => {
                return { name: x.name, code: x.roomCode };
            });
        }
        else {
            ans = []; //Fixed sign up here
        }
        socket.emit('getQuizNamesById', ans);
    });
    socket.on('creatorSignUp', (data) => {
        console.log(data);
        // console.log(db);
        admin
            .auth()
            .createUser({
                email: data.signin_email,
                emailVerified: false,

                password: data.signin_pass,
                // displayName: data.signin_user
            })
            .then((userRecord) => {
                // See the UserRecord reference doc for the contents of userRecord.
                let data = { 'signin': true, creatorId: userRecord.uid }
                socket.emit('creatorSignUp', data)
                console.log('Successfully created new user:', userRecord.uid);
            })
            .catch((error) => {
                console.log('Error creating new user:', error);
                err_message = error.message;
                socket.emit('creatorSignUp', { 'signin': false, 'err_message': err_message })
            });
    })

    // socket.once('get_quizzes', (data) => {
    //     getQuizzesById(data.creator).then(arr => {
    //         // for (doc of arr) {
    //         //     console.log(doc);
    //         // }
    //         console.log('You are trying to get your quizzes....')
    //         socket.emit('get_quizzes', { 'quiz_arr': arr })
    //     });


    // });

    socket.on('get_one_quiz', async (code) => {
        console.log('Get quiz at room ' + code);
        const quiz = await getQuizByCode(code);
        socket.emit('get_one_quiz', quiz);
    });

    socket.on('getUsername', (data) => {
        console.log('User id is ' + data.creator)
        admin
            .auth()
            .getUser(data.creator)
            .then((userRecord) => {
                // See the UserRecord reference doc for the contents of userRecord.
                console.log('Successfully fetched user data:' + userRecord);
                socket.emit('getUsername', { user_obj: userRecord })
            })
            .catch((error) => {
                console.log('Error fetching user data:', error);
            });
    })

    socket.on('createQuiz', async (id) => {
        console.log("let's create a quiz!");
        let codes = await getRoomCodes();
        let gen_code = Math.floor(Math.random() * 10000);
        while (codes.includes(gen_code)) {
            gen_code = Math.floor(Math.random() * 10000);
        }
        const rooms = db.collection('quizzes').doc('rooms');
        await rooms.update({ codes: admin.firestore.FieldValue.arrayUnion(gen_code.toString()) });

        const temp = { creatorId: id, name: 'Untitled', questions: [] };
        await db.collection('quizzes').doc(gen_code.toString()).set(temp);

        socket.emit('quizCreated', gen_code.toString());
    });

    socket.on('submit_quiz', async ({ quiz, code }) => {
        const res = await db.collection('quizzes').doc(code).delete();
        await db.collection('quizzes').doc(code).set(quiz);
        socket.emit('quizSaved');
    })

    socket.on('deleteQuiz', async (code) => {
        const res = await db.collection('quizzes').doc(code).delete();
        console.log(`Quiz ${code} succesfully deleted`);
    });

    socket.on('endGame', (code) => {
        endGame(code, socket);
    });

    // socket.on('logout', () => {
    //     // console.log('LOGOUT THIS ONE');
    // });

    socket.on('disconnect', () => {
        if (socket.room) {
            if (data.rooms[socket.room]) {
                data.rooms[socket.room].users = data.rooms[socket.room].users.filter((x) => x.name != socket.username);
                // delete data.rooms[socket.room].users[socket.username];
                console.log(`${socket.username} disconnected from ${socket.room}`);
                io.emit('playerChange', { players: data.rooms[socket.room].users });
            }
        }
    });
});

http.listen(5000, function () {
    console.log('listening on port 5000');
});
