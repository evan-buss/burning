import { BottomNavigation, BottomNavigationAction } from "@material-ui/core";
import { Dashboard } from "@material-ui/icons";
import FavoriteIcon from "@material-ui/icons/Favorite";
import RestoreIcon from "@material-ui/icons/Restore";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";

export const BottomNavBar = () => {
  const [value, setValue] = useState("");
  const history = useHistory();
  const location = useLocation().pathname;

  useEffect(() => {
    setValue(location);
  }, [location]);

  const handleChange = (event: any, newValue: string) => {
    history.push(newValue);
    setValue(newValue);
  };

  return (
    <BottomNavigation onChange={handleChange} value={value} showLabels>
      <BottomNavigationAction label="Home" value="/" icon={<FavoriteIcon />} />
      <BottomNavigationAction
        label="Dashboard"
        value="/users"
        icon={<Dashboard />}
      />
      <BottomNavigationAction
        label="History"
        value="/history"
        icon={<RestoreIcon />}
      />
    </BottomNavigation>
  );
};
