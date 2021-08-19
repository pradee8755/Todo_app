import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import Dashboard from "./components/todo-dashboard/todo-dashboard";
import Usersignup from "./components/todo-user-signup/todo-user-signup";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import PrivateRoute from "./components/todo-privateroute";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function App() {
  const userDetails = useSelector((state) => state.registerUser);
  const snackBarNotification = useSelector(
    (state) => state.snackBarNotification
  );
  const [open, setOpen] = useState(false);
  // const [loggedUserDetails, setLoggedUserDetails] = useState({});

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  // useEffect(() => {
  //   setLoggedUserDetails(userDetails);
  // }, [userDetails]);

  useEffect(() => {
    if (Object.keys(snackBarNotification).length > 0) {
      // setNotificationMsg({...snackBarNotification});
      setOpen(true);
    }
  }, [snackBarNotification]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <div>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert severity={snackBarNotification.type} onClose={handleClose}>
          {snackBarNotification.message}
        </Alert>
      </Snackbar>
      <Router>
        {userDetails.isUserLogin ? (
          <Redirect to="/dashboard" />
        ) : (
          <Redirect to="/login" />
        )}
        <Switch>
          <Route path="/dashboard" exact component={Dashboard} />
          <Route path="/login" exact component={Usersignup} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
