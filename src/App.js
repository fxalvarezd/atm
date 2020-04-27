import React, { useState } from "react";
import axios from "axios";

import Avatar from "@material-ui/core/Avatar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import AccountBox from "@material-ui/icons/AccountBox";
import useStyles from "./styles";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

const defaultState = {
  pin: "",
  deposit: "",
  withdraw: "",
  errors: {
    pin: "",
    deposit: "",
    withdraw: ""
  },
  user: {
    firstName: "First",
    lastName: "Last",
    balance: 0,
    dailyLimit: 100
  }
};

export default function App() {
  const classes = useStyles();
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState(defaultState.pin);
  const [deposit, setDeposit] = useState(defaultState.deposit);
  const [withdraw, setWithdraw] = useState(defaultState.withdraw);
  const [errors, setErrors] = useState(defaultState.errors);
  const [user, setUser] = useState(defaultState.user);

  function onLogin(event) {
    event.preventDefault();
    setLoading(true);

    setErrors({
      ...errors,
      pin: ""
    });

    if (!pin) {
      setErrors({
        ...errors,
        pin: "Invalid Pin"
      });

      return;
    }

    axios
      .get(`https://demo8909904.mockable.io/${pin}`)
      .then(res => {
        const { data } = res;
        setLoggedIn(true);
        setUser({
          ...user,
          ...data.user
        });
        setPin("");
        setLoggedIn(true);
        setLoading(false);
      })
      .catch(err => {
        console.log(`Error ${err}`);
        setErrors({ ...errors, pin: "Invalid Pin" });
        setLoading(false);
      });
  }

  function signOut() {
    setPin(defaultState.pin);
    setDeposit(defaultState.deposit);
    setWithdraw(defaultState.withdraw);
    setErrors(defaultState.errors);
    setUser(defaultState.user);
    setLoading(false);
    setLoggedIn(false);
  }

  function onDeposit(event) {
    event.preventDefault();

    setLoading(true);

    setErrors({
      ...errors,
      deposit: ""
    });

    if (!deposit) {
      setErrors({
        ...errors,
        deposit: "Enter a valid deposit amount"
      });

      setLoading(false);

      return;
    }

    if (errors.deposit) {
      return;
    }

    axios
      .get(`https://demo8909904.mockable.io/atm`)
      .then(res => {
        setUser({
          ...user,
          balance: user.balance + parseInt(deposit, 10)
        });
        setDeposit("");
        setLoading(false);
      })
      .catch(err => {
        console.log(`Error ${err}`);
        setLoading(false);
      });
  }

  function onWithdraw(event) {
    event.preventDefault();

    if (errors.withdraw) {
      return;
    }

    setLoading(true);

    setErrors({
      ...errors,
      withdraw: ""
    });

    if (!withdraw) {
      setErrors({
        ...errors,
        withdraw: "Enter a valid withdraw amount"
      });

      setLoading(false);

      return;
    }

    axios
      .get(`https://demo8909904.mockable.io/atm`)
      .then(res => {
        const withdrawAmount = parseInt(withdraw, 10);
        setUser({
          ...user,
          balance: user.balance - withdrawAmount,
          dailyLimit: user.dailyLimit - withdrawAmount
        });
        setWithdraw("");
        setLoading(false);
      })
      .catch(err => {
        console.log(`Error ${err}`);
        setLoading(false);
      });
  }

  function onChangePin(event) {
    const value = event.target.value;
    const onlyNums = value.replace(/[^0-9]/g, "");

    if (onlyNums.length > 4) {
      return;
    }

    setPin(onlyNums);
  }

  function onChangeDeposit(event) {
    const value = event.target.value;
    const onlyNums = value.replace(/[^0-9]/g, "");

    setErrors({
      ...errors,
      deposit: ""
    });

    setDeposit(onlyNums);
  }

  function onChangeWithdraw(event) {
    const value = event.target.value;
    const onlyNums = value.replace(/[^0-9]/g, "");

    if (onlyNums > user.dailyLimit) {
      setErrors({
        ...errors,
        withdraw: "Exceeded daily limit"
      });
    } else {
      setErrors({
        ...errors,
        withdraw: ""
      });
    }

    setWithdraw(onlyNums);
  }

  function renderLogin() {
    return (
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Please enter your pin
        </Typography>

        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>

        <form className={classes.form} noValidate onSubmit={onLogin}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="pin"
            label="Pin"
            name="pin"
            type="password"
            autoComplete="pin"
            value={pin}
            onChange={onChangePin}
            error={!!errors.pin}
            helperText={!!errors.pin ? errors.pin : ""}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={pin.length < 4 || loading}
          >
            Sign In
          </Button>
        </form>
      </div>
    );
  }

  function renderDashboard() {
    return (
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Welcome {user.firstName} {user.lastName}!
        </Typography>

        <Avatar className={classes.avatar}>
          <AccountBox />
        </Avatar>

        <div className={classes.mb}>
          <Typography component="div">
            Balance: <strong>{formatter.format(user.balance)}</strong>
          </Typography>
          <Typography component="div">
            Limit: <strong>{formatter.format(user.dailyLimit)}</strong>
          </Typography>
        </div>

        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="deposit"
          label="Deposit"
          name="deposit"
          type="text"
          autoComplete="deposit"
          value={deposit}
          onChange={onChangeDeposit}
          error={!!errors.deposit}
          helperText={!!errors.deposit ? errors.deposit : ""}
        />
        <Button
          type="button"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.mb}
          onClick={onDeposit}
          disabled={loading}
        >
          Deposit
        </Button>

        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="withdraw"
          label="Withdraw"
          name="withdraw"
          type="text"
          autoComplete="withdraw"
          value={withdraw}
          onChange={onChangeWithdraw}
          error={!!errors.withdraw}
          helperText={!!errors.withdraw ? errors.withdraw : ""}
        />
        <Button
          type="button"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.mb}
          onClick={onWithdraw}
          disabled={loading}
        >
          Withdraw
        </Button>
      </div>
    );
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <LockOutlinedIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            FX Bank
          </Typography>
          {true && (
            <Button color="inherit" onClick={signOut}>
              Sign Out
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container component="main" maxWidth="xs">
        <CssBaseline />

        {loggedIn ? renderDashboard() : renderLogin()}
      </Container>
    </div>
  );
}
