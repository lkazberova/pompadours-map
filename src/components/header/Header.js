import React from "react";
import styled from "styled-components";
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/es/Typography/Typography";
import { css } from "styled-components";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import withStyles from "@material-ui/core/styles/withStyles";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import connect from "react-redux/es/connect/connect";
import { fetchAllUsers, usersGeoJSONSelector } from "../../ducks/users";
import { setStyle, styleSelector } from "../../ducks/map";
import config from "../map/config";

const TopContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  flex-grow: 1;
  background-color: white;
  z-index: 100;
  // padding: 0.5em 1.25em 0 1.25em;
`;
const styles = {
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};
class Header extends React.Component {
  static propTypes = {};

  render() {
    const { classes, style } = this.props;

    return (
      <TopContainer>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              ODesk nomads
            </Typography>
            <Select
              value={style}
              onChange={this.handleChange}
              displayEmpty
              name="age"
            >
              {Object.keys(config.styles).map(key => (
                <MenuItem key={key} value={config.styles[key]}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          </Toolbar>
        </AppBar>
      </TopContainer>
    );
  }
  handleChange = event => {
    this.props.setStyle(event.target.value);
  };
}
export default connect(
  state => ({
    style: styleSelector(state)
  }),
  { setStyle }
)(withStyles(styles)(Header));
