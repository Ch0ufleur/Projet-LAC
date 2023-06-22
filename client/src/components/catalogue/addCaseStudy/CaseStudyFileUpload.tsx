import React from "react";
import "./CaseStudyFileUpload.scss";
import {Checkbox, FormControlLabel, FormGroup} from "@mui/material";
import {checkList} from "../../deputy/newCase/NewCase";

const CaseStudyFileUpload = () => {
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
        </div>
    </div>
};

export default CaseStudyFileUpload;
