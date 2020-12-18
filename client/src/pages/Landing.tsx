import { Avatar, ButtonBase, CircularProgress, Grid, IconButton, makeStyles, Paper, Snackbar, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router";
import { getUsers, PlexAccountUser } from "../services/users";

const useStyles = makeStyles({
    avatarCard: {
        padding: 12,
    },
    avatarGrid: {
        padding: 8,
        maxWidth: "100%",
        margin: 0
    },
    avatarCardText: {
        marginTop: 6,
        fontSize: "1.6em"
    },
    buttonWrapper: {
        width: "100%",
        height: "100%",
        borderRadius: 4
    },
    title: {
        textAlign: "center",
        padding: "1em",
        paddingBottom: "0.5em",
        fontSize: "2em"
    }
});

const LandingPage: React.FC = () => {
    const [users, setUsers] = useState<PlexAccountUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const history = useHistory();
    const classes = useStyles();

    useEffect(() => {
        setLoading(true);
        getUsers().then(users => {
            setUsers(users);
            setLoading(false);
        });
    }, [])

    const handleSelect = () => {
        setOpen(true);
        history.push("/dashboard");
    }

    if (loading) {
        return (
            <Grid
                style={{ height: "100%" }}
                container
                direction="column"
                justify="center"
                alignItems="center">
                <CircularProgress variant="indeterminate" />
            </Grid>
        );
    }

    return (
        <>
            <Typography variant="h3" className={classes.title}>Who are you?</Typography>
            <Grid container direction="row" spacing={2} className={classes.avatarGrid}>
                {users.map(user => {
                    return (
                        <Grid xs={6} md={4} lg={3} item onClick={() => handleSelect()} key={user.id}>
                            <ButtonBase className={classes.buttonWrapper}>
                                <Paper variant="outlined" elevation={2} className={`${classes.avatarCard} ${classes.buttonWrapper}`}>
                                    <Grid container direction="column" justify="center" alignItems="center">
                                        <Avatar alt={user.name} src={user.thumbnail} />
                                        <Typography variant="h4" className={classes.avatarCardText}>{user.name}</Typography>
                                    </Grid>
                                </Paper>
                            </ButtonBase>
                        </Grid>
                    )
                })}
            </Grid>
            <Snackbar open={open}
                autoHideDuration={4000}
                message="Hello world"
                onClose={() => setOpen(false)}
                action={
                    <IconButton size="small" aria-label="close" color="inherit" onClick={() => setOpen(false)}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                } />
        </>
    )
}

export default LandingPage;