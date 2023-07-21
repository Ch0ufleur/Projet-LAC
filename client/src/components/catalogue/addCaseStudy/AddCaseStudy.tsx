import * as React from "react";
import NavBar from "../../common/NavBar";
import CaseStudyFileUpload from "./CaseStudyFileUpload";
import CaseStudyInformationForm from "./CaseStudyInformationForm";
import {useState} from "react";

export default function AddCaseStudy() {
  const [hasUpdatedFiles, setHasUpdatedFiles] = useState(false);

  const updateFiles = (didItUpdate: boolean) => {
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
          <CaseStudyFileUpload updateFiles={updateFiles}></CaseStudyFileUpload>
        </div>
        <div className={!hasUpdatedFiles ? 'hidden' : ''}>
          <CaseStudyInformationForm></CaseStudyInformationForm>
        </div>




      </div>
    </div>
  );
}
