import React, { useState } from "react";

function CompleteRegistration() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [phone, setPhone] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [catchPhrase, setCatchPhrase] = useState("");
    const [bs, setBs] = useState("");

    async function handleSave() {
        if (
            !name ||
            !username ||
            !street ||
            !city ||
            !phone ||
            !companyName ||
            !catchPhrase ||
            !bs
        ) {
            alert("All fields are required.");
            return;
        }

        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) {
            alert("User not found.");
            return;
        }

        try {
            // עדכון פרטי המשתמש בשרת
            const updatedUser = {
                ...currentUser,
                name,
                username,
                address: {
                    street,
                    city,
                },
                phone,
                company: {
                    name: companyName,
                    catchPhrase,
                    bs,
                },
            };

            await fetch(`http://localhost:3000/users?email=${currentUser.email}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedUser),
            });

            storeUserInLocalStorage();
            alert("Profile updated successfully!");
            window.location.href = "/home";
        } catch (error) {
            console.log("Error updating profile:", error);
            alert("Something went wrong. Please try again.");
        }
    }

    async function storeUserInLocalStorage(){
        const user = JSON.parse(localStorage.getItem("currentUser"));
        const email = user.email;
        try {
            const response = await fetch(`http://localhost:3000/users?email=${email}`, { method: 'GET' });
            if (response.ok) {
                const user = await response.json(); 
                localStorage.setItem("currentUser", JSON.stringify(user));
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h2>Complete Your Profile</h2>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="text"
                placeholder="Street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
            />
            <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
            />
            <input
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <input
                type="text"
                placeholder="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Catch Phrase"
                value={catchPhrase}
                onChange={(e) => setCatchPhrase(e.target.value)}
            />
            <input
                type="text"
                placeholder="Business Slogan"
                value={bs}
                onChange={(e) => setBs(e.target.value)}
            />
            <button onClick={handleSave}>Save</button>
        </div>
    );
}

export default CompleteRegistration;
