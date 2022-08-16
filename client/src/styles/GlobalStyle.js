import { createGlobalStyle } from "styled-components/macro";

const GlobalStyle = createGlobalStyle`
    html {
    box-sizing: border-box;
    }

    body {
    margin: 0;
    padding: 0;
    background-color: beige;
    color: darkolivegreen;
    }
`;

export default GlobalStyle;