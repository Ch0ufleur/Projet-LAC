import React from "react";
import "./CaseStudyFileUpload.scss";
import {Checkbox, FormControlLabel, FormGroup} from "@mui/material";
import {checkList} from "../../deputy/newCase/NewCase";
import Button from "@mui/material/Button";

const CaseStudyFileUpload = () => {
    const [isVerified, setVerified] = React.useState(false);
    const [checkedState, setCheckedState] = React.useState<boolean[]>(new Array(checkList.length).fill(false));
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
            <div className="drag-and-drop-container">
                <div className="drag-and-drop-prompt">Glisser-déposer le(s) fichier(s) ou <a href="_blank">choisir depuis votre ordinateur</a></div>
            </div>
            <div style={{marginLeft: '24px'}}>
                <Button disabled={!isVerified} variant="contained" type="submit" form="caseStudyForm">
                    Ajouter
                </Button>
            </div>
        </div>
    </div>
};

export default CaseStudyFileUpload;
