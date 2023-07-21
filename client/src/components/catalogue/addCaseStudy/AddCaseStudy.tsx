import * as React from "react";
import NavBar from "../../common/NavBar";
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
