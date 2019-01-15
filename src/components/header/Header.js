import React from "react";
import styled from "styled-components";

const TopContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 70px;
  padding: 0.5em 1.25em 0 1.25em;
`;
class Header extends React.Component {
  static propTypes = {};

  render() {
    return <TopContainer />;
  }
}

export default Header;
