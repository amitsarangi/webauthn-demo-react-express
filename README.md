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

## Database Schemas for saved credentials

### name: STRING
Credential name. It is encouraged to save the name of each authenticator device in the database for identification purposes. [This example](https://github.com/amitsarangi/webauthn-demo-react-express/blob/master/server/routes/auth.js#L183) just saves the `name` as `Test` string, which should not be the case in real life.  

### credId: STRING
Unique id of the credential. 

### publicKey: STRING
public-key of the credential. 

### counter: STRING
Number of times authenticator has been used

## Steps happening here

- Sign Up: 
    - Username & password is collected and sent to server. [Revelant code](https://github.com/amitsarangi/webauthn-demo-react-express/blob/master/src/containers/LoginPage.js#L70-L81)

    - Server adds the user to database, and signs him in using a JWT cookie. [Relevant code](https://github.com/amitsarangi/webauthn-demo-react-express/blob/master/server/routes/user.js#L7-L33)

    - The user is taken to dashboard page, where he has options to "Add Security Key", "Delete all Security Keys" or "Log Out" 

- Add Security Key:
    - When the user clicks "Add Security Key", The client send a request to server to fetch the AttestationOptions/CredentialsCreationOptions. [Relevant code](https://github.com/amitsarangi/webauthn-demo-react-express/blob/master/src/containers/DashboardPage.js#L61-L64)
    
    - The server checks that the user is signed in. Server fetches user's alreadt existing keys and adds it to `attestationOptions.excludeCredentials` so that the same key is not registered twice for the same user. The user information is then added to `attestationOptions.user`. The `attestationOptions` object is then encoded using [webauthnjs-helper](https://github.com/amitsarangi/webauthnjs-helper) library. The base64url encoded string is then saved to the session. [Relevant code](https://github.com/amitsarangi/webauthn-demo-react-express/blob/master/server/routes/auth.js#L134-L155)  
    **IMP: The challange must be saved in session to prevent replay attacks**

    - The client receives the attestationOptions, decodes them so that the values are ArrayBuffer using [webauthnjs-helper](https://github.com/amitsarangi/webauthnjs-helper) and passes them to `navigator.credentials.create`. The client then decodes the attestationResponse and send to server. [Relevant code](https://github.com/amitsarangi/webauthn-demo-react-express/blob/master/src/containers/DashboardPage.js#L64-L77)
    
    - Server decodes the received attestationResponse. It builds the `attestationExpectations` object with the challenge saved in the session. The server then verifies the attestationResult using `f2l.attestationResult` method. If successful, the server extracts the `publicKey`, `credId` and `counter` from the `result` and save it to the database associated with `user.id`. [Relevant code](https://github.com/amitsarangi/webauthn-demo-react-express/blob/master/server/routes/auth.js#L157-L200)  
    **IMP: Remove challenge from the session to prevent replay attacks**

- Delete Security Key:
    - Deleting security keys is easy. The server just removes the key from the database.
    [Relevant server code](https://github.com/amitsarangi/webauthn-demo-react-express/blob/master/server/routes/auth.js#L202-L205) & [Relevant client code](https://github.com/amitsarangi/webauthn-demo-react-express/blob/master/src/containers/DashboardPage.js#L83)

- Sign In:
    - The client collects the username and password from user and then send it to server. [Relevant code](https://github.com/amitsarangi/webauthn-demo-react-express/blob/master/src/containers/LoginPage.js#L45)
    
    - Server verifies the authenticity of the username & password. 
    
    - If the user has no security keys associated. Then success message is sent to client and client can login. [Revelant server code](https://github.com/amitsarangi/webauthn-demo-react-express/blob/master/server/routes/auth.js#L35-L58) & [Relevant client code](https://github.com/amitsarangi/webauthn-demo-react-express/blob/master/src/containers/LoginPage.js#L45-L48)

    - If the user has a security key associated. The server generates the `assertionOptions` using fido2-lib. The server adds all user's keys to `assertionOptions.allowCredentials`. The server encodes the assertionOptions so that it can be sent over the network. The server saves the associated challenge and userId in session. The server then sends the `assertionOptions` to client with message `webauthn.get` so client knows to initiate the webauthn assertion ceremony. [Relevant code](https://github.com/amitsarangi/webauthn-demo-react-express/blob/master/server/routes/auth.js#L60-L75)  
    **IMP: The challange & userId must be saved in session to prevent replay attacks**

    - If the `res.message` is `webauthn.get` the client knows to initiate the assertion ceremony. It decoes the assertionOptions and passes it to `navigator.credentials.get`. The client then encodes the `assertionResponse` it gets from `navigator.credentials.get`, encodes it and then sends it to server. [Relevant code](https://github.com/amitsarangi/webauthn-demo-react-express/blob/master/src/containers/LoginPage.js#L49-L63)

    - The server decodes the `assertionResponse`. Gets the associated user from session saved userId. Finds the associated credential from the list of user registered keys. it then builds the `assertionExpectations` object with the `associatedKey` and other parameters. It verifies the assertionResponse using `f2l.assertionResult`. It updates the `associatedKey.counter` with the new value from `f2l.assertionResult` and saves it to database. The server then generates the JWT signed coolkie and sends it to the client, which signs him in. [Relevant code](https://github.com/amitsarangi/webauthn-demo-react-express/blob/master/server/routes/auth.js#L82-L128)  
    **IMP: Remove the challenge & userId from session**

