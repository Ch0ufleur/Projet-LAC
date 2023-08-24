import * as React from "react";
import NavBar from "../../common/NavBar";
import "./CaseStudyFileUpload.scss";
import {DragEvent, MutableRefObject, useRef, useState} from "react";
import {Checkbox, FormControlLabel, FormGroup, FormLabel, InputLabel, ListItemText, Select} from "@mui/material";
import {checkList} from "../../roles/approval/deputy/Feedback";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {Disciplines, Subjects} from "../Catalogue";
import MenuItem from "@mui/material/MenuItem";
import {useNavigate} from "react-router-dom";
import {NewCaseStudy} from "../../../model/CaseStudy";
import axios from "axios";

export default function AddCaseStudy() {
  const [hasUpdatedFiles, setHasUpdatedFiles] = useState(false);
  const [isVerified, setVerified] = React.useState(false);
  const [checkedState, setCheckedState] = React.useState<boolean[]>(new Array(checkList.length).fill(false));
  const inputFiles = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();

  const initialStateErrors = {
    title: { isError: false, message: "" },
    desc: { isError: false, message: ""},
    author: { isError: false, message: "" },
    course: { isError: false, message: "" },
    discipline: { isError: false, message: ""},
    subject: { isError: false, message: ""},
    caseStudyFile: { isError: false, message: "" }
  };

  const [stateErrors, setStateErrors] = React.useState(initialStateErrors);

  const [selectedDiscipline, setSelectedDiscipline] = React.useState("");

  const onDisciplineChanged = (e: any) => {
    setSelectedDiscipline(e.target.value);
  };

  const [selectedSubjects, setSelectedSubject] = React.useState<string[]>([]);

  const onSubjectChanged = (e: any) => {
    setSelectedSubject(e.target.value);
  };

  const [state, setState] = React.useState({
    caseStudyFile: "",
    title: "",
    desc: "",
    author: "",
    course: "",
    discipline: "",
    subject: "",
  });



  const onSubmit = (e: any) => {
    e.preventDefault();
    const isFormValid = onValidation(e.target.elements);
    if (!isFormValid) {
      return;
    }

    const caseStudy = {
      title: e.target.elements.title.value,
      desc: e.target.elements.desc.value,
      authors: e.target.elements.author.value,
      submitter: localStorage.getItem("email"),
      classId: e.target.elements.course.value,
      files: Array.from(e.target.elements.caseStudyFile.files),
      discipline : e.target.elements.discipline.value,
      isPaidCase: e.target.elements.paid.checked,
    } as NewCaseStudy;

    const formData = new FormData();
    let key: keyof NewCaseStudy;
    for (key in caseStudy) {
      formData.append(key, caseStudy[key]);
    }

    selectedSubjects.forEach(subject => formData.append('subjects[]', subject));
    Array.from(e.target.elements.caseStudyFile.files).forEach(file => formData.append('files[]', (file as Blob)));

    sendAddCaseStudy(formData);
  };

  const sendAddCaseStudy = (caseStudy: FormData) => {
    axios
        .post(
            `${process.env.REACT_APP_BASE_API_URL}/api/caseStudies`,
            caseStudy,
            {
              withCredentials: true,
            },
        )
        .then((res) => {
          if (res.status === 201) {
            navigate("/catalogue");
          }
        });
  };

  const onValidation = (e: any) => {
    let isValid = true;
    const stateErrorsCopy = { ...initialStateErrors };

    if (e.title.value.trim() === "") {
      stateErrorsCopy.title = {
        isError: true,
        message: "Veuillez entrer le titre de votre étude de cas",
      };
      isValid = false;
    }

    if (e.desc.value.trim() === "") {
      stateErrorsCopy.desc = {
        isError: true,
        message: "Veuillez entrer le synopsis de votre étude de cas",
      };
      isValid = false;
    }

    if (e.author.value.trim() === "") {
      stateErrorsCopy.author = {
        isError: true,
        message: "Veuillez entrer le ou les auteurs de votre étude de cas",
      };
      isValid = false;
    }

    if (e.course.value.trim() === "") {
      stateErrorsCopy.course = {
        isError: true,
        message: "Veuillez entrer le cours associé à votre étude de cas",
      };
      isValid = false;
    }

    if (e.discipline.value.trim() === "") {
      stateErrorsCopy.discipline = {
        isError: true,
        message: "Veuillez entrer la discipline",
      };
      isValid = false;
    }

    if (selectedSubjects.length <= 0) {
      stateErrorsCopy.subject = {
        isError: true,
        message: "Veuillez entrer le(s) sujet(s)",
      };
      isValid = false;
    }
    if (caseStudyFileName.trim() === "") {
      stateErrorsCopy.caseStudyFile = {
        isError: true,
        message: "Veuillez entrer votre étude de cas",
      };
      isValid = false;
    }

    const courseIdPattern = new RegExp("^[A-Z]{2,4}\\d{3,5}\\s?$");
    if (!courseIdPattern.test(e.course.value.toUpperCase())) {
      stateErrorsCopy.course = {
        isError: true,
        message: "Veuillez entrer un sigle de cours valide",
      };
      isValid = false;
    }

    setStateErrors(!isValid ? stateErrorsCopy : initialStateErrors);
    return isValid;
  };
  const handleVerifyCheck = (index: number) => {
    const updatedCheckedState = checkedState.map((item: boolean, i) => {
      return index === i ? !item : item
    });
    setCheckedState(updatedCheckedState);

    let result = true;
    updatedCheckedState.forEach((item) => {
      result = result && item;
    })
    setVerified(result);
  }
  // https://claritydev.net/blog/react-typescript-drag-drop-file-upload-guide
  const [dragIsOver, setDragIsOver] = React.useState(false);
  const [files, setFiles] = React.useState<File[]>([]);

  // Define the event handlers
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragIsOver(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragIsOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragIsOver(false);
    console.log("abc");
    // Fetch the files
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles(files.concat(droppedFiles));

    // Use FileReader to read file content
    droppedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        console.log(reader.result);
      };

      reader.onerror = () => {
        console.error('There was an issue reading the file.');
      };

      reader.readAsDataURL(file);
      return reader;
    });
  };

  const [caseStudyFileName, setCaseStudyFileName] = React.useState(
      "Aucune étude de cas n'a été téléversée"
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Test');
    if (e.target.files && e.target.files.length > 0) {
      let fileNames = e.target.files[0].name;
      for (let i = 1; i < e.target.files.length; i++) {
        fileNames += ", " + e.target.files[i].name;
      }
      setCaseStudyFileName(fileNames);
    }
    updateFiles(true);
  };

  const handleFileSuppression = (indexToDelete : number) => {
    const newArray = files.filter((_, index) => index !== indexToDelete);
    setFiles(newArray);
  };


  const onUploadClicked = () => {
    if(inputFiles!= null) {
      (inputFiles as MutableRefObject<HTMLInputElement>).current.click();
    }
  };

  const updateFiles = (didItUpdate: boolean) => {
    if(caseStudyFileName.length===0) {
      let fileNames: string = files[0].name;
      for(let i = 1; i < files.length; i++) {
        fileNames += ", " + files[i].name;
      }
      setCaseStudyFileName(fileNames);
    }

    setHasUpdatedFiles(didItUpdate);
  };

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
        <div className={hasUpdatedFiles ? 'hidden' : ''}>
          <div className="landing-segment-container">
            <div className="landing-segment-column-left">
              <div className="verification-list-container">
                <div className="verification-title">
                  AVANT DE SOUMETTRE
                </div>
                <div className="checklist-container">
                  <div>
                    <FormGroup>
                      {checkList.slice(0,5).map((criteria, index) => (
                          <FormControlLabel
                              control={<Checkbox required/>}
                              label={criteria}
                              key={index}
                              checked={checkedState[index]}
                              onChange={() => handleVerifyCheck(index)}
                          />
                      ))}
                    </FormGroup>
                  </div>
                  <div>
                    <FormGroup>
                      {checkList.slice(5,10).map((criteria, index) => (
                          <FormControlLabel
                              control={<Checkbox />}
                              label={criteria}
                              key={index}
                          />
                      ))}
                    </FormGroup>
                  </div>
                </div>
              </div>
              <div><input
                  hidden
                  ref={inputFiles}
                  accept=".doc,.docx,.pdf"
                  type="file"
                  onChange={handleFileUpload}
                  name="caseStudyFile"
                  multiple
              /></div>
              <div className={files.length === 0 ? "drag-and-drop-container" : "uploaded-file-selector-container"} onDragOver={handleDragOver}
                   onDragLeave={handleDragLeave}
                   onDrop={handleDrop}>
                <div className="drag-and-drop-prompt">
                  { files.length === 0 && (
                      <span>Glisser-déposer le(s) fichier(s) ou <a onClick={onUploadClicked}>choisir depuis votre ordinateur</a></span>

                  )
                  }
                  { files.length !== 0 && (
                      <ul>
                        {files.map((fileName, index) => (
                            <div className="uploaded-file-selector">{fileName.name}
                              <button className="delete-button" onClick={()=>handleFileSuppression(index)}>
                                delete
                              </button>
                            </div>
                        ))}
                      </ul>

                  )
                  }
                </div>
              </div>
              <div style={{marginLeft: '24px'}}>
                <Button disabled={files.length === 0} variant="contained" onClick={()=>updateFiles(true)}>
                  Suivant
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className={!hasUpdatedFiles ? 'hidden' : ''}>
          <div className="landing-segment-container">
            <div className="landing-segment-column-left">
              <FormLabel error={stateErrors.caseStudyFile.isError}>
                {caseStudyFileName && <span>{caseStudyFileName}</span>}
              </FormLabel>
              <form
                  onSubmit={onSubmit}
                  id="caseStudyForm"
                  encType="multipart/form-data"
              >
                <ul>
                  {Object.entries(stateErrors).map(
                      ([field, error]) =>
                          error.isError && (
                              <li key={field} className="fieldError">
                                {error.message}
                              </li>
                          )
                  )}
                </ul>
                <div>
                  <Checkbox
                      autoFocus
                      name="paid"
                  />
                  <FormLabel>Étude de cas payante</FormLabel>
                </div>
                <input
                    hidden
                    ref={inputFiles}
                    accept=".doc,.docx,.pdf"
                    type="file"
                    onChange={handleFileUpload}
                    name="caseStudyFile"
                    multiple
                />

                <TextField
                    autoFocus
                    margin="dense"
                    label="Titre"
                    name="title"
                    type="text"
                    fullWidth
                    error={stateErrors.title.isError}
                />
                <TextField
                    multiline
                    rows={3}
                    margin="dense"
                    label="Synopsis"
                    name="desc"
                    type="text"
                    fullWidth
                    inputProps={{ maxLength: 1000 }}
                    error={stateErrors.desc.isError}
                />
                <TextField
                    margin="dense"
                    label="Auteur(s)"
                    name="author"
                    type="text"
                    helperText="John Doe, Jane Doe"
                    fullWidth
                    error={stateErrors.author.isError}
                />
                <TextField
                    margin="dense"
                    label="Cours"
                    name="course"
                    type="text"
                    inputProps={{ maxLength: 8 }}
                    helperText="IND1000"
                    fullWidth
                    error={stateErrors.course.isError}
                />
                {/* Seems like age is useless, TODO remove? */}
                {/*<InputLabel
                id="demo-simple-select-label"
            >Age</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Age"
                onChange={undefined}
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>*/}
                <InputLabel
                    id="demo-simple-select-label"
                    error={stateErrors.discipline.isError}
                >Discipline</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Discipline"
                    name="discipline"
                    value={selectedDiscipline}
                    onChange={onDisciplineChanged}
                    error={stateErrors.discipline.isError}
                    style={{width: '250px'}}
                >
                  {Disciplines.map((discipline) => (
                      <MenuItem value={discipline}>{"Génie " + discipline}</MenuItem>
                  ))}
                </Select>
                <InputLabel
                    id="demo-simple-select-label"
                    error={stateErrors.subject.isError}
                >Sujet</InputLabel>
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    label="Sujet"
                    name="subject"
                    value={selectedSubjects}
                    onChange={onSubjectChanged}
                    error={stateErrors.subject.isError}
                    renderValue={(selected) => selected.join(', ')}
                    style={{width: '250px'}}
                >
                  {Subjects.map((subject) => (
                      <MenuItem value={subject}>
                        <Checkbox checked={selectedSubjects.indexOf(subject) > -1} />
                        <ListItemText primary={subject} />
                      </MenuItem>
                  ))}
                </Select>
                <div style={{marginLeft: '24px'}}>
                  <Button variant="contained" type="submit">
                    Soumettre
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>




      </div>
    </div>
  );
}
