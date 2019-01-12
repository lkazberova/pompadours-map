import React from "react";
import ReactMapboxGl, { Feature, Layer } from "react-mapbox-gl";

const Map = ReactMapboxGl({
  accessToken:
    "pk.eyJ1IjoibGVpc2Fua2F6YmVyb3ZhIiwiYSI6ImNqb3pwY2N2bTJudmgzcGxrcDdoanhocDgifQ.NyyeyNf0viMYMUQT8Cw4KQ"
});

class MapView extends React.Component {
  static propTypes = {};

  render() {
    return (
      <Map
        // style="mapbox://styles/mapbox/streets-v9"
        containerStyle={{
          height: "100vh",
          width: "100vw"
        }}
      >
        <Layer type="symbol" id="marker" layout={{ "icon-image": "marker-15" }}>
          <Feature coordinates={[-0.481747846041145, 51.3233379650232]} />
        </Layer>
      </Map>
    );
  }
}

export default MapView;
