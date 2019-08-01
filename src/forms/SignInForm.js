import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const styles = () => ({
  root: {
    display: "flex",
    flexDirection: "column"
  },
  textField: {
    marginTop: 40,
    marginLeft: 20,
    marginRight: 20
  },
  button: {
    marginTop: 40,
    marginBottom: 40,
    marginLeft: 20,
    marginRight: 20
  }
});
class SignInForm extends Component {
  state = {
    username: "",
    password: ""
  };

  handleChange = name => event => {
    this.setState({ ...this.state, [name]: event.target.value });
  };

  render() {
    const { classes } = this.props;
    const { username, password } = this.state;

    return (
      <form className={classes.root}>
        <TextField
          id="outlined-name"
          label="Username"
          className={classes.textField}
          value={username}
          onChange={this.handleChange("username")}
          margin="normal"
          variant="outlined"
        />
        <TextField
          id="outlined-name"
          label="Password"
          className={classes.textField}
          value={password}
          onChange={this.handleChange("password")}
          margin="normal"
          variant="outlined"
        />

        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={() => this.props.signIn(this.state)}
        >
          Log in
        </Button>
      </form>
    );
  }
}

SignInForm.propTypes = {
  signIn: PropTypes.func.isRequired
};

export default withStyles(styles)(SignInForm);
