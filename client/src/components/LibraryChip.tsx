import { Chip, makeStyles } from "@material-ui/core";
import AudioTrackIcon from "@material-ui/icons/Audiotrack";
import MovieIcon from "@material-ui/icons/Movie";
import TvIcon from "@material-ui/icons/Tv";
import React from "react";
import { Library, LibraryType } from "../store/models/plex.model";

type Props = {
  lib: Library;
  selected?: boolean;
  onClick: (lib: Library, selected: boolean) => void;
};

const useStyles = makeStyles({
  chip: {
    margin: "0.4em",
  },
});

export const LibraryChip: React.FC<Props> = (props) => {
  const classes = useStyles();

  const handleClick = () => {
    props.onClick(props.lib, props.lib.selected);
  };

  const getIcon = (type: LibraryType) => {
    switch (type) {
      case "artist":
        return <AudioTrackIcon />;
      case "movie":
        return <MovieIcon />;
      case "show":
        return <TvIcon />;
    }
  };

  return (
    <Chip
      color="primary"
      icon={getIcon(props.lib.type)}
      className={classes.chip}
      label={props.lib.title}
      variant={props.lib.selected ? "default" : "outlined"}
      onClick={handleClick}
    />
  );
};
