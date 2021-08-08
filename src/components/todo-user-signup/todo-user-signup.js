import React, {useState,useEffect} from "react";
import './todo-user-signup.css';
import'../../lib/flex-css.css';
import todoWall from "../../images/todo.jpg";
import { useSelector, useDispatch } from 'react-redux';
import CryptoJS from 'crypto-js';

const login = { email: "", password: "" };
const register = { name: "", rePass: "", password: "", email: "" };

export default function Usersignup() {
    const registerUsersDeatils = useSelector((state) => state.usersDetails);
    const [selectedTab, setselectedTab] = useState("login");
    const [loginDetails, setLoginDetails] = useState(login);
    const [registerDetails, setregisterDetails] = useState(register);
    const [usersDetails, setUsersDetails] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        setUsersDetails([...registerUsersDeatils]);   
    }, [registerUsersDeatils]);

    // Update input values 
    const handleChange = (e) => {
            selectedTab === "login" ?
                setLoginDetails({
                    ...loginDetails,
                    [e.target.name]: e.target.value
                }) : setregisterDetails({
                    ...registerDetails,
                    [e.target.name]: e.target.value
                })
    };

    // To switch between Login and Register
    const handleTab = (e) => {
        setselectedTab(e.target.value);
        setLoginDetails({ ...login });
        setregisterDetails({ ...register });
    }

    // Submit 
    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedTab === 'register' && registerDetails.password !== registerDetails.rePass) {
            dispatch({ type: "SNACKBARNOTIFICATION", snackBarNotification: {type : 'error', message: 'Please provide valid password'} });
            return;
        }
            if(selectedTab === 'register'){
                let registerUser = usersDetails.find((item)=> {
                    if(item.mailId === e.target.email.value){
                        return true;
                    }
                });
                if(!registerUser) {
                    let newUser = {
                        mailId: e.target.email.value,
                        name: e.target.name.value,
                        password: CryptoJS.AES.encrypt(e.target.password.value, 'clairvoyant').toString()
                    };
                    dispatch({ type: "USERSDETAILS", usersDetails:  [...registerUsersDeatils, newUser]});    
                    dispatch({ type: "SNACKBARNOTIFICATION", snackBarNotification: {type : 'success', message: `Register successfully`} });
                    setregisterDetails(register);
                } else {
                    dispatch({ type: "SNACKBARNOTIFICATION", snackBarNotification: {type : 'warning', message: `User already register with same mailid`} });
                }
            } else if(selectedTab === 'login') {
                if(usersDetails) {
                    let checkExistingUser = usersDetails.find((ele)=> ele.mailId === e.target.email.value && CryptoJS.AES.decrypt(ele.password, 'clairvoyant').toString(CryptoJS.enc.Utf8) === e.target.password.value);
                    if(checkExistingUser) {
                        dispatch({ type: "REGISTERUSER", registerUser: {...checkExistingUser, isUserLogin: true} });
                        dispatch({ type: "SNACKBARNOTIFICATION", snackBarNotification: {type : 'success', message: `Loggedin successfully`} });
                    } else { 
                        dispatch({ type: "SNACKBARNOTIFICATION", snackBarNotification: {type : 'error', message: `User does't exists`} });
                    }
                    setLoginDetails(login);
                } else {
                    dispatch({ type: "SNACKBARNOTIFICATION", snackBarNotification: {type : 'error', message: `No register users`} });
                }
            }
    }


    return (
        <div className="constainer layout vertical">
            <div className="body layout horizontal">
                <img className="wall layout horizontal center-center" alt='todoWall' src={todoWall}></img>
                <div className="form layout vertical justified">
                    <div className="buttonType layout horizontal center-center end">
                        <div className="buttons layout horizontal justified">
                            <input type="submit" value="login" className="btn btn-outline-primary" onClick={handleTab} />
                            <input type="submit" value="register" className="btn btn-outline-primary" onClick={handleTab} />
                        </div>
                    </div>
                    <div className="formInput layout vertical center">
                        {selectedTab === 'login' ?
                            <form className="todoForm" onSubmit={handleSubmit} >
                                <div className="form-group">
                                    <label >Email</label>
                                    <input name="email" type="email" required value={loginDetails.email} onChange={handleChange} className="form-control" id="emailImput" placeholder="email@domain.com" />
                                </div>
                                <div className="form-group">
                                    <label for="passImput">Password</label>
                                    <input name="password" type="password" required value={loginDetails.password} onChange={handleChange} className="form-control" id="passImput" placeholder="Password" />
                                </div>
                                <input type="submit" value="Submit" className="btn btn-primary" />
                            </form> :
                            <form className="todoForm" onSubmit={handleSubmit} >
                                <div className="form-group">
                                    <label for="nameImput">Name</label>
                                    <input type="text" name="name" required value={registerDetails.name} onChange={handleChange} className="form-control" id="nameImput" placeholder="Name" minlength="5" />
                                </div>
                                <div className="form-group">
                                    <label for="emailImput">Email</label>
                                    <input name="email" type="email" required value={registerDetails.email} onChange={handleChange} className="form-control" id="emailImput" placeholder="email@domain.com" minlength="8" />
                                </div>
                                <div className="form-group">
                                    <label for="passImput">Password</label>
                                    <input name="password"  min="4" type="password" required value={registerDetails.password} onChange={handleChange} className="form-control" id="passImput" placeholder="Password" minlength="4"/>
                                </div>
                                <div className="form-group">
                                    <label for="rePassImput">Re-Password</label>
                                    <input name="rePass" min="4" type="password" required value={registerDetails.rePass} onChange={handleChange} className="form-control" id="rePassImput" placeholder="Re-Password" minlength="4"/>
                                </div>
                                <input type="submit" value="Submit" className="btn btn-primary" />
                            </form>}
                    </div>
                </div>
            </div>
            <div className="footer layout horizontal center-center"></div>
        </div>
    );
  }

