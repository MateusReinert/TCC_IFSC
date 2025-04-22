import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from '../modules/login/page/LoginPage';
import HomePage from '../modules/home/page/HomePage';
import UserSettings from '../modules/userSettings/page/UserSettings';
import Feed from '../modules/feed/page/Feed';
import UserList from '../modules/usersList/page/UserList';
import UserActiveList from '../modules/usersList/page/UserActiveList';

const Routers = () => {
    return (
        <Routes>
            <Route path="/Posts" element={<Feed />} />
            <Route path="/UserList" element={<UserList />} />
            <Route path="/UserActiveList" element={<UserActiveList />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/user/settings" element={<UserSettings />} />
        </Routes>
    );
};

export default Routers;
