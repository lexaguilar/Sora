import { GET_USER } from "./userActionTypes";

const user = {
    corteId: 2,
    username: 'aaguilare',
};

export default function getUserReducer(state = user, action) {
    switch (action.type) {
        case GET_USER:

            return state;

        default:
            return state;
    }

}