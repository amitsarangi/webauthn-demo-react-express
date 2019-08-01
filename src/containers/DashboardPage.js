import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import { withSnackbar } from "notistack";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import {
  decodeAttestationOptions,
  encodeAttestationResponse
} from "webauthnjs-helper";
import {
  isSignedIn,
  signOut,
  getRegistrationOptions,
  postRegistrationResponse
} from "../api";

const styles = () => ({
  root: {
    width: "60%",
    margin: "0px auto",
    paddingTop: 150
  },
  logoutWrapper: {
    height: 200,
    top: 150,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});

class DashboardPage extends Component {
  componentDidMount() {
    isSignedIn().catch(e => {
      console.log("Unable to login");
      console.log(e.message);
      this.props.history.push("/login");
    });
  }

  handleLogout = () => {
    signOut().then(this.props.history.push("/login"));
  };

  handleAddSecurityKey = async () => {
    // Get the registration options from the server. At this point they are base64url encoded.
    const registrationOptions = await getRegistrationOptions();

    const publicKeyOptions = decodeAttestationOptions(registrationOptions);
    try {
      const registrationResponse = await navigator.credentials.create({
        publicKey: publicKeyOptions
      });

      console.log(registrationResponse);
      const encodedRegistrationResponse = encodeAttestationResponse(
        registrationResponse
      );
      postRegistrationResponse({ ...encodedRegistrationResponse });
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <div className={classes.logoutWrapper}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={this.handleLogout}
            >
              Sign Out
            </Button>
          </div>
          <Divider />
          <div className={classes.securityKeysWrapper}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={this.handleAddSecurityKey}
            >
              Add Security Key
            </Button>
          </div>
        </Paper>
      </div>
    );
  }
}

DashboardPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  })
};

export default withSnackbar(withStyles(styles)(DashboardPage));
