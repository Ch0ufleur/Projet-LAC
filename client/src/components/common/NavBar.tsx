import { Button, ButtonGroup } from "@mui/material";
import React, { useCallback } from "react";
import "./NavBar.scss";
import Login from "../connection/Login";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import { Role } from "../../model/enum/Role";
import { UnlockAccess } from "../connection/UnlockAccess";
import logo from "../../img/logo-lac.png";

interface Props {}

const NavBar: React.FC<Props> = ({}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  const navigateCatalog = useCallback(() => {
    navigate("/cataogue");
    handleClose();
  }, [navigate]);

  return (
    <div id="navbar">
      <div className="navbar-width">
              <img src={logo} alt="LAC logo" className="navbar-logo"/>
              <div className="catalog-button-container">
                  <Button id="catalogButton" onClick={navigateCatalog} variant="contained">Catalogue</Button>
              </div>
              <UnlockAccess
                  role={[Role.Deputy, Role.Comity, Role.PolyPress]}
                  children={<Button href="/dashboard">Tableau de board</Button>}
              ></UnlockAccess>
          <Login />
      </div>
    </div>
  );
};

export default NavBar;
