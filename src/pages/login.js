import styled from "styled-components/macro";

const LOGIN_LINK = process.env.REACT_APP_LOGIN_LINK;
console.log(LOGIN_LINK);
const StyledLoginContainer = styled.main`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 80vh;
`;

const StyledLoginButton = styled.a`
    background-color: darkgreen;
    color: white;
    padding: 10px 20px;
    margin: 20px auto;
    border-radius: 30px;
    display: inline-block;
`;


const Login = () => (
    <StyledLoginContainer>
        <div className="header title">
                Welcome to Spotify Library
            </div>

        <div className="content description">
            Click the login button to get started.

        </div>
        <StyledLoginButton href={LOGIN_LINK}> 
            Log In
        </StyledLoginButton>
    </StyledLoginContainer>
)

export default Login;