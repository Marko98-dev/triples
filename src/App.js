import UploadFiles from './Components/UploadFiles';
import Login from './Components/Login';
import PrivateRoute from './Components/PrivateRoute';

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
            <li>
              <Link to="/secret">Secret</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/secret">
            <Secret />
          </Route>
          <PrivateRoute path="/" component={ UploadFiles }/>
        </Switch>
      </div>
    </Router>
  );
}

function Secret() {
  return <h2>Secret</h2>;
}

export default App;
