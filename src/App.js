import React from 'react';
import MaterialTable from 'material-table';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import './App.css';



// TODO:
// Formularz dodania użytkownika: (OK)
// Nickname, Email, IP address (OK)
// Walidacja Emailu i adresu IP (OK)
// Przycisk Submit wygaszony, jeśli walidacja nie przeszła (OK)
// Operacja zablokowana, jeżeli istnieje użytkownik o takim nicku lub emailu (OK)
//
// Przycisk usuwania użytkownika z tabeli (OK)
// Przycisk usuwania całej listy (widoczny, gdy lista nie jest pusta) (OK)
// Potwierdzenie usuwania (OK)
// Popupy informujące, dlaczego użytkownika nie można dodać (OK)
// Sortowanie użytkowników po nicku, emailu lub dacie (OK)


class App extends React.Component {

  constructor(props) {
    super(props);
    this.deleteAllButton = this.deleteAllButton.bind(this);
    this.deleteAllYes = this.deleteAllYes.bind(this);
    this.deleteAllNo = this.deleteAllNo.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      usersData: [],
      user: {
        nick: '',
        email: '',
        ip_address: '',
        joindate: ''
      },

      formStates: {
        nick: true,
        email: true,
        ip_address: true,
      },

      formHelpers: {
        nick: 'e.g: Nickname',
        email: 'e.g: address@mail.com',
        ip_address: 'e.g: 192.168.1.1'
      },
      buttonDisabled: true,
      showDeleteAll: false,
      openModal: false
    };

  };

  re_email = new RegExp("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$");
  re_ip = new RegExp("^(?:(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(\.(?!$)|$)){4}$");

  deleteAllButton() {
    this.setState({
      openModal: true
    });
  }

  deleteAllYes() {
    this.setState({
      openModal: false,
      usersData: []
    });
  }

  deleteAllNo() {
    this.setState({
      openModal: false,
    });
  }

  checkNickname(nick) {
    if (nick.length < 3) {
      return { isValid: false, formHelperText: "Nickname too short (min 3 characters)." }
    } else {
      return { isValid: true, formHelperText: "Nickname OK." }
    }
  }

  checkEmail(email) {
    if (this.re_email.test(email)) {
      return { isValid: true, formHelperText: "Email OK." }
    } else {
      return { isValid: false, formHelperText: "Invalid email format." }
    }
  }

  checkIP_address(ip_address) {
    if (this.re_ip.test(ip_address)) {
      return { isValid: true, formHelperText: "IP address OK." }
    } else {
      return { isValid: false, formHelperText: "Invalid IP address format." }
    }
  }

  handleChange = (event) => {
    var inputState = {
      isValid: false,
      formHelperText: ""
    }

    const name = event.target.name;
    const value = event.target.value;

    if (event.target.name === "nick") {
      inputState = this.checkNickname(event.target.value);
    }

    if (event.target.name === "email") {
      inputState = this.checkEmail(event.target.value);
    }

    if (event.target.name === "ip_address") {
      inputState = this.checkIP_address(event.target.value);
    }

    this.setState(prevState => {
      return {
        user: { ...prevState.user, [name]: value },
        formStates: { ...prevState.formStates, [name]: inputState.isValid },
        formHelpers: { ...prevState.formHelpers, [name]: inputState.formHelperText }
      };
    });
    this.checkForm();

  }

  checkIfEmpty() {
    if (this.state.user.nick === "") return false;
    if (this.state.user.email === "") return false;
    if (this.state.user.ip_address === "") return false;
    return true;
  }

  checkForm() {
    if (this.checkIfEmpty() == false) return false;
    if (this.state.formStates.nick && this.state.formStates.email && this.state.formStates.ip_address) {
      if (this.state.buttonDisabled == true) {
        this.setState({
          buttonDisabled: false
        });
      }
    }
    else {
      if (this.state.buttonDisabled == false) {
        this.setState({
          buttonDisabled: true
        });
      }
    }
  }

  handleSubmit = (event) => {
    var continue_Submit = true;
    const user = {
      nickname: this.state.user.nick,
      email: this.state.user.email,
      IP_address: this.state.user.ip_address,
      joindate: new Date()
    }
    for (var i = 0; i < this.state.usersData.length; i++) {
      if (this.state.usersData[i].nickname == user.nickname) {
        this.setState(prevState => {
          return {
            formStates: { ...prevState.formStates, nick: false },
            formHelpers: { ...prevState.formHelpers, nick: "This user already exists." }
          };
        });
        continue_Submit = false;
      }
      if (this.state.usersData[i].email == user.email) {
        this.setState(prevState => {
          return {
            formStates: { ...prevState.formStates, email: false },
            formHelpers: { ...prevState.formHelpers, email: "This email is already used." }
          };
        });
        continue_Submit = false;
      }
    }

    if (continue_Submit == true) {
      const usersTempList = this.state.usersData.concat(user)
      this.setState({
        usersData: usersTempList
      });
    }

    event.preventDefault();
  }

  componentDidUpdate() {
    if (this.state.usersData.length > 0) {
      if (this.state.showDeleteAll == false) {
        this.setState({
          showDeleteAll: true
        });
      }
    } else {
      if (this.state.showDeleteAll == true) {
        this.setState({
          showDeleteAll: false
        });
      }
    }
    this.checkForm();
  }

  render() {
    return (

      <div style={{ maxWidth: '100%' }}>
        <div>
          <h2 className="header">Crypto Users</h2>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className="formInput">
            <FormControl error={!this.state.formStates.nick} id="nick-control" >
              <InputLabel htmlFor="nick-input">Nickname</InputLabel>
              <Input id="nick-input" aria-describedby="nick-helper-text" type="text" onChange={this.handleChange} name="nick" />
              <FormHelperText id="nick-helper-text">{this.state.formHelpers.nick}</FormHelperText>
            </FormControl>
          </div>
          <div className="formInput">
            <FormControl error={!this.state.formStates.email} id="email-control" >
              <InputLabel htmlFor="email-input">Email address</InputLabel>
              <Input id="email-input" aria-describedby="email-helper-text" type="email" onChange={this.handleChange} name="email" />
              <FormHelperText id="email-helper-text">{this.state.formHelpers.email}</FormHelperText>
            </FormControl>
          </div>
          <div className="formInput">
            <FormControl error={!this.state.formStates.ip_address} id="ip_address-control" >
              <InputLabel htmlFor="ip_address-input">IP address</InputLabel>
              <Input id="ip_address-input" aria-describedby="ip_address-helper-text" type="text" onChange={this.handleChange} name="ip_address" />
              <FormHelperText id="ip_address-helper-text">{this.state.formHelpers.ip_address}</FormHelperText>
            </FormControl>
          </div>

          <div>
            <Button variant="contained" disabled={this.state.buttonDisabled} type="submit"> Add User </Button>
          </div>

        </form>

        <Dialog
          open={this.state.openModal}
          onClose={this.deleteAllNo}
        >
          <div>
            <DialogTitle id="alert-dialog-title">{"Delete all users?"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete all users from the list?
          </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" color="primary" onClick={this.deleteAllYes}>Yes</Button>
              <Button variant="contained" color="secondary" onClick={this.deleteAllNo}>No</Button>
            </DialogActions>
          </div>
        </Dialog>

        <MaterialTable
          editable={
            {
              onRowDelete: oldData =>
                new Promise(resolve => {
                  setTimeout(() => {
                    resolve();
                    const data = this.state.usersData;
                    data.splice(data.indexOf(oldData), 1);
                    this.setState({ usersData: data });
                    this.checkForm(true);
                  }, 200);
                }),
            }
          }
          columns={[
            { title: 'Nickname', field: 'nickname' },
            { title: 'Email', field: 'email' },
            { title: 'IP address', field: 'IP_address' },
            { title: 'Date', field: 'joindate', type: 'datetime' }
          ]}
          data={this.state.usersData}
          title={<div> Users <Button style={{ display: this.state.showDeleteAll ? 'inline' : 'none' }} variant="contained" color="secondary" id="deleteAll_button" onClick={this.deleteAllButton}> Delete All </Button>
          </div>}
        />
      </div>
    );
  }

}

export default App;
