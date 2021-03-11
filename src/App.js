import Login from './Components/Login';
import PrivateRoute from './Components/PrivateRoute';
import Main from './Components/Main';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <PrivateRoute path="/" component={ Main }/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
