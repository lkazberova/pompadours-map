import React from "react";
import PropTypes from "prop-types";
import AutoSuggest from "./AutoSuggest";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import {
  getGeoSuggestions,
  inputSuggestSelector,
  suggestionsSelector
} from "../../ducks/geocode";
import withScriptLoader from "react-async-script-loader";
import config from "../map/config";
import {
  getUsersSuggestions,
  usersSuggestionsSelector
} from "../../ducks/users";

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// function getSuggestions(value) {
//   const escapedValue = escapeRegexCharacters(value.trim());
//
//   if (escapedValue === "") {
//     return [];
//   }
//
//   const regex = new RegExp(escapedValue, "i");
//
//   return items
//     .map(section => {
//       return {
//         title: section.title,
//         items: section.items.filter(item =>
//           regex.test(getSuggestionValue(item))
//         )
//       };
//     })
//     .filter(section => section.items.length > 0);
// }

class SearchAutoSuggest extends React.Component {
  static propTypes = {};

  render() {
    const { geoSuggestions, usersSuggestions } = this.props;
    return (
      <AutoSuggest
        suggestions={[
          { title: "Places", items: geoSuggestions },
          { title: "Users", items: usersSuggestions }
        ]}
        renderInput={this.props.renderInput}
        onFetchSuggestions={this.handleFetchSuggestions}
        onSuggestionSelected={this.handleSuggestionSelected}
      />
    );
  }

  handleFetchSuggestions = value => {
    const { getGeoSuggestions, inputSuggest, getUsersSuggestions } = this.props;
    if (inputSuggest !== value) {
      console.log(`fetch geosuggestions for ${value}`);
      getGeoSuggestions(value);
      getUsersSuggestions(value);
    }
  };
  handleSuggestionSelected = address => {
    const { lang, getPlaceDetails, goToPage } = this.props;
    // getPlaceDetails(address, lang);
    console.log(address);
    // goToPage(routes.addressPathWith(address.text));
  };
}
const selector = createStructuredSelector({
  // lang: localeCodeSelector,
  geoSuggestions: suggestionsSelector,
  usersSuggestions: usersSuggestionsSelector,
  inputSuggest: inputSuggestSelector
  // addressText: addressTextSelector
});

export default withScriptLoader(
  `https://maps.googleapis.com/maps/api/js?key=${
    config.googlePlacesToken
  }&libraries=places&language=en`
)(
  connect(
    selector,
    { getGeoSuggestions, getUsersSuggestions }
  )(SearchAutoSuggest)
);
