import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {BrowserRouter as Router} from 'react-router-dom'
import HomePage from './pages/HomePage';
import { Provider } from 'react-redux';
import store from './components/redux/store'

function App() {
  return (
    <div>
      <Router>
        <Provider store={store}>
        <HomePage/>
        </Provider>
      </Router>
      </div>
  );
}

export default App;
