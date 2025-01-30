import * as React from 'react';
import LoginPage from '../modules/login/page/LoginPage';
import HomePage from '../modules/home/page/HomePage';
import UserSettings from '../modules/userSettings/page/UserSettings';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const Routers = () => {
    return (
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} /> 
                    <Route path="/user/settings" element={<UserSettings />} /> 
                </Routes>
            </Router>
    );
};

export default Routers;