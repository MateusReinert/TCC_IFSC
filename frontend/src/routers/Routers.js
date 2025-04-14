import * as React from 'react';
import LoginPage from '../modules/login/page/LoginPage';
import HomePage from '../modules/home/page/HomePage';
import UserSettings from '../modules/userSettings/page/UserSettings';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Feed from '../modules/feed/page/Feed';
import UserList from '../modules/usersList/page/UserList';

const Routers = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Feed />} />
                <Route path="/UserList" element={<UserList />} />
                <Route path="/Post" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/user/settings" element={<UserSettings />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Routers;
