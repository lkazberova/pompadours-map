import React from "react";
import AutosuggestBase from "react-autosuggest";
import InputBase from "@material-ui/core/InputBase/InputBase";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper/Paper";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import LocationOn from "@material-ui/icons/LocationOn";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader/ListSubheader";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import ListItemAvatar from "@material-ui/core/ListItemAvatar/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar/Avatar";
import * as PropTypes from "prop-types";
import debounce from "lodash.debounce";

function getSuggestionValue(suggestion) {
  // console.log(suggestion);
  return suggestion.name || suggestion.nickname;
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(getSuggestionValue(suggestion), query);
  const parts = parse(getSuggestionValue(suggestion), matches);

  let matchesSecondary, partsSecondary, secondary;
  if (suggestion.city) {
    secondary = `${suggestion.country}, ${suggestion.city}`;
    matchesSecondary = match(secondary, query);
    partsSecondary = parse(secondary, matchesSecondary);
  }
  return (
    <ListItem
      selected={isHighlighted}
      style={
        {
          // padding: "1.5em 1em",
          // borderTop: "1px dashed rgba(0, 0, 0, 0.14)"
        }
      }
    >
      {suggestion.avatar ? (
        <ListItemAvatar>
          <Avatar src={suggestion.avatar} />
        </ListItemAvatar>
      ) : (
        <ListItemIcon>
          <LocationOn
            style={{
              width: 18,
              height: 18,
              // marginRight: 10,
              color: "#999"
            }}
          />
        </ListItemIcon>
      )}
      <ListItemText
        style={{
          fontSize: "0.85em",
          color: "rgba(34, 42, 45, 1)"
        }}
        inset
        primary={
          <React.Fragment>
            {parts.map((part, index) => {
              return !part.highlight ? (
                <span
                  key={index}
                  style={{
                    // fontFamily: "Gotham Light",
                    opacity: 0.7
                  }}
                >
                  {part.text}
                </span>
              ) : (
                <strong key={index}>{part.text}</strong>
              );
            })}
          </React.Fragment>
        }
        secondary={
          suggestion.city ? (
            <React.Fragment>
              {partsSecondary.map((part, index) => {
                return !part.highlight ? (
                  <span
                    key={index}
                    style={{
                      // fontFamily: "Gotham Light",
                      opacity: 0.7
                    }}
                  >
                    {part.text}
                  </span>
                ) : (
                  <strong key={index}>{part.text}</strong>
                );
              })}
            </React.Fragment>
          ) : (
            undefined
          )
        }
      />
    </ListItem>
  );
}

function renderSectionTitle(section) {
  return (
    <ListSubheader
      style={{
        // padding: "1.5em 1em",
        borderTop: "1px dashed rgba(0, 0, 0, 0.14)"
      }}
    >
      {section.title}
    </ListSubheader>
  );
}

function getSectionSuggestions(section) {
  return section.items;
}

const renderSuggestionsContainer = options => {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
};
const defaultStyles = {
  container: {
    position: "relative"
  },
  suggestionsContainerOpen: {
    bottom: "auto",
    top: "100%",
    display: "block",
    position: "absolute",
    overflowY: "auto",
    maxHeight: "90vh",
    width: "100%",
    zIndex: 2
  },
  suggestion: {
    display: "block"
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },
  textField: {
    fontSize: "1.5em",
    paddingLeft: 20,
    paddingTop: 14,
    paddingBottom: 16,
    backgroundColor: "#fff",
    boxSizing: "border-box"
  }
};
class AutoSuggest extends React.Component {
  static propTypes = {
    renderInput: PropTypes.func,
    onFetchSuggestions: PropTypes.func,
    onSuggestionSelected: PropTypes.func.isRequired
  };
  constructor() {
    super();

    this.state = {
      value: "",
      suggestions: []
    };
    this.debouncedLoadSuggestions = debounce(this.loadSuggestions, 200);
  }
  loadSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : this.props.onFetchSuggestions(value);
  };
  handleSuggestionsFetchRequested = ({ value }) => {
    this.debouncedLoadSuggestions(value);
  };
  handleChange = (e, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  handleSuggestionSelected = (event, { suggestion, ...option }) => {
    this.props.onSuggestionSelected(suggestion, option);
  };
  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value } = this.state;
    const { classes, suggestions } = this.props;
    const inputProps = {
      placeholder: "Type country, city or username",
      value,
      onChange: this.handleChange
    };

    return (
      <AutosuggestBase
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion
        }}
        multiSection={true}
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionSelected={this.handleSuggestionSelected}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        renderSectionTitle={renderSectionTitle}
        renderInputComponent={this.props.renderInput}
        renderSuggestionsContainer={renderSuggestionsContainer}
        getSectionSuggestions={getSectionSuggestions}
        inputProps={inputProps}
      />
    );
  }
}

export default withStyles(defaultStyles)(AutoSuggest);
