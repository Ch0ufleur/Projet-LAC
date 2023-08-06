import {
  Typography,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Switch,
  FormControlLabel,
} from "@mui/material";
import React, { useRef } from "react";
import "./PendingCaseEdit.scss";
import { Case } from "../../../../../model/CaseStudy";
import { useLocation, useNavigate } from "react-router-dom";
import PendingCaseEditTable, {
  PendingCaseEditTableRef,
} from "./PendingCaseEditTable";
import axios from "axios";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import SaveIcon from "@mui/icons-material/Save";
import { Document } from "../../../../../model/Document";
import { createCaseFromData } from "../../../../../utils/ConvertUtils";
import { ConfirmationDialog } from "../../../../common/ConfirmationDialog";

function PendingCaseEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

  const PendingCaseEditTableRef = useRef<PendingCaseEditTableRef | null>(null);
  const [hasBeenModified, SetHasBeenModified] = React.useState<Boolean>(false);
  const [wantsToConvertToFree, SetWantsToConvertToFree] =
    React.useState<boolean>(false);
  let [caseStudy, SetCaseStudy] = React.useState<Case>();
  const [duplicateErrorDialogOpen, setDuplicateErrorDialogOpen] =
    React.useState(false);
  const [confirmChangesDialogOpen, setConfirmChangesDialogOpen] =
    React.useState(false);

  const setModified = (isModified: boolean) => {
    SetHasBeenModified(isModified);
  };

  const openDuplicateErrorDialog = () => {
    setDuplicateErrorDialogOpen(true);
  };

  const handleDuplicateErrorDialogClose = () => {
    setDuplicateErrorDialogOpen(false);
  };

  const openConfirmChangesDialog = () => {
    setConfirmChangesDialogOpen(true);
  };

  const handleConfirmChangesDialogClose = () => {
    setConfirmChangesDialogOpen(false);
  };

  React.useEffect(() => {
    getCaseStudy(id);
  }, [id]);

  const getCaseStudy = (id: string | null) => {
    if (!id) return;
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}/api/caseStudies/` + id, {
        withCredentials: true,
      })
      .then((res) => {
        caseStudy = createCaseFromData(
          res.data._id,
          res.data.title,
          res.data.desc,
          res.data.authors,
          res.data.submitter,
          res.data.date,
          res.data.page,
          res.data.status,
          res.data.isPaidCase,
          res.data.isRejected,
          res.data.classId,
          res.data.discipline,
          res.data.subjects,
          res.data.files,
          res.data.ratings,
          res.data.votes
        );

        SetCaseStudy({ ...caseStudy });

        if (!caseStudy || !PendingCaseEditTableRef.current) return;
        PendingCaseEditTableRef.current.RefreshCaseFiles(caseStudy.files);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleConfirmChanges = async (e: any) => {
    e.preventDefault();
    handleConfirmChangesDialogClose();
    if (!caseStudy || !PendingCaseEditTableRef.current) return;

    const filenamesToDelete =
      PendingCaseEditTableRef.current.GetFilenamesToDelete();

    // Delete files
    for (const filename of filenamesToDelete) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_BASE_API_URL}/api/caseStudies/deleteFile/${filename}`,
          {
            data: { caseStudy: caseStudy },
            withCredentials: true,
          }
        );
        caseStudy.files = caseStudy.files.filter((document: Document) => {
          return document.file.filename !== filename;
        });
      } catch (error) {
        console.log(error);
      }
    }

    // Prepare data for patch requests
    const remainingDocuments: Document[] = caseStudy.files;
    const files = remainingDocuments.map((document) => document.file);

    const addedFilesFormData = new FormData();
    Array.from(PendingCaseEditTableRef.current.GetFilesToUpload()).forEach(
      (file) => {
        addedFilesFormData.append("addedFiles[]", file as Blob);
      }
    );

    // Patch requests to remove deleted files and add new ones to case study for resubmitting
    try {
      await axios.patch(
        `${process.env.REACT_APP_BASE_API_URL}/api/caseStudies/removeFileRefs/${caseStudy.id_}`,
        { files },
        { withCredentials: true }
      );

      await axios.patch(
        `${process.env.REACT_APP_BASE_API_URL}/api/caseStudies/addFileRefs/${caseStudy.id_}`,
        addedFilesFormData,
        { withCredentials: true }
      );

      if(wantsToConvertToFree) {
        await axios.patch(
          `${process.env.REACT_APP_BASE_API_URL}/api/caseStudies/convertToFree/${id}`,
          {},
         { withCredentials: true }
        )
      }

      await axios.patch(
        `${process.env.REACT_APP_BASE_API_URL}/api/caseStudies/resubmit/${id}`,
        {},
       { withCredentials: true }
      )
    } catch (error) {
      console.log(error);
    }

    // Completion actions
    SetHasBeenModified(false);
    PendingCaseEditTableRef.current.ClearModifications();
    getCaseStudy(caseStudy.id_.toString());
  };

  return (
    <div>
      {caseStudy && (
        <div id="pendingCase">
          <Button className="return" href="/my-pending-case-studies">
            &gt; Retour à mes études de cas
          </Button>
          <div id="generalCaseInfo">
            <div>Cas: {caseStudy.id_}</div>
            <div>Titre: {caseStudy.title}</div>
            <div>Auteur: {caseStudy.authors} </div>
            <div>Reçu le: {caseStudy.date} </div>
          </div>
          <Card>
            <Typography id="folderTitle">
              Documents soumis par l'auteur
            </Typography>
            <PendingCaseEditTable
              ref={PendingCaseEditTableRef}
              case={caseStudy}
              setModified={setModified}
              openDuplicateErrorDialog={openDuplicateErrorDialog}
              closeDuplicateErrorDialog={handleDuplicateErrorDialogClose}
              wantsToConvertToFree={wantsToConvertToFree}
            />
          </Card>
          <br />
          {caseStudy.isRejected && (
            <>
              <form
                onSubmit={handleConfirmChanges}
                id="uploadNewFiles"
                encType="multipart/form-data"
              >
                <Button variant="contained" color="primary" component="label">
                  <FileUploadIcon /> Téléverser un fichier
                  <input
                    hidden
                    accept=".docx"
                    type="file"
                    onChange={(e) => {
                      PendingCaseEditTableRef.current
                        ? PendingCaseEditTableRef.current.AddFiles(
                            e.target.files
                          )
                        : null;
                      e.target.value = "";
                    }}
                    name="caseStudyFiles"
                    multiple
                  />
                </Button>
              </form>

              <div id="decision-actions">
                {caseStudy && caseStudy.isPaidCase && (
                  <FormControlLabel
                    control={
                      <Switch
                        value={wantsToConvertToFree}
                        onChange={() => {
                          if(!PendingCaseEditTableRef.current) return;
                          if (!wantsToConvertToFree && !PendingCaseEditTableRef.current.IsFileListEmpty()) {
                            SetHasBeenModified(true);
                          }
                          else if (
                            !PendingCaseEditTableRef.current.AreFilesModified()
                          ) {
                            SetHasBeenModified(false);
                          }
                          SetWantsToConvertToFree(!wantsToConvertToFree);
                        }}
                      />
                    }
                    label="Convertir en étude de cas gratuite"
                  />
                )}
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!hasBeenModified}
                  onClick={openConfirmChangesDialog}
                >
                  <SaveIcon /> Confirmer les changements
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {!caseStudy && <div></div>}

      <Dialog
        open={duplicateErrorDialogOpen}
        onClose={handleDuplicateErrorDialogClose}
        fullWidth={true}
      >
        <DialogTitle>Erreur de téléversement</DialogTitle>

        <DialogContent>
          Un fichier du même nom est déjà présent pour cette étude de cas.
        </DialogContent>

        <DialogActions>
          <Button variant="contained" onClick={handleDuplicateErrorDialogClose}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmChangesDialogOpen} onClose={handleConfirmChangesDialogClose}>
      <DialogTitle><b>Attention</b></DialogTitle>
      <DialogContent>Cette action est irréversible. Êtes-vous certain de vouloir confirmer les changements? Il sera impossible de modifier l'étude de cas par la suite.</DialogContent>
      <DialogActions>
        <Button onClick={handleConfirmChangesDialogClose} color="error">
          Annuler
        </Button>
        <Button type="submit" form="uploadNewFiles" color="primary">
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>
    </div>
  );
}

export default PendingCaseEdit;
