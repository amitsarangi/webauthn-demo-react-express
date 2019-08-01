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
  getMyData,
  signOut,
  getRegistrationOptions,
  postRegistrationResponse,
  deleteSecurityKeys
} from "../api";

const styles = () => ({
  root: {
    width: "60%",
    margin: "0px auto",
    paddingTop: 150
  },
  topSection: {
    height: 200,
    top: 150,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around"
  },
  securityKeysWrapper: {
    textAlign: "center",
    padding: 50,
    fontSize: 20
  }
});

class DashboardPage extends Component {
  state = {};
  componentDidMount() {
    this.reloadData();
  }

  reloadData = () =>
    getMyData()
      .then(res => {
        this.setState({ ...res });
      })
      .catch(e => {
        console.log("Invalid User");
        console.log(e.message);
        this.props.history.push("/login");
      });

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
      postRegistrationResponse({ ...encodedRegistrationResponse }).then(
        this.reloadData
      );
    } catch (e) {
      console.log(e);
    }
  };

  handleDeleteKeys = async () => deleteSecurityKeys().then(this.reloadData);

  render() {
    const { classes } = this.props;
    const { user } = this.state;
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <div className={classes.topSection}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={this.handleAddSecurityKey}
            >
              Add Security Key
            </Button>

            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={this.handleDeleteKeys}
            >
              Delete All Security Keys
            </Button>

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
            {user && `Number of keys:  ${user.securitykeys.length}`}
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
