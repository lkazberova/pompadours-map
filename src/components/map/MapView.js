import React from "react";
import ReactMapboxGl, { Cluster, Marker } from "react-mapbox-gl";
import config from "./config";
// import { ReactMapboxGlCluster } from "react-mapbox-gl-cluster";
import { connect } from "react-redux";
import { fetchAllUsers, usersGeoJSONSelector } from "../../ducks/users";
import { ReactMapboxGlSpiderifier } from "react-mapbox-gl-spiderifier";
import MapboxGl from "mapbox-gl";
import MapboxglSpiderifier from "mapboxgl-spiderifier";
import "mapboxgl-spiderifier/index.css";
const Map = ReactMapboxGl({
  accessToken: config.token
});
const styles = {
  clusterMarker: {
    width: 50,
    height: 50,
    borderRadius: "50%",
    backgroundColor: "#51D5A0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    // border: "2px solid #56C498",
    cursor: "pointer"
  },
  marker: {
    width: 50,
    height: 50,
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
  onZoomStart = () => {
    this.spiderifier && this.spiderifier.unspiderfy();
  };
  onStyleLoad = map => {
    this.map = map;

    this.spiderifier = new MapboxglSpiderifier(this.map, {
      onClick: function(e, spiderLeg) {
        console.log("Clicked on ", spiderLeg);
      },
      customPin: true,
      animate: true,
      animationSpeed: 200,
      initializeLeg: this.initializeSpiderLeg,
      circleSpiralSwitchover: Infinity,
      circleFootSeparation: 50,
      spiralLengthStart: 50,
      spiralFootSeparation: 200,
      spiralLengthFactor: 20
    });
    // this.spiderifier.spiderfy([-74.50, 40], features);
  };

  initializeSpiderLeg = spiderLeg => {
    const pinElem = spiderLeg.elements.pin;
    const feature = spiderLeg.feature;
    console.log(pinElem);
    pinElem.innerHTML = `${feature.nickname}`;
    for (let prop in styles.marker) {
      pinElem.style[prop] = styles.marker[prop];
    }
    pinElem.style.background = `url(${feature.avatar}) white`;
    // $(pinElem)
    //   .on("mouseenter", function() {
    //     popup = new mapboxgl.Popup({
    //       closeButton: true,
    //       closeOnClick: false,
    //       offset: MapboxglSpiderifier.popupOffsetForSpiderLeg(spiderLeg)
    //     });
    //     popup.setHTML("Icon used is <b>fa-" + feature.type + "</b>").addTo(map);
    //     spiderLeg.mapboxMarker.setPopup(popup);
    //   })
    //   .on("mouseleave", function() {
    //     if (popup) {
    //       popup.remove();
    //     }
    //   });
  };
  clusterMarker = (coordinates, pointCount, getLeaves) => (
    <Marker
      coordinates={coordinates}
      style={styles.clusterMarker}
      onClick={this.handlerClusterClick(coordinates, pointCount, getLeaves)}
      key={coordinates.join(",")}
    >
      {pointCount}
    </Marker>
  );

  handlerClusterClick = (coordinates, pointCount, getLeaves) => () => {
    const leaves = getLeaves();

    const markers = leaves.map(
      leafFeature => leafFeature.props["data-feature"].properties
    );
    console.log(markers, coordinates);
    this.spiderifier.spiderfy(coordinates, markers);
  };

  handleMarkerClick = feature => () => {
    console.log(feature);
  };
  render() {
    const { data } = this.props;
    console.log(data);
    return (
      <Map
        style={config.styles.street}
        zoom={[3]}
        onStyleLoad={this.onStyleLoad}
        onZoomStart={this.onZoomStart}
        containerStyle={{
          height: "100vh",
          width: "100vw"
        }}
      >
        {/*<ReactMapboxGlCluster data={data} {...this.getEventHandlers()} />*/}
        <Cluster ClusterMarkerFactory={this.clusterMarker}>
          {data.features.map((feature, key) => (
            <Marker
              key={feature.properties.user}
              onClick={this.handleMarkerClick(feature)}
              style={{
                ...styles.marker,
                background: `url(${feature.properties.avatar}) white`
              }}
              data-feature={feature}
              coordinates={feature.geometry.coordinates}
            >
              {feature.properties.nickname}
            </Marker>
          ))}
        </Cluster>
      </Map>
    );
  }
}

export default connect(
  state => ({
    data: usersGeoJSONSelector(state)
  }),
  { fetchAllUsers }
)(MapView);
