import React from 'react';

function UserRank(props) {
    let end = "";
    let dig = parseInt(props.rank, 10) % 10;
    switch (dig) {
        case '':
            end = '';
            break;
        case 1:
            end = "st";
            break;
        case 2:
            end = "nd";
            break;
        case 3:
            end = "rd";
            break;
        default:
            end = "th";
            break;
    }
    let place = props.rank === '' ? '' : props.rank.toString() + end;
    return (
        <strong id="userRank">{place}</strong>
    );
}

export default UserRank;