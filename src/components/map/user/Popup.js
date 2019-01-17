import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Popup } from "react-mapbox-gl";

const StyledPopup = styled.div`
  background: white;
  color: #3f618c;
  font-weight: 400;
  padding: 5px;
  border-radius: 2px;
`;

export const MapUserPopup = ({
  feature: {
    properties,
    geometry: { coordinates }
  }
}) => {
  console.log(coordinates);
  return (
    <Popup
      key={properties.user}
      coordinates={coordinates}
      offset={{
        // "bottom-left": [12, -38],
        bottom: [0, -38],
        right: [-80, 0],
        left: [50, -20]
        // "bottom-right": [-12, -108]
      }}
    >
      <StyledPopup>
        <div>{properties.nickname}</div>
        <div>{properties.country}</div>
        <div>{properties.city}</div>
        <a href={`slack://user?team=T04G68VQ8&id=${properties.user}`}>
          Send message
        </a>
      </StyledPopup>
    </Popup>
  );
};
MapUserPopup.propTypes = {};
