# Webauthn demo using ReactJS & Express

## Running the demo

```bash
# Clone repository
git clone https://github.com/amitsarangi/webauthn-demo-react-express.git

# cd to directory
cd webauthn-demo-react-express

# install dependencies
yarn install

# Run Server
yarn start:server

# Run React
yarn start:react
```

<!-- ## What this application does ? 

- User signs up and he is then signed up to dashboard page

-   -->
## Database Schemas

## Steps happening here

- Sign Up: 
    - Username & password is collected and sent to server. [Revelant code](https://github.com/amitsarangi/webauthn-demo-react-express/blob/master/src/containers/LoginPage.js#L70-L81)
    - Server adds the user to database, and signs him in using a JWT cookie. [Relevant code](https://github.com/amitsarangi/webauthn-demo-react-express/blob/master/server/routes/user.js#L7-L33)
    - The user is taken to dashboard page, where he has options to "Add Security Key", "Delete all Security Keys" or "Log Out" 

- Add Security Key:
    - When the user clicks "Add Security Key", We send a request to server to fetch the AttestationOptions/CredentialsCreationOptions. [Relevant code](https://github.com/amitsarangi/webauthn-demo-react-express/blob/master/src/containers/DashboardPage.js#L61-L64)
    - The server checks that the user is signed in. Server fetches user's alreadt existing keys and adds it to `attestationOptions.excludeCredentials` so that the same key is not registered twice for the same user. The user information is then added to `attestationOptions.user`. The `attestationOptions` object is then encoded using [webauthnjs-helper](https://github.com/amitsarangi/webauthnjs-helper) library. The base64url encoded string is then saved to the session. [Relevant code](https://github.com/amitsarangi/webauthn-demo-react-express/blob/master/server/routes/auth.js#L134-L155)  
    **IMP: The challange must be saved in session to prevent replay attacks**
    - 

