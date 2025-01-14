import React, { useState, useEffect } from "react";

function Info() {
    const [userInfo, setUserInfo] = useState(null);  // שומר את המידע של המשתמש
    const [loading, setLoading] = useState(true);    // משתנה שמנהל את מצב הטעינה
    const [error, setError] = useState(null);        // משתנה שמנהל את שגיאות הקריאה

    useEffect(() => {
        const fetchUserInfo = async () => {
            // שליפת המידע על המשתמש מ-localStorage
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));

            if (currentUser) {
                try {
                    // ביצוע קריאה ל-API לשליפת המידע
                    const response = await fetch(`http://localhost:3000/users/${currentUser.id}`, {
                        method: "GET",
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setUserInfo(data);  // עדכון המידע של המשתמש
                    } else {
                        setError("Failed to load user information.");
                    }
                } catch (error) {
                    setError("Error fetching user information.");
                } finally {
                    setLoading(false);
                }
            } else {
                setError("User not logged in.");
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    if (loading) {
        return <p>Loading...</p>;  // אם המידע עדיין נטען
    }

    if (error) {
        return <p>{error}</p>;  // אם יש שגיאה כלשהי
    }

    return (
        <div>
            <h3>Personal Information</h3>
            <p><strong>Name:</strong> {userInfo.name}</p>
            <p><strong>Username:</strong> {userInfo.username}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
            <p><strong>Address:</strong> {userInfo.address.street}, {userInfo.address.city}</p>
            <p><strong>Phone:</strong> {userInfo.phone}</p> 
            <h4>Company Information</h4>
            <p><strong>Company Name:</strong> {userInfo.company.name}</p>
            <p><strong>Catch Phrase:</strong> {userInfo.company.catchPhrase}</p>
            <p><strong>BS:</strong> {userInfo.company.bs}</p>
        </div>
    );
}

export default Info;
