import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from "./comps/Dashboard";
import Auth from './comps/Auth';
import AdminRoutes from './comps/AdminRoutes';
import backend from "./comps/config"

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    var token = window.localStorage.getItem("token");
    fetch(`${backend}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 'token': token }),
    })
      .then((response) => response.json())
      .then((data) => setIsAuthenticated(data.auth))
      .catch((error) => console.error("Error fetching godowns:", error));
  }, []);

  const auth = (boolean) => {
    setIsAuthenticated(boolean);
  }

  const unAuth = () => {
    setIsAuthenticated(false);
    window.localStorage.removeItem("token");
  }

  return (
    <Router>
      <div>
        <Routes>
          <Route element={<AdminRoutes isAuthenticated={isAuthenticated}/>}>
            <Route path="/" element={<Dashboard unAuth={unAuth}/>} />
          </Route>
          <Route path="/authenticate" element={<Auth verify={auth} isAuthenticated={isAuthenticated}/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
