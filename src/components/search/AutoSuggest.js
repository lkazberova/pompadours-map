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
const items = [
  {
    title: "1970s",
    items: [
      {
        name: "C",
        year: 1972
      },
      {
        name: "C",
        year: 1972
      },
      {
        name: "C",
        year: 1972
      },
      {
        name: "C",
        year: 1972
      },
      {
        name: "C",
        year: 1972
      },
      {
        name: "C",
        year: 1972
      },
      {
        name: "C",
        year: 1972
      },
      {
        name: "C",
        year: 1972
      },
      {
        name: "C",
        year: 1972
      },
      {
        name: "C",
        year: 1972
      }
    ]
  },
  {
    title: "1980s",
    items: [
      {
        name: "C++",
        year: 1983
      },
      {
        name: "Perl",
        year: 1987
      }
    ]
  },
  {
    title: "1990s",
    items: [
      {
        name: "Haskell",
        year: 1990
      },
      {
        name: "Python",
        year: 1991
      },
      {
        name: "Java",
        year: 1995
      },
      {
        name: "Javascript",
        year: 1995
      },
      {
        name: "PHP",
        year: 1995
      },
      {
        name: "Ruby",
        year: 1995
      }
    ]
  },
  {
    title: "2000s",
    items: [
      {
        name: "C#",
        year: 2000
      },
      {
        name: "Scala",
        year: 2003
      },
      {
        name: "Clojure",
        year: 2007
      },
      {
        name: "Go",
        year: 2009
      }
    ]
  },
  {
    title: "2010s",
    items: [
      {
        name: "Elm",
        year: 2012
      }
    ]
  },
  {
    title: "Users",
    type: "users",
    items: [
      {
        _id: {
          $oid: "5743185f61d2b4ead7dc106f"
        },
        user: "U04G68VQG",
        city: "Saint Petersburg",
        country: "Russia",
        lat: 59.93863,
        lng: 30.31413,
        nickname: "cgrecgory.b",
        avatar:
          "https://avatars.slack-edge.com/2018-01-14/298637402962_73cd1423ee6a6ccb36c7_72.jpg"
      },
      {
        _id: {
          $oid: "57a96eb84cef947748516651"
        },
        user: "U1VUZ83GR",
        city: "Ust-Kamenogorsk",
        country: "Kazakhstan",
        lat: 49.97143,
        lng: 82.60586,
        nickname: "cocma_uk",
        avatar:
          "https://avatars.slack-edge.com/2016-10-14/91133093317_267e1194102dc1c4a454_72.jpg"
      },
      {
        _id: {
          $oid: "581b9c2e17a485a5fc6e34a0"
        },
        user: "U2YH7DYF8",
        city: "St Petersburg",
        country: "Russia",
        lat: 59.93863,
        lng: 30.31413,
        nickname: "cwiclbit",
        avatar:
          "https://avatars.slack-edge.com/2018-04-04/340686516100_ac6062f70cc3cd9f350c_72.jpg"
      }
    ]
  }
];

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getSuggestions(value) {
  const escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === "") {
    return [];
  }

  const regex = new RegExp(escapedValue, "i");

  return items
    .map(section => {
      return {
        title: section.title,
        items: section.items.filter(item =>
          regex.test(getSuggestionValue(item))
        )
      };
    })
    .filter(section => section.items.length > 0);
}

function getSuggestionValue(suggestion) {
  return suggestion.name || suggestion.nickname;
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(getSuggestionValue(suggestion), query);
  const parts = parse(getSuggestionValue(suggestion), matches);

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
          suggestion.city
            ? `${suggestion.country}, ${suggestion.city}`
            : undefined
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
  constructor() {
    super();

    this.state = {
      value: "",
      suggestions: []
    };
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;
    const { classes } = this.props;
    const inputProps = {
      placeholder: "Type 'c'",
      value,
      onChange: this.onChange
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
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
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
