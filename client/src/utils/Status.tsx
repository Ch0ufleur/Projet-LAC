import { CaseStep } from "../model/enum/CaseStatus";

export function getStatus(step: CaseStep) {
  switch (step) {
    case CaseStep.WaitingPreApproval:
      return "Nouveau";
    case CaseStep.WaitingComity:
      return "En révision";
    case CaseStep.WaitingCatalogue:
      return "À ajouter";
      case CaseStep.Posted:
        return "Publié";
    default:
      return "Modifications à faire";
  }
}
