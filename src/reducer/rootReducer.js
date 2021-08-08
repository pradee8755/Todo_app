const initialState = {
    usersTodo: [],
    registerUser: {},
    userTodoList: [],
    usersDetails: [],
    snackBarNotification: {}
};
export const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case "REGISTERUSER":
            return {
                ...state, registerUser: action.registerUser
            }
        case "USERSDETAILS":
            return {
                ...state, usersDetails: action.usersDetails
            }
        case "USERTODOLIST":
            return {
                ...state, userTodoList: action.userTodoList
            }
        case "SNACKBARNOTIFICATION":
            return {
                ...state, snackBarNotification: action.snackBarNotification
            }
        case "UPDATEDTODO":
            return {
                ...state, updatedTodo: action.updatedTodo
            }
        case "COMPLETEDTODO":
            return {
                ...state, completedTodo: action.completedTodo
            }
        default:
            return state
    }
};


