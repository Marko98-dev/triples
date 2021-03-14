import Login from './Components/Login';
import PrivateRoute from './Components/PrivateRoute';
import Main from './Components/Main';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import ShowFiles from './Components/ShowFiles';
import Show from './Components/Show';

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
              <Link to="/show">ShowFiles</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route exact path="/show">
              <ShowFiles />
          </Route>
          <Route path="/show/:id">
            <Show />
          </Route>
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
