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
import { fade } from "@material-ui/core/styles/colorManipulator";
import InputBase from "@material-ui/core/InputBase/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import OutlinedInput from "@material-ui/core/OutlinedInput/OutlinedInput";
import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Input from "@material-ui/core/Input/Input";
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
const styles = theme => ({
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  select: {
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    color: "inherit",
    borderRadius: theme.shape.borderRadius,
    paddingLeft: theme.spacing.unit * 2
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing.unit * 3,
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit",
    width: "100%"
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: 200
    }
  }
});
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
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }}
              />
            </div>
            <Select
              value={style}
              className={classes.select}
              onChange={this.handleChange}
              displayEmpty
              input={<Input disableUnderline />}
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
