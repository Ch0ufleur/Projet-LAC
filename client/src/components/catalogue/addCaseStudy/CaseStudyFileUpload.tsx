import React, {MutableRefObject, useRef} from "react";
import "./CaseStudyFileUpload.scss";
import {Checkbox, FormControlLabel, FormGroup, FormLabel} from "@mui/material";
import { checkList } from "../../roles/approval/deputy/Feedback";
import Button from "@mui/material/Button";

// @ts-ignore
const CaseStudyFileUpload = ({updateFiles}) => {
    const [isVerified, setVerified] = React.useState(false);
    const [checkedState, setCheckedState] = React.useState<boolean[]>(new Array(checkList.length).fill(false));
    const initialStateErrors = {
        caseStudyFile: { isError: false, message: "" }
    };
    const inputFiles = useRef<HTMLInputElement | null>(null);

    const [stateErrors, setStateErrors] = React.useState(initialStateErrors);
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

    const onValidation = (e: any) => {
        let isValid = true;
        const stateErrorsCopy = { ...initialStateErrors };

        if (e.caseStudyFile.value.trim() === "") {
            stateErrorsCopy.caseStudyFile = {
                isError: true,
                message: "Veuillez entrer votre étude de cas",
            };
            isValid = false;
        }

        setStateErrors(!isValid ? stateErrorsCopy : initialStateErrors);
        return isValid;
    };


    const onUploadClicked = () => {
        if(inputFiles!= null) {
            (inputFiles as MutableRefObject<HTMLInputElement>).current.click();
        }
    };

    return <div className="landing-segment-container">
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
            />
                <Button onClick={onUploadClicked}>choisir depuis votre ordinateur
                </Button></div>
            <div className="drag-and-drop-container">
                <div className="drag-and-drop-prompt">Glisser-déposer le(s) fichier(s) ou <a onClick={onUploadClicked}>choisir depuis votre ordinateur</a></div>
            </div>
            <FormLabel error={stateErrors.caseStudyFile.isError}>
                {caseStudyFileName && <span>{caseStudyFileName}</span>}
            </FormLabel>
            <div style={{marginLeft: '24px'}}>
                <Button disabled={!isVerified} variant="contained" type="submit" form="caseStudyForm">
                    Suivant
                </Button>
            </div>
        </div>
    </div>
};

export default CaseStudyFileUpload;
