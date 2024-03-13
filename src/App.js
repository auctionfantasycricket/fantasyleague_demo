import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { NavBar } from './components/NavBar';
import HomePage from './pages/HomePage';
import { Provider } from 'react-redux';
import store from './components/redux/store'
import { AllPlayers } from './pages/Players';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();


function App() {
  return (
    
    <div>
      
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
        
        <Router>
        <NavBar/>
        <Routes>
        <Route path="/efl2024_first" element={<HomePage />} />
        <Route path="/players" element={<AllPlayers />} />
        </Routes>
        </Router>
        </Provider>
        </QueryClientProvider>
      </div>
      
  );
}

export default App;
