import classes from "*.module.css";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  makeStyles,
  Grid,
} from "@material-ui/core";
import React, { useState } from "react";
import { Movie } from "../pages/SwipePage";

import StarIcon from "@material-ui/icons/Star";

interface Props {
  movie: Movie;
  onClick: () => void;
}

const useStyles = makeStyles({
  root: {
    minHeight: "calc(100% - 2em)",
    margin: "1em",
  },
});

const MovieCard: React.FC<Props> = (props) => {
  const { movie, onClick } = props;
  const classes = useStyles();
  const [flipped, setFlipped] = useState(false);

  return (
    <Card
      className={classes.root}
      onClick={() => setFlipped((flipped) => !flipped)}
    >
      <CardActionArea style={{ height: "100%" }}>
        {!flipped ? (
          <Grid
            container
            style={{ height: "100%" }}
            justify="center"
            alignItems="center"
            direction="column"
          >
            <CardMedia
              component="img"
              image={movie.poster}
              title={`${movie.title} poster`}
            />
          </Grid>
        ) : (
          <CardContent style={{ height: "100%" }}>
            <Grid container direction="row" justify="space-between">
              <Typography gutterBottom variant="h5" component="h2">
                {movie.title}
              </Typography>
              <Typography gutterBottom variant="h6" component="h4">
                <StarIcon />
                {movie.rating}
              </Typography>
            </Grid>
            <Typography variant="body2" color="textSecondary" component="p">
              {movie.summary}
            </Typography>
          </CardContent>
        )}
      </CardActionArea>
    </Card>
  );
};

export default MovieCard;
// {movie.imdb && (
//     <CardActions style={{ marginLeft: "auto" }}>
//       <Button
//         href={movie.imdb}
//         target="_blank"
//         size="small"
//         color="primary"
//       >
//         IMDB
//       </Button>
//     </CardActions>
//   )}
