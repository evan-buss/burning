import { BottomNavigation, BottomNavigationAction } from "@material-ui/core";

import HomeIcon from "@material-ui/icons/Home";
import FavoriteIcon from "@material-ui/icons/Favorite";

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
      <BottomNavigationAction label="Home" value="/" icon={<HomeIcon />} />
      {/* <BottomNavigationAction
        label="Dashboard"
        value="/users"
        icon={<Dashboard />}
      /> */}
      <BottomNavigationAction
        label="History"
        value="/history"
        icon={<FavoriteIcon />}
      />
    </BottomNavigation>
  );
};
