import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Popup as MapboxPopup } from "react-mapbox-gl";
import Card from "@material-ui/core/Card/Card";
import CardActionArea from "@material-ui/core/CardActionArea/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia/CardMedia";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Typography from "@material-ui/core/Typography/Typography";
import CardActions from "@material-ui/core/CardActions/CardActions";
import Button from "@material-ui/core/Button/Button";
import withStyles from "@material-ui/core/styles/withStyles";

const StyledPopup = styled.div`
  background: white;
  color: #3f618c;
  font-weight: 400;
  padding: 5px;
  border-radius: 2px;
`;
const styles = theme => ({
  card: {
    display: "flex"
  },

  details: {
    display: "flex",
    flexDirection: "column"
  },
  content: {
    flex: "1 0 auto"
  },

  cover: {
    width: 151
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  }
});
const Popup = styled(MapboxPopup)`
  max-height: calc(100vh / 3);
  max-width: 300px;
  min-width: 100px;
  // overflow: scroll;
  font-size: 1rem;
  opacity: 0.93;

  & div.mapboxgl-popup-content {
    // overflow: auto;
    padding: unset;
    // border-radius: 5px;
  }
`;
export const MapUserPopup = withStyles(styles)(
  ({
    feature: {
      properties: { user, avatar, nickname, country, city },
      geometry: { coordinates }
    },
    classes
  }) => {
    // console.log(coordinates);
    return (
      <Popup
        key={user}
        coordinates={coordinates}
        offset={{
          // "bottom-left": [12, -38],
          bottom: [0, -38],
          right: [-80, 0],
          left: [50, -20]
          // "bottom-right": [-12, -108]
        }}
      >
        <Card className={classes.card}>
          <CardMedia className={classes.cover} image={avatar} />
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography component="h6" variant="h6">
                {nickname}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {country}, {city}
              </Typography>
            </CardContent>
            <div className={classes.controls}>
              <Button
                size="small"
                color="primary"
                href={`slack://user?team=T04G68VQ8&id=${user}`}
              >
                Send message
              </Button>
            </div>
          </div>
        </Card>
      </Popup>
    );
  }
);
MapUserPopup.propTypes = {};
