import './App.css';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Register from './pages/Register/Register';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

function App(props) {
  const display = () => {
    if (props.authorization.isLogin) {
      return (
            <Home />
      )
    } else {
      return (
        <Router>
          <Switch>
            <Route path="/dang-ki" component={Register} />
            <Login />
            </Switch>
        </Router>
      )
    }
  }

  return (
    <div className="App">
      {display()}
      {/* <Login/> */}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    authorization: state.authorization
  }
};

export default connect(mapStateToProps, null)(App);
