import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Generator from "./pages/Generator/Generator";
import Consumer from "./pages/Consumer/Consumer";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          <Generator />
        </Route>
        <Route path='/consumer'>
          <Consumer />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
