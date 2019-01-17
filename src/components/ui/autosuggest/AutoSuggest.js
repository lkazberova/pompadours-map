import React, { Component } from "react";
import PropTypes from "prop-types";
import Autosuggest from "react-autosuggest";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import Input from "@material-ui/core/Input/Input";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import LocationOn from "@material-ui/icons/LocationOn";
import Paper from "@material-ui/core/Paper/Paper";
import debounce from "lodash.debounce";
import withStyles from "@material-ui/core/styles/withStyles";

const renderInput = ({ classes, home, value, ref, disabled, ...other }) => {
  return (
    <Input
      disableUnderline={true}
      autoFocus={home}
      className={classes.textField}
      value={value}
      fullWidth
      inputRef={ref}
      inputProps={{
        ...other
      }}
      disabled={disabled}
    />
  );
};

const renderSuggestion = (suggestion, { query, isHighlighted }) => {
  const matches = match(suggestion.text, query);
  const parts = parse(suggestion.text, matches);

  return (
    <MenuItem
      selected={isHighlighted}
      component="div"
      style={{
        padding: "1.5em 1em",
        borderTop: "1px dashed rgba(0, 0, 0, 0.14)"
      }}
    >
      <LocationOn
        style={{
          width: 18,
          height: 18,
          marginRight: 10,
          color: "#999"
        }}
      />{" "}
      <div
        style={{
          fontSize: "0.85em",
          color: "rgba(34, 42, 45, 1)"
        }}
      >
        {parts.map((part, index) => {
          return part.highlight ? (
            <span
              key={index}
              style={{
                fontFamily: "Gotham Light",
                opacity: 0.7
              }}
            >
              {part.text}
            </span>
          ) : (
            <strong key={index}>{part.text}</strong>
          );
        })}
      </div>
    </MenuItem>
  );
};

const renderSuggestionsContainer = options => {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
};

const getSuggestionValue = suggestion => {
  return suggestion.text;
};

const defaultStyles = {
  container: {
    position: "relative"
  },
  suggestionsContainerOpen: {
    top: "auto",
    bottom: "100%",
    display: "block",
    position: "absolute",
    overflowY: "auto",
    maxHeight: "90vh",
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

export class AutosuggestInput extends Component {
  state = {
    value: "",
    suggestions: []
  };

  static defaultProps = {
    renderInput: renderInput,
    getSuggestionValue: getSuggestionValue
  };
  constructor() {
    super();
    this.debouncedLoadSuggestions = debounce(this.loadSuggestions, 200);
  }
  componentDidMount() {
    this.setState({ value: this.props.value });
  }

  componentWillReceiveProps(newProps) {
    console.log(
      `AutoSuggest:
      newProps.value: ${newProps.value},
      this.props.value: ${this.props.value},
      this.state.value: ${this.state.value}`
    );
    if (
      (newProps.value && !this.state.value) ||
      newProps.value !== this.props.value
    ) {
      this.setState({ value: newProps.value });
      console.log(`AutoSuggest: setted new value ${newProps.value}`);
    } else console.log(`AutoSuggest: value doesn't set`);
  }

  loadSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : this.props.onFetchSuggestions(value);
  };

  handleSuggestionsFetchRequested = ({ value }) => {
    console.log(value);
    // this.setState({
    //   suggestions: getSuggestions(value)
    // });

    this.debouncedLoadSuggestions(value);
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  handleChange = (e, { newValue }) => {
    console.log(`handleChange`, newValue);

    this.setState({
      value: newValue
    });
  };
  handleKeyDown = ({ keyCode }) => {
    const { onEnter } = this.props;
    if (keyCode === 13 && onEnter) onEnter(this.state.value);
  };

  handleSuggestionSelected = (
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
  ) => {
    this.props.onSuggestionSelected(suggestion);
  };
  handleBlur = ({ target: { value } }) => {
    console.log(`onBlur ${value}`);
    const { onBlur } = this.props;
    if (onBlur) onBlur(value);
  };

  render() {
    const {
      classes,
      placeholder,
      suggestions,
      renderInput,
      label,
      disabled,
      getSuggestionValue,
      onFocus,
      id
    } = this.props;
    console.log(`Autosuggest ${id} render`);
    return (
      <Autosuggest
        id={id}
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion
        }}
        renderInputComponent={renderInput}
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        onSuggestionSelected={this.handleSuggestionSelected}
        renderSuggestionsContainer={renderSuggestionsContainer}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        focusInputOnSuggestionClick={false}
        inputProps={{
          classes,
          placeholder,
          label,
          value: this.state.value,
          onChange: this.handleChange,
          onKeyDown: this.handleKeyDown,
          onBlur: this.handleBlur,
          onFocus,
          disabled
        }}
      />
    );
  }
}

AutosuggestInput.propTypes = {
  classes: PropTypes.object.isRequired,
  placeholder: PropTypes.string.isRequired,
  onFetchSuggestions: PropTypes.func.isRequired,
  onSuggestionSelected: PropTypes.func.isRequired,
  onEnter: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  suggestions: PropTypes.array.isRequired,
  renderInput: PropTypes.func,
  getSuggestionValue: PropTypes.func,
  id: PropTypes.string.isRequired,
  disabled: PropTypes.bool
};

export default withStyles(defaultStyles)(AutosuggestInput);
