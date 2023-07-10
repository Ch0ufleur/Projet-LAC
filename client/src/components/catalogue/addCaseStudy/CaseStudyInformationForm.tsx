import React from "react";
import {Checkbox, FormLabel, InputLabel, ListItemText, Select} from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {Disciplines, Subjects} from "../Catalogue";
import MenuItem from "@mui/material/MenuItem";
import {NewCaseStudy} from "../../../model/CaseStudy";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CaseStudyInformationForm = () => {
    const navigate = useNavigate();

    const initialStateErrors = {
        title: { isError: false, message: "" },
        desc: { isError: false, message: ""},
        author: { isError: false, message: "" },
        course: { isError: false, message: "" },
        discipline: { isError: false, message: ""},
        subject: { isError: false, message: ""},
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

    return <div className="landing-segment-container">
        <div className="landing-segment-column-left">
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
        <form
            onSubmit={onSubmit}
            id="caseStudyForm"
            encType="multipart/form-data"
        >
            <div>
                <Checkbox
                    autoFocus
                    name="paid"
                />
                <FormLabel>Étude de cas payante</FormLabel>
            </div>

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
        </form>
        </div>
        </div>;

}

export default CaseStudyInformationForm
