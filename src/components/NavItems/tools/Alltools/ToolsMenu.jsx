import React, { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  Grid,
  Snackbar,
  SvgIcon,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import Iframe from "react-iframe";
import DialogActions from "@mui/material/DialogActions";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import ToolsMenuItem from "./ToolsMenuItem";
import ImageIcon from "../../../NavBar/images/SVG/Image/Images.svg";
import VideoIcon from "../../../NavBar/images/SVG/Video/Video.svg";
import SearchIcon from "../../../NavBar/images/SVG/Search/Search.svg";
import DataIcon from "../../../NavBar/images/SVG/DataAnalysis/Data_analysis.svg";
import { useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { Audiotrack } from "@mui/icons-material";
import { ROLES, tools, TOOLS_CATEGORIES } from "../../../../constants/tools";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

/**
 *
 * @returns {Element}
 * @constructor
 */
const ToolsMenu = () => {
  const navigate = useNavigate();
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Alltools");
  const keywordNavbar = i18nLoadNamespace("components/NavBar");
  const keywordWarning = i18nLoadNamespace("components/Shared/OnWarningInfo");

  const [videoUrl, setVideoUrl] = useState(null);

  const userAuthenticated = useSelector(
    (state) => state.userSession && state.userSession.userAuthenticated,
  );

  const role = useSelector((state) => state.userSession.user.roles);
  const betaTester = role.includes(ROLES.BETA_TESTER);

  const [openAlert, setOpenAlert] = React.useState(false);

  const handleClick = (path, rolesNeeded) => {
    if (rolesNeeded && rolesNeeded.includes("lock")) {
      if (userAuthenticated) {
        handlePush(path);
      } else {
        setOpenAlert(true);
      }
    } else {
      handlePush(path);
    }
  };

  const handlePush = (path) => {
    if (path === "csvSna" || path === "factcheck" || path === "xnetwork") {
      window.open(process.env.REACT_APP_TSNA_SERVER + path, "_blank");
    } else {
      navigate("/app/tools/" + path);
    }
  };

  const canUserSeeTool = (tool) => {
    return (
      !tool.rolesNeeded ||
      (role && tool.rolesNeeded && role.includes(...tool.rolesNeeded)) ||
      tool.rolesNeeded.includes(ROLES.LOCK)
    );
  };

  //TODO: Move this code somewhere else so that the component is easier to reuse

  /**
   *
   * @type {Tool[]}
   */
  const toolsVideo = tools.filter(
    (tool) =>
      tool.category === TOOLS_CATEGORIES.VIDEO.name && canUserSeeTool(tool),
  );

  const toolsImages = tools.filter(
    (tool) =>
      tool.category === TOOLS_CATEGORIES.IMAGE.name && canUserSeeTool(tool),
  );

  const toolsAudio = tools.filter(
    (tool) =>
      tool.category === TOOLS_CATEGORIES.AUDIO.name && canUserSeeTool(tool),
  );

  const toolsSearch = tools.filter(
    (tool) =>
      tool.category === TOOLS_CATEGORIES.SEARCH.name && canUserSeeTool(tool),
  );

  const toolsData = tools.filter(
    (tool) =>
      tool.category === TOOLS_CATEGORIES.DATA_ANALYSIS.name &&
      canUserSeeTool(tool),
  );

  const learnTools = tools.filter(
    (tool) =>
      tool.category === TOOLS_CATEGORIES.LEARN.name && canUserSeeTool(tool),
  );

  const otherTools = tools.filter(
    (tool) =>
      tool.category === TOOLS_CATEGORIES.OTHER.name && canUserSeeTool(tool),
  );

  const toolsMenuCategories = [
    {
      type: TOOLS_CATEGORIES.VIDEO.name,
      name: keywordNavbar(TOOLS_CATEGORIES.VIDEO.name),
      value: toolsVideo,
      icon: (
        <SvgIcon
          component={VideoIcon}
          sx={{
            fontSize: "40px",
          }}
          inheritViewBox
        />
      ),
    },
    {
      type: TOOLS_CATEGORIES.IMAGE.name,
      name: keywordNavbar(TOOLS_CATEGORIES.IMAGE.name),
      value: toolsImages,
      icon: (
        <SvgIcon
          component={ImageIcon}
          sx={{
            fontSize: "40px",
          }}
          inheritViewBox
        />
      ),
    },
    {
      type: TOOLS_CATEGORIES.AUDIO.name,
      name: keywordNavbar(TOOLS_CATEGORIES.AUDIO.name),
      value: toolsAudio,
      icon: <Audiotrack width="40px" height="40px" />,
    },
    {
      type: TOOLS_CATEGORIES.SEARCH.name,
      name: keywordNavbar(TOOLS_CATEGORIES.SEARCH.name),
      value: toolsSearch,
      icon: (
        <SvgIcon
          component={SearchIcon}
          sx={{
            fontSize: "40px",
          }}
          inheritViewBox
        />
      ),
    },
    {
      type: TOOLS_CATEGORIES.DATA_ANALYSIS.name,
      name: keywordNavbar(TOOLS_CATEGORIES.DATA_ANALYSIS.name),
      value: toolsData,
      icon: (
        <SvgIcon
          component={DataIcon}
          sx={{
            fontSize: "40px",
          }}
          inheritViewBox
        />
      ),
    },
    {
      type: TOOLS_CATEGORIES.LEARN.name,
      name: keywordNavbar(TOOLS_CATEGORIES.LEARN.name),
      value: learnTools,
      icon: (
        <SvgIcon
          component={DataIcon}
          sx={{
            fontSize: "40px",
          }}
          inheritViewBox
        />
      ),
    },
    {
      type: TOOLS_CATEGORIES.OTHER.name,
      name: keywordNavbar(TOOLS_CATEGORIES.OTHER.name),
      value: otherTools,
      icon: <MoreHorizIcon width="40px" height="40px" />,
    },
  ];

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const categoriesAllowedForUser = toolsMenuCategories.filter(
    (category) => category.value.length !== 0,
  );
  return (
    <>
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        sx={{ mr: 8 }}
      >
        <Alert onClose={handleCloseAlert} severity="warning">
          {keywordWarning("warning_advanced_tools")}
        </Alert>
      </Snackbar>
      <Card>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor={"primary"}
          variant="scrollable"
          scrollButtons="auto"
        >
          {categoriesAllowedForUser.map((category, index) => {
            //  if(category.value.length !==0){
            return (
              <Tab
                key={index}
                icon={category.icon}
                iconPosition="start"
                label={
                  <Typography
                    variant="h6"
                    style={{
                      textTransform: "capitalize",
                    }}
                  >
                    {category.name}
                  </Typography>
                }
              />
            );
            // }
          })}
        </Tabs>

        <Box m={1} />

        <div style={{ minHeight: "340px" }}>
          {categoriesAllowedForUser.map((category, index) => {
            const tools = category.value;
            //if(tools.length !==0){

            return (
              <TabPanel value={value} index={index} key={index}>
                <Grid
                  container
                  justifyContent="flex-start"
                  spacing={2}
                  className={classes.toolCardsContainer}
                >
                  {tools.map((tool, key) => {
                    const element = (
                      <Grid
                        className={classes.toolCardStyle}
                        item
                        key={key}
                        onClick={() => handleClick(tool.path, tool.rolesNeeded)}
                      >
                        <ToolsMenuItem tool={tool} />
                      </Grid>
                    );
                    if (
                      tool.rolesNeeded &&
                      tool.rolesNeeded.includes(ROLES.BETA_TESTER)
                    ) {
                      if (betaTester) {
                        return element;
                      } else {
                        return null;
                      }
                    } else {
                      return element;
                    }
                  })}
                </Grid>
              </TabPanel>
            );
          })}
        </div>
      </Card>

      <Box m={3} />

      <Box m={4} />

      <Dialog
        height={"400px"}
        fullWidth
        maxWidth={"md"}
        open={videoUrl !== null}
        onClose={() => setVideoUrl(null)}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogContent>
          <Iframe
            frameBorder="0"
            url={videoUrl}
            allow="fullscreen"
            height="400"
            width="100%"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVideoUrl(null)} color="primary">
            {keyword("close")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default ToolsMenu;
