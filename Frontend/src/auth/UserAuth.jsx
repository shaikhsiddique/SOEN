import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from "../context/UserContext";
import axois from '../config/axois';
import { useNavigate } from 'react-router-dom';

function UserAuth({children}) {
    const { user, setUser } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem("SOENtoken");

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        if (user) {
            setLoading(false);
            return;
        }

        axois.get('/user/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((res) => {
            setUser(res.data.data);
            setLoading(false);
        })
        .catch((err) => {
            navigate('/login');
            console.log(err);
        });
    }, [token, user, navigate, setUser]);

    if (loading) {
        return <h1>Loading...</h1>;
    }

    return <>{children}</>;
}

export default UserAuth;
