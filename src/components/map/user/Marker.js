import React from "react";
import PropTypes from "prop-types";
import Chip from "@material-ui/core/Chip/Chip";
import Avatar from "@material-ui/core/Avatar/Avatar";

class MapUserMarker extends React.Component {
  static propTypes = {};

  state = {
    showPlaceholder: false
  };
  render() {
    const {
      properties: { avatar, nickname }
    } = this.props;
    const { showPlaceholder } = this.state;
    return (
      <Chip
        avatar={
          !showPlaceholder ? (
            <Avatar
              src={avatar}
              imgProps={{
                onError: this.imageErrorHandler
              }}
            />
          ) : (
            undefined
          )
        }
        label={nickname}
        style={{ backgroundColor: "white" }}
      />
    );
  }

  imageErrorHandler = () => this.setState({ showPlaceholder: true });
}

export default MapUserMarker;
