import { BottomNavigation, BottomNavigationAction } from "@material-ui/core";
import React, { useState } from "react";
import { useHistory } from "react-router";
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { Dashboard } from "@material-ui/icons";

export const BottomNavBar = () => {
    const [value, setValue] = useState("");
    const history = useHistory();

    const handleChange = (event: any, newValue: string) => {
        console.log(newValue);
        history.push(newValue);
        setValue(newValue);
    }

    return (
        <BottomNavigation onChange={handleChange} value={value} showLabels>
            <BottomNavigationAction label="Home" value="/" icon={<FavoriteIcon />} />
            <BottomNavigationAction label="Dashboard" value="/dashboard" icon={<Dashboard />} />
            <BottomNavigationAction label="History" value="/history" icon={<RestoreIcon />} />
        </BottomNavigation>
    )
}