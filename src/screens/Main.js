import React from "react";
import MapView from "../components/map/MapView";
import Grid from "@material-ui/core/Grid/Grid";

class Main extends React.Component {
  render() {
    return (
      <Grid
        container
        alignItems="flex-start"
        direction="column"
        justify="center"
        spacing={0}
      >
        <MapView />
      </Grid>
    );
  }
}

export default Main;
