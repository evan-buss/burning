import { Button } from "@material-ui/core";
import React from 'react';

const LandingPage: React.FC = () => {
    const listUsers = async () => {
        const token = localStorage.getItem("accessToken");
        const res = await fetch("http://localhost:8000/api/users", {
            headers: {
                "x-plex-token": token!,
                "x-client-id": localStorage.getItem("clientId")!
            }
        });

        console.log(await res.json())
    }

    const listUsersTwo = async () => {
        const token = localStorage.getItem("accessToken");
        const res = await fetch("http://localhost:8000/api/users_test", {
            headers: {
                "x-plex-token": token!,
                "x-client-id": localStorage.getItem("clientId")!
            }
        });

        console.log(await res.json())
    }

    return (
        <>
            <Button onClick={() => listUsers()}>List Users</Button>
            <Button onClick={() => listUsersTwo()}>List Users</Button>
        </>
    )
}

export default LandingPage;