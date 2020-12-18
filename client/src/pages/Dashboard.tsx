import { Button, FormControl, Grid, InputLabel, makeStyles, MenuItem, Select, ServerStyleSheets, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { LibraryChip } from "../components/LibraryChip";
import { getLibraries, getServers, Server } from "../services/plex";

const useStyles = makeStyles({
    heading: {
        padding: "1em",
        paddingBottom: "0em"
    },
    container: {
        padding: "1em",
    },
    buttonContainer: {
        height: "calc(100% - 128px)"
    },
    plexButton: {
        padding: "1em 6em",
    }
})

const DashboardPage: React.FC = () => {
    const classes = useStyles();
    const [libraries, setLibraries] = useState<string[]>([]);
    const [servers, setServers] = useState<Server[]>([]);
    const [selectedServer, setSelectedServer] = useState<string>("");

    useEffect(() => {
        getServers().then(res => setServers(res));
    }, []);

    const handleServerSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
        console.log(event);
        setSelectedServer(event.target.value as string);
        getLibraries().then(res => setLibraries(res));
    };

    return (
        <>
            <Grid container
                justify="center"
                direction="row"
                className={classes.container}>
                <FormControl variant="filled" style={{ width: "100%" }}>
                    <InputLabel id="server-select">Server</InputLabel>
                    <Select labelId="server-select" id="server-select" value={selectedServer} onChange={handleServerSelect}>
                        {servers.map(server => {
                            return <MenuItem key={server.name} value={server.ip}>{server.name}</MenuItem>
                        })}
                    </Select>
                </FormControl>
            </Grid >

            {selectedServer !== "" &&
                <>
                    <Typography className={classes.heading} variant="h6">Libraries</Typography>
                    <Grid container
                        justify="center"
                        direction="row"
                        className={classes.container}>
                        {libraries.map(lib => {
                            return <LibraryChip key={lib} label={lib} />
                        })}
                    </Grid>
                </>
            }

            <Grid container justify="center" alignItems="center" className={classes.buttonContainer}>
                <Button
                    className={classes.plexButton}
                    variant="contained"
                    color="primary">
                    Start Swiping
                </Button>
            </Grid>
        </>
    )
}

export default DashboardPage;