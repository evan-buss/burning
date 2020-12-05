import { Button, Grid, makeStyles, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { v4 } from "uuid";
import { getTokenFromPin, Credentials, getAuthURL, getPin, TokenResponse } from "../services/auth";

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const useStyles = makeStyles({
    fullPage: {
        height: "calc(100vh - 56px)",
    },
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
    const [clientId, setClientId] = useState(v4());
    const [authURL, setAuthURL] = useState<string>("");
    const [accessToken, setAccessToken] = useState<string>("");
    const [tokens, setTokens] = useState<TokenResponse>();

    const [credentials, setCredentials] = useState<Credentials>({} as Credentials);

    useEffect(() => {
        const _cachedClientId = localStorage.getItem("clientId");
        if (_cachedClientId !== null) {
            setClientId(_cachedClientId);
            setCredentials((prev) => {
                return { ...prev, clientId: _cachedClientId }
            });
        }

        const _cachedAccessToken = localStorage.getItem("accessToken");
        if (_cachedAccessToken !== null) {
            // Generate new token via postback api here    
        } else {
            // Verify token validity and use it if valid
        }


        if (query.has("postback")) {
            getTokenFromPin(tokens?.id, token.code,)
            console.log("postback");
        } else {
            getPin(clientId).then((tokens) => {
                setTokens(tokens)
                setAuthURL(getAuthURL(tokens.code, clientId))
            });
        }
    }, [clientId, query]);


    return (
        <Grid
            className={classes.fullPage}
            container
            direction="column"
            justify="center"
            alignItems="center">
            <Typography variant="h1" className={classes.title}>Burning for Plex</Typography>
            <Button href={authURL}
                className={classes.plexButton}
                variant="contained"
                color="secondary">
                Log In With Plex
            </Button>
        </Grid>
    );
}

export default LoginPage;