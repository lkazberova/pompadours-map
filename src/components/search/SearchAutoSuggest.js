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
import { moveToPlaceId, moveToUser } from "../../ducks/map";

class SearchAutoSuggest extends React.Component {
  static propTypes = {};

  render() {
    const { geoSuggestions, usersSuggestions } = this.props;
    return (
      <AutoSuggest
        suggestions={[
          { title: `Places (${geoSuggestions.length})`, items: geoSuggestions },
          {
            title: `Users (${usersSuggestions.length})`,
            items: usersSuggestions
          }
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
      // console.log(`fetch geosuggestions for ${value}`);
      getGeoSuggestions(value);
      getUsersSuggestions(value);
    }
  };
  handleSuggestionSelected = value => {
    const { moveToPlaceId, moveToUser } = this.props;
    // getPlaceDetails(address, lang);
    if (value.placeid) moveToPlaceId(value.placeid);
    else moveToUser(value);
    // console.log(value);
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
    { getGeoSuggestions, getUsersSuggestions, moveToPlaceId, moveToUser }
  )(SearchAutoSuggest)
);
