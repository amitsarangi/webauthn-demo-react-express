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

import { signIn, signUp, postAssertionResponse } from "../api";
import {
  decodeAssertionOptions,
  encodeAssertionResponse
} from "webauthnjs-helper";

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

  handleSignIn = async ({ username, password }) => {
    if (username.length === 0 || password.length === 0) {
      this.props.enqueueSnackbar("Username & Password required");
      return;
    }

    try {
      const res = await signIn({ username, password });

      if (res.message === "success") {
        this.props.history.push("/");
      } else if (res.message === "webauthn.create") {
        // User has key
        const { assertionOptions } = res;

        const assertionResponse = await navigator.credentials.get({
          publicKey: decodeAssertionOptions(assertionOptions)
        });

        const encodedAssertionresponse = encodeAssertionResponse(
          assertionResponse
        );

        postAssertionResponse(encodedAssertionresponse).then(() => {
          this.props.history.push("/");
        });
      }
    } catch (e) {
      console.log(e);
    }
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
