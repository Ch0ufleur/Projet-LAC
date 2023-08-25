import React from "react";
import logo from "../../../img/logo-lac.png";
import "./Creation.scss";
import "../About.scss";
import { TeamMember } from "../../../model/Team";
import Timeline from "./Timeline";

export default function Creation() {


  return (
    <div>
      <div className="aboutHeader">
        <h2>
          Étudiants en génie industirel qui ont collaboré à la création du LAC
        </h2>
        <img src={logo} alt="LAC logo" />
      </div>
      <div className="creationContent">
        <p>
          Dans le cadre du projet intégrateur&nbsp;
          <a
            href="https://www.polymtl.ca/programmes/cours/prisme"
            target="_blank"
          >
            PRISME
          </a>
          , six étudiantes et étudiants de baccalauréat en génie industriel ont
          aidé à la conception du LAC. Le projet, étalé sur deux trimestres
          (automne 2021 et hiver 2022) à portée notamment sur l'identification
          des besoins, l’élaboration d’un plan stratégique et la détermination
          de la viabilité technologique et économique des propositions. Ce
          projet a donné l’opportunité aux étudiantes et étudiants de transférer
          des notions acquises dans les différents cours du programme de génie
          industriel en contexte réel.
        </p>
        <br />
        <div className="studentsHeader">Étudiants PRISME 2021-2022</div>

      </div>

      <div className="aboutHeader">
        <h2>
          Étudiants en génie logiciel qui ont collaboré à la création du LAC
        </h2>
        <img src={logo} alt="LAC logo" />
      </div>
      <div className="creationContent">
        <p>
          Dans le cadre d’une subvention du&nbsp;
          <a href="https://www.polymtl.ca/appui-pedagogique/" target="_blank">
            Fonds d’actions pédagogiques stratégiques
          </a>
          &nbsp; (FAPS), des étudiants de génie logiciel ont eu le mandat de
          développer la plateforme numérique et ses fonctionnalités (ex. : page
          d'accueil, gestion du catalogue de cas, gestion des comptes et des
          accès aux ressources). La phase 1 du projet s’est étalé sur deux
          trimestres (hiver et été 2022). La phase 2 qui consiste à tester la
          plateforme au sein de petit groupe sera lancé à l’automne 2022 avant
          le lancement officiel (hiver 2023).
        </p>
        <br />
        <div className="studentsHeader">Étudiants génie logiciel 2022</div>

      </div>

      <div className="aboutHeader">
        <h2>Création du LAC</h2>
        <img src={logo} alt="LAC logo" />
      </div>
      <div className="creationContent">
        <p>
          Dans une optique de rendre reproductible l’implantation de notre
          projet technologique, les grandes étapes sont illustrées ci-dessous
        </p>
        <br />
        <div>
          <Timeline />
        </div>
      </div>
    </div>
  );
}
