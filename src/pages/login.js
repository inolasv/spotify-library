import styled from "styled-components/macro";

const StyledLoginContainer = styled.main`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
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
        <StyledLoginButton href="http://localhost:8080/api/login"> 
            Log In
        </StyledLoginButton>
    </StyledLoginContainer>
)

export default Login;