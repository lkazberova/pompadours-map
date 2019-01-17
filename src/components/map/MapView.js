import React from "react";
import ReactMapboxGl, { Cluster, Marker } from "react-mapbox-gl";
import config from "./config";
// import { ReactMapboxGlCluster } from "react-mapbox-gl-cluster";
import { connect } from "react-redux";
import { fetchAllUsers, usersGeoJSONSelector } from "../../ducks/users";
import UserMarker from "./user/Marker";
import { MapUserPopup } from "./user/Popup";
import { styleSelector } from "../../ducks/map";

const Map = ReactMapboxGl({
  accessToken: config.token
});
const styles = {
  clusterMarker: count => ({
    // < 5, 5-10, 10-20, 20+
    width: count < 5 ? 40 : count < 10 ? 50 : count < 20 ? 60 : 80,
    height: count < 5 ? 40 : count < 10 ? 50 : count < 20 ? 60 : 80,
    borderRadius: "50%",
    backgroundColor:
      count < 5
        ? "#23B476"
        : count < 10
        ? "#FFD23F"
        : count < 20
        ? "#ED4068 "
        : "#78129E",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    // border: "2px solid #56C498",
    cursor: "pointer",
    fontSize: count < 5 ? 10 : count < 10 ? 12 : count < 20 ? 14 : 16
  }),
  marker: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    backgroundColor: "#E0E0E0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer"
  }
};

class MapView extends React.Component {
  static propTypes = {};

  state = {
    selectedFeature: null,
    zoom: [3]
  };
  componentDidMount() {
    this.props.fetchAllUsers();
  }
  onZoomStart = () => {};
  onStyleLoad = map => {
    this.map = map;
  };

  clusterMarker = (coordinates, pointCount, getLeaves) => (
    <Marker
      coordinates={coordinates}
      style={styles.clusterMarker(pointCount)}
      onClick={this.handlerClusterClick(coordinates, pointCount, getLeaves)}
      key={coordinates.join(",")}
    >
      {pointCount}
    </Marker>
  );

  handlerClusterClick = (coordinates, pointCount, getLeaves) => e => {
    const leaves = getLeaves();
    let equal = true;
    const coordinates = leaves[0].props.coordinates;
    for (let i = 1; i < leaves.length; i++) {
      if (
        coordinates[0] !== leaves[i].props.coordinates[0] ||
        coordinates[1] !== leaves[i].props.coordinates[1]
      ) {
        equal = false;
        break;
      }
    }

    const markers = leaves.map(
      leafFeature => leafFeature.props["data-feature"].properties
    );
    console.log(leaves);
    if (equal) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  handleMarkerClick = feature => () => {
    console.log(feature);
    this.setState({
      selectedFeature: feature
      // center: feature.geometry.coordinates,
      // zoom: [14]
    });
  };
  onDrag = () => {
    if (this.state.selectedFeature) {
      this.setState({ selectedFeature: undefined });
    }
  };
  render() {
    const { data, style } = this.props;
    const { selectedFeature, zoom, center } = this.state;
    return (
      <Map
        style={style}
        // zoom={zoom}
        // center={center}
        onStyleLoad={this.onStyleLoad}
        onClick={this.onDrag}
        onZoomStart={this.onZoomStart}
        onDrag={this.onDrag}
        containerStyle={{
          height: "100vh",
          width: "100vw"
        }}
      >
        <Cluster
          ClusterMarkerFactory={this.clusterMarker}
          zoomOnClick
          zoomOnClickPadding={100}
        >
          {data.features.map((feature, key) => (
            <Marker
              key={feature.properties.user}
              onClick={this.handleMarkerClick(feature)}
              // offset={[40, 35]}
              data-feature={feature}
              coordinates={feature.geometry.coordinates}
            >
              <UserMarker {...feature} />
            </Marker>
          ))}
        </Cluster>
        {selectedFeature && <MapUserPopup feature={selectedFeature} />}
      </Map>
    );
  }
}
export default connect(
  state => ({
    data: usersGeoJSONSelector(state),
    style: styleSelector(state)
  }),
  { fetchAllUsers }
)(MapView);
