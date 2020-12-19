import { Chip, makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import { Library } from "../store/models/plex.model";

type Props = {
  lib: Library;
  selected?: boolean;
};

const useStyles = makeStyles({
  chip: {
    margin: "0.4em",
  },
});

export const LibraryChip: React.FC<Props> = (props) => {
  const [selected, setSelected] = useState(false);
  const classes = useStyles();

  const handleClick = () => {
    setSelected((x) => !x);
  };

  return (
    <Chip
      color="primary"
      className={classes.chip}
      label={props.lib.title}
      variant={selected ? "default" : "outlined"}
      onClick={handleClick}
    />
  );
};
