import React, { useState, useEffect } from "react";
import './todo-dashboard.css';
import todoLogo from "../../images/todoLogo.png";
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { v1 as uuidv1 } from 'uuid';
import { useSelector, useDispatch } from 'react-redux';
import { Clear } from '@material-ui/icons';

const  createTodo = { id: uuidv1(),todo: "", priority: "", status: "pending"};

export default function Dashboard() {
    const [createNewTodo, setCreateNewTodo] = useState(createTodo);
    const [updateTodoStatus, setUpdateTodoStatus] = useState({});
    const [updateForm, setupdateForm] = useState(false);
    const userTodoList = useSelector((state) => state.userTodoList);
    const [todoList, setTodoList] = useState([]);
    const dispatch = useDispatch();

    useEffect(()=> {
        let value = Object.keys(updateTodoStatus).length > 0 ?  true : false
        setupdateForm(value);
    },[updateTodoStatus]);

    useEffect(()=> {
        if(userTodoList.length > 0)
            setTodoList(userTodoList);
    },[userTodoList]);

    // Add new todo to the list
    const handleSubmit = (e) => {
        e.preventDefault();
            dispatch({ type: "USERTODOLIST", userTodoList: [createNewTodo, ...todoList] });
            dispatch({ type: "SNACKBARNOTIFICATION", snackBarNotification: {type : 'success', message: `Todo created successfully`} });
            setCreateNewTodo({...createTodo,id: uuidv1()});
    };

    // Update input values 
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setCreateNewTodo({
            ...createNewTodo,
            [name]: value
        });
    };

    // On select option change todo status to completed
    const changeStatus = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setUpdateTodoStatus(prevState => {
            return {...prevState,[name]: value};
        });
    };

    //logout 
    const onLogout = () => {
        dispatch({ type: "REGISTERUSER", registerUser: {}});
        dispatch({ type: "USERTODOLIST", userTodoList: [] });
        dispatch({ type: "SNACKBARNOTIFICATION", snackBarNotification: {type : 'success', message: `Logout successfully`} });
        return;

    }

    // Changed todo updated to the list 
    const updateStatus = (e) => {
        e.preventDefault();
        if(updateTodoStatus.status.toLowerCase() === 'completed') {
            let getTodoId = todoList.findIndex(ele=> ele.id === updateTodoStatus.id);
            let listOfTodos = todoList;
            listOfTodos.splice(getTodoId, 1);
            dispatch({ type: "USERTODOLIST", userTodoList: [updateTodoStatus, ...listOfTodos]});
            dispatch({ type: "SNACKBARNOTIFICATION", snackBarNotification: {type : 'success', message: `Todo updated successfully`} });
            setUpdateTodoStatus({});
        } else {
            dispatch({ type: "SNACKBARNOTIFICATION", snackBarNotification: {type : 'info', message: `Please update status`} });
        }
    };

    //Cancel status updation
    const cancelUpdate = () => {
        setUpdateTodoStatus({});
    };

    // To change status to update
    const updateTodo = (e) => {
        if(e.data.status.toLowerCase() !== 'completed') {
            setUpdateTodoStatus(prevState => {
                return {...prevState,...e.data};
            });
        }
    };
    return (
        <div className="dashContainer">
            <div className="header layout horizontal justified center-center">
                <div className="logoDiv layout horizontal center-center">
                    <img className="logo" alt="todoLogo" src={todoLogo} />
                </div>
                <div className="todoHead">MY TODO</div>
                <div className="logoutBtn layout horizontal center-center">
                    <button className="" onClick={onLogout}>Logout</button>
                </div>
            </div>
            <div className="DashBody layout horizontal">
                <div className="todoBody layout horizontal center-center">
                    <div className="listBody">
                        <div className="list">
                            <div className="ag-theme-alpine" style={{ height: 400, width: 590 }}>
                                <AgGridReact domLayout='autoWidth' onRowClicked={updateTodo} rowData={todoList}>
                                    <AgGridColumn field="todo" sortable={true}></AgGridColumn>
                                    <AgGridColumn field="priority" sortable={true}></AgGridColumn>
                                    <AgGridColumn field="status" sortable={true}></AgGridColumn>
                                </AgGridReact>
                            </div>
                        </div>
                    </div>
                </div>
                    <div className="todoSec layout horizontal center-center">
                        <div className="completeBtn layout horizontal">
                            <div className="layout vertical">
                                <form className="todoForm" onSubmit={handleSubmit}>
                                    <fieldset disabled={updateForm ? "disabled" : ''}>
                                    <div className="form-group">
                                        <label className="captionTxt">Todo</label>
                                        <input name="todo" type="text" value={createNewTodo.todo} onChange={handleChange} className="form-control" id="emailImput" placeholder="Enter new todo" required/>
                                    </div>
                                    <div className="form-group">
                                        <label className="captionTxt">Priority</label>
                                        <select name="priority" value={createNewTodo.priority} onChange={handleChange} className="form-control" required>
                                            <option value="">None</option>
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>
                                    <input type="submit" value="create" className="btn btn-primary" />
                                    </fieldset>
                                </form>
                                <div className="emptySpace"></div>
                                {updateForm ? 
                                <div className="layout horizontal">
                                    <form className="todoForm" onSubmit={updateStatus} >
                                        <div className="form-group">
                                            <label className="captionTxt">Update Status</label>
                                            <select name="status" value={updateTodoStatus.status} onChange={changeStatus} className="form-control" required>
                                                <option value="pending" disabled>Pending</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                        </div>
                                        <input type="submit" value="Update" className="btn btn-primary"/>
                                    </form>
                                    <Clear color="primary" style={{ fontSize: 20 }} onClick={cancelUpdate}/>
                                </div>:''}
                            </div>
                        </div>
                    </div>
            </div>
            <div className="footer"></div>
        </div>
    );
};
