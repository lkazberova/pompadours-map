import React from "react";
import ReactMapboxGl, { Cluster, Marker } from "react-mapbox-gl";
import config from "./config";
// import { ReactMapboxGlCluster } from "react-mapbox-gl-cluster";
import { connect } from "react-redux";
import { fetchAllUsers, usersGeoJSONSelector } from "../../ducks/users";
import UserMarker from "./user/Marker";
import { MapUserPopup } from "./user/Popup";
import {
  bboxSelector,
  centerSelector,
  popupSelector,
  setCenter,
  setPopup,
  styleSelector,
  zoomSelector
} from "../../ducks/map";
import { createStructuredSelector } from "reselect";

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
      key={coordinates.join(",")}
    >
      {pointCount}
    </Marker>
  );
  handleMarkerClick = feature => () => {
    this.props.setCenter(feature.geometry.coordinates);
    this.props.setPopup(feature);
  };
  onDrag = () => {
    if (this.props.popup) {
      this.props.setPopup(undefined);
    }
  };
  render() {
    const { data, style, center, zoom, bbox, popup } = this.props;
    return (
      <Map
        style={style}
        zoom={zoom}
        center={center}
        fitBounds={bbox}
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
          zoomOnClickPadding={60}
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
        {popup && <MapUserPopup feature={popup} />}
      </Map>
    );
  }
}

const selector = createStructuredSelector({
  data: usersGeoJSONSelector,
  style: styleSelector,
  center: centerSelector,
  zoom: zoomSelector,
  bbox: bboxSelector,
  popup: popupSelector
});
export default connect(
  selector,
  { fetchAllUsers, setCenter, setPopup }
)(MapView);
