import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import "./Register.scss";
import FormControl from "@mui/material/FormControl";
import {
  Box,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { UserRegister } from "../../model/User";
import axios from "axios";
import countryList from "react-select-country-list";
import { useMemo } from "react";

export default function Register() {
  const [open, setOpen] = React.useState(false);
  const [uploadedImage, setUploadedImage] = React.useState(
    "Preuve de votre statut de professeur"
  );
  const [showProof, setShowProof] = React.useState(false);
  const countryListOptions = useMemo(() => countryList().getData(), []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedImage(e.target.files[0].name);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [state, setState] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
    country: "",
    status: "",
    proof: "",
    school: "poly",
    otherSchool: "",
  });

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
  ) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    console.log(name, value);
    if (name == "status") {
      setShowProof(value == "teacher");
    }
    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    //console.log(e.target.elements.firstName.value);
    const user: UserRegister = {
      email: e.target.elements.email.value,
      firstName: e.target.elements.firstName.value,
      lastName: e.target.elements.lastName.value,
      password: e.target.elements.password.value,
      status: e.target.elements.status.value,
      school: e.target.elements.school.value,
      country: e.target.elements.country.value,
      city: e.target.elements.city.value,
    };

    if (showProof) {
      user.proof = e.target.elements.proof.files[0];
    }

    if (state["school"] === "others") {
      user.school = e.target.elements.otherSchool.value;
    }

    console.log(user);
    sendRegisterForm(user);
  };

  const sendRegisterForm = (user: UserRegister) => {
    // axios.post("http://localhost:3001/api/auth/register", user).then((res) => {
    //   console.log(res);
    //   if (res.status === 201) {
    //     handleClose();
    //   }
    // });
  };

  return (
    <div>
      <a href="#" onClick={handleClickOpen}>
        Vous n'avez pas de compte?
      </a>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>S'inscrire</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
            euismod bibendum laoreet. Proin gravida dolor sit amet lacus
            accumsan et viverra justo commodo. Proin
          </DialogContentText>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
            id="registerForm"
          >
            <div>
              <TextField
                fullWidth
                required
                autoFocus
                margin="dense"
                label="Prénom"
                id="firstName"
                type="text"
                variant="outlined"
                name="firstName"
                onChange={handleInputChange}
                value={state.firstName}
              />
              <TextField
                fullWidth
                required
                autoFocus
                margin="dense"
                label="Nom"
                id="lastName"
                type="text"
                variant="outlined"
                name="lastName"
                onChange={handleInputChange}
                value={state.lastName}
              />
            </div>
            <div>
              <FormControl className="formControl" id="registerStatus" required>
                <InputLabel>Statut</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  value={state.status}
                  label="status"
                  onChange={handleInputChange}
                  name="status"
                >
                  <MenuItem value={"teacher"}>Enseignant/Enseignante</MenuItem>
                  <MenuItem value={"student"}>Étudiant/Étudiante</MenuItem>
                </Select>
              </FormControl>
              {showProof && (
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="label"
                  id="uploadProof"
                >
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleImageUpload}
                    name="proof"
                  />
                  <PhotoCamera />
                  <FormLabel>{uploadedImage}</FormLabel>
                </IconButton>
              )}
            </div>
            <div>
              <TextField
                required
                autoFocus
                margin="dense"
                id="email"
                label="Courriel"
                type="email"
                variant="outlined"
                name="email"
                onChange={handleInputChange}
                value={state.email}
              />
              <TextField
                required
                autoFocus
                margin="dense"
                id="password"
                label="Mot de passe"
                type="password"
                variant="outlined"
                name="password"
                onChange={handleInputChange}
                value={state.password}
              />
            </div>
            <FormControl className="formControl" fullWidth required>
              <InputLabel id="demo-simple-select-label">Université</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={state.school}
                label="school"
                onChange={handleInputChange}
                name="school"
              >
                <MenuItem value={"ets"}>
                  École de technologie supérieur
                </MenuItem>
                <MenuItem value={"enap"}>
                  École nationale d'administration publique
                </MenuItem>
                <MenuItem value={"hec"}>HEC Montréal</MenuItem>
                <MenuItem value={"inrs"}>
                  Institut national de la recherche scientifique (INRS)
                </MenuItem>
                <MenuItem value={"poly"}>Polytechnique Montréal - CAS</MenuItem>
                <MenuItem value={"bishops"}>Université Bishops</MenuItem>
                <MenuItem value={"concordia"}>Université Concordia</MenuItem>
                <MenuItem value={"udem"}>Université de Montréal</MenuItem>
                <MenuItem value={"udes"}>Université de Sherbrooke</MenuItem>
                <MenuItem value={"uqac"}>
                  Université du Québec à Chicoutimi
                </MenuItem>
                <MenuItem value={"uqar"}>
                  Université du Québec à Rimouski (UQAR)
                </MenuItem>
                <MenuItem value={"uqat"}>
                  Université du Québec à Trois-Rivières
                </MenuItem>
                <MenuItem value={"uqea"}>
                  Université du Québec en Abitibi-Témiscamingue
                </MenuItem>
                <MenuItem value={"uqeo"}>
                  Université du Québec en Outaouais
                </MenuItem>
                <MenuItem value={"laval"}>Université Laval</MenuItem>
                <MenuItem value={"mcgill"}>Université McGill</MenuItem>
                <MenuItem value={"teluq"}>Université TELUQ</MenuItem>
                <MenuItem value={"uqam"}>
                  UQAM | Université du Québec à Montréal
                </MenuItem>
                <MenuItem value={"others"}>Autres</MenuItem>
              </Select>
            </FormControl>
            <div>
              {state.school === "others" && (
                <TextField
                  required
                  autoFocus
                  margin="dense"
                  id="school"
                  label="Université"
                  type="text"
                  variant="outlined"
                  name="otherSchool"
                  onChange={handleInputChange}
                  value={state.otherSchool}
                />
              )}
            </div>
            <div>
              <FormControl
                id="registerCountry"
                className="formControl"
                required
              >
                <InputLabel id="demo-simple-select-label">Pays</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={state.country}
                  label="country"
                  onChange={handleInputChange}
                  name="country"
                >
                  {countryListOptions.map((country) => (
                    <MenuItem value={country.label}>{country.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                required
                autoFocus
                margin="dense"
                id="city"
                label="Ville"
                type="text"
                variant="outlined"
                name="city"
                onChange={handleInputChange}
              />
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button variant="contained" type="submit" form="registerForm">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
