import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FormLabel, InputLabel, Select, Checkbox, ListItemText, Accordion, AccordionSummary, Typography, AccordionDetails, FormGroup, FormControlLabel } from "@mui/material";
import { NewCaseStudy } from "../../../model/CaseStudy";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import { Disciplines, Subjects } from "../Catalogue";
import NavBar from "../../common/NavBar";
import { useNavigate } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { checkList } from "../../deputy/newCase/NewCase";
import CaseStudyFileUpload from "./CaseStudyFileUpload";
import CaseStudyInformationForm from "./CaseStudyInformationForm";

export default function AddCaseStudy() {





  return (
    <div>
      <NavBar></NavBar>
      <div>
        <div className="landing-segment-container">
          <div className="landing-segment-column-left">
            <div>
              <div className="page-title">Ajouter une étude de cas</div>
              <div className="title-group-separator"></div>
            </div>
          </div>
        </div>

          <CaseStudyFileUpload></CaseStudyFileUpload>
        <CaseStudyInformationForm></CaseStudyInformationForm>


      </div>
    </div>
  );
}
