import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Paper from "@material-ui/core/Paper";
import SwipeableViews from "react-swipeable-views";
import { withSnackbar } from "notistack";

import SignInForm from "../forms/SignInForm";
import SignupForm from "../forms/SignUpForm";

import { signIn, signUp, postRegistrationResponse } from "../api";

const styles = () => ({
  root: {},
  paper: {
    position: "absolute",
    width: 500,
    left: "50%",
    top: 150,
    marginLeft: -250
  }
});

class LoginPage extends Component {
  state = {
    tab: 0
  };
  handleChange = (event, newValue) => {
    this.setState({ tab: newValue });
  };

  handleSignIn = ({ username, password }) => {
    if (username.length === 0 || password.length === 0) {
      this.props.enqueueSnackbar("Username & Password required");
      return;
    }

    signIn({ username, password })
      .then(res => {
        this.props.history.push("/");
      })
      .catch(this.showErrorSnackbar);

    // const registrationResponse = {
    //   id:
    //     "0CNnRYa6EfIjcRta0ttEQiGHMMr8iM-QEWFYNWNPax_gRP_tFe7Hm5kVYFAuhZsr3fVLjJqI1DcptP8rjT1vgA",
    //   rawId:
    //     "0CNnRYa6EfIjcRta0ttEQiGHMMr8iM+QEWFYNWNPax/gRP/tFe7Hm5kVYFAuhZsr3fVLjJqI1DcptP8rjT1vgA==",
    //   type: "public-key",
    //   response: {
    //     attestationObject:
    //       "o2NmbXRkbm9uZWdhdHRTdG10oGhhdXRoRGF0YVjESZYN5YgOjGh0NBcPZHZgW4/krrmihjLHmVzzuoMdl2NBAAAAHwAAAAAAAAAAAAAAAAAAAAAAQNAjZ0WGuhHyI3EbWtLbREIhhzDK/IjPkBFhWDVjT2sf4ET/7RXux5uZFWBQLoWbK931S4yaiNQ3KbT/K409b4ClAQIDJiABIVgg+6X29qJNvPbzvOQwDAnHkh6+/oVAJj0DPJ4vQZqAiAoiWCBZle94hyAcnTeJbxIaj8E6km5cek3MiFGeFs67kRRSNg==",
    //     clientDataJSON:
    //       "eyJjaGFsbGVuZ2UiOiJZdThsWC03Rm5abTdUTkJzcmRkemR2TXE0OXhpT2JSclhjOEIyMnhLeHhFbjdMQUw0TlNmZDRXcGxJeUhoUTdmT2lSSmtQcVdQdER2LURlSnBJcFc4QSIsIm9yaWdpbiI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCIsInR5cGUiOiJ3ZWJhdXRobi5jcmVhdGUifQ=="
    //   }
    // };

    // postRegistrationResponse({ registrationResponse }).then(console.log);
  };

  handleSignUp = ({ username, password }) => {
    if (username.length === 0 || password.length === 0) {
      this.props.enqueueSnackbar("Username & Password required");
      return;
    }

    signUp({ username, password })
      .then(res => {
        this.props.history.push("/");
      })
      .catch(this.showErrorSnackbar);
  };

  showErrorSnackbar = error => {
    console.log(error);
    this.props.enqueueSnackbar(error.message);
  };

  render() {
    const { classes } = this.props;
    const { tab } = this.state;
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Tabs
            value={tab}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Login" index="login" />
            <Tab label="Sign Up" index="signup" />
          </Tabs>
          <SwipeableViews
            axis={"x"}
            index={tab}
            onChangeIndex={this.handleChange}
          >
            {tab === 0 ? <SignInForm signIn={this.handleSignIn} /> : <div />}
            {tab === 1 ? <SignupForm signUp={this.handleSignUp} /> : <div />}
          </SwipeableViews>
        </Paper>
      </div>
    );
  }
}

LoginPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  })
};

export default withSnackbar(withStyles(styles)(LoginPage));
