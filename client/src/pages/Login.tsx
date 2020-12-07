import { Button, Grid, makeStyles, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { v4 } from "uuid";
import { useGlobalStyles } from "../App";
import { getTokenFromPin, Credentials, getAuthURL, getPin, isTokenValid } from "../services/auth";

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const useStyles = makeStyles({
    title: {
        fontSize: "2em",
    },
    plexButton: {
        marginTop: "2em",
        padding: "1em"
    }
});

const LoginPage: React.FC = () => {
    const query = useQuery();
    const classes = useStyles();
    const [authURL, setAuthURL] = useState<string>("");
    const [disabled, setDisabled] = useState(true);
    const history = useHistory();
    const globalClasses = useGlobalStyles();

    const [credentials, setCredentials] =
        useState({
            accessToken: localStorage.getItem("accessToken") ?? undefined,
            clientId: localStorage.getItem("clientId") ?? v4(),
            pins: {
                id: sessionStorage.getItem("pinId") ?? null,
                code: sessionStorage.getItem("pinCode") ?? null
            }
        } as Credentials);


    //1) Choose a unique app name, like “My Cool Plex App”
    //2) Check storage for your app’s Client Identifier; generate and store one if none is present.
    //3) Check storage for the user’s Access Token; if present, verify its validity and carry on.
    //4) If an Access Token is missing or invalid, generate a PIN, and store its id.
    //5) Construct an Auth App url and send the user’s browser there to authenticate.
    //6) After authentication, check the PIN’s id to obtain and store the user’s Access Token.
    useEffect(() => {
        localStorage.setItem("clientId", credentials.clientId);

        if (credentials.accessToken) {
            history.push('/home');
            return;
        }

        // User logged in. Get their access token.
        if (query.has("postback")) {
            console.log("WE GOT A POSTBACK");
            getTokenFromPin(credentials.clientId, credentials.pins.id, credentials.pins.code)
                .then(authToken => {
                    setCredentials(creds => {
                        creds.accessToken = authToken;
                        return creds;
                    });
                    localStorage.setItem("accessToken", authToken);

                    console.log("Success???");
                })
                .catch(error => console.log(error));
            console.log("postback");
            return;
        }

        if (credentials.accessToken) {
            isTokenValid(credentials.clientId, credentials.accessToken).then((isValid) => {
                if (!isValid) {
                    getPin(credentials.clientId).then(pins => {
                        sessionStorage.setItem("pinId", pins.id);
                        sessionStorage.setItem("pinCode", pins.code);
                        setCredentials((creds) => {
                            creds.pins = pins;
                            return creds;
                        });
                        setAuthURL(getAuthURL(credentials.clientId, credentials.pins.code));
                        setDisabled(false);
                    });
                }
            });
        } else {
            getPin(credentials.clientId).then(pins => {
                sessionStorage.setItem("pinId", pins.id);
                sessionStorage.setItem("pinCode", pins.code);
                setCredentials((creds) => {
                    creds.pins = pins;
                    return creds;
                });
                setAuthURL(getAuthURL(credentials.clientId, credentials.pins.code));
                setDisabled(false);
            })
        }

    }, []);


    return (
        <Grid
            className={globalClasses.fullPage}
            container
            direction="column"
            justify="center"
            alignItems="center">
            <Typography variant="h1" className={classes.title}>Burning for Plex</Typography>
            <Button href={authURL}
                className={classes.plexButton}
                variant="contained"
                color="secondary"
                disabled={disabled}>
                Log In with Plex Account
            </Button>
        </Grid>
    );
}

export default LoginPage;