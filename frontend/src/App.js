import React from "react";
import './App.css';
import Layout from './structure/Layout';
import { Route, Routes } from 'react-router-dom';
import RequireAuth from './config/RequireAuth';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { ROUTES, PUBLIC_ROUTES } from "./config/routes";

function App() {
  return (
      <Routes>
          <Route path={ROUTES.BASE.path} element={<Layout />}>
            {/* protected routes */}
            <Route element={<RequireAuth />}>
                {Object.values(ROUTES).map(route => (
                  <Route path={route.path} element={<route.component />} />
                ))}
            </Route>

            {/* public routes */}
            <Route exact path={PUBLIC_ROUTES.LOGIN.path} element={<Login />}/>
            <Route exact path={PUBLIC_ROUTES.REGISTER.path} element={<Register />}/>
          </Route>
      </Routes>
  )
}

export default App;
