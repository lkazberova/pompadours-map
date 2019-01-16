import React from "react";
import MapView from "../components/map/MapView";
import Grid from "@material-ui/core/Grid/Grid";
import Header from "../components/header/Header";

class Main extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Grid
          container
          alignItems="flex-start"
          direction="column"
          justify="center"
          spacing={0}
        >
          <MapView />
        </Grid>
        <Header />
      </React.Fragment>
    );
  }
}

export default Main;
