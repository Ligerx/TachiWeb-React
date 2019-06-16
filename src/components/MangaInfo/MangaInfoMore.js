// @flow
import * as React from "react";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import type { MangaFlags } from "@tachiweb/api-client";
import Tooltip from "@material-ui/core/Tooltip";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import RadioOptionsDialogue from "components/MangaInfo/RadioOptionsDialogue";

const displayModes = [
  { flagState: "NAME", label: "Show title" },
  { flagState: "NUMBER", label: "Show chapter number" }
];

const sortingModes = [
  { flagState: "SOURCE", label: "By source" },
  { flagState: "NUMBER", label: "By chapter number" }
];

type Props = {
  sourceUrl: ?string,
  flags: MangaFlags,
  onDisplayModeChange: Function,
  onSortTypeChange: Function
};

type State = {
  anchorEl: ?React.Node,
  displayModeOpen: boolean,
  sortTypeOpen: boolean
};

class MangaInfoMore extends React.Component<Props, State> {
  state = {
    anchorEl: null,
    displayModeOpen: false,
    sortTypeOpen: false
  };

  handleClick = (event: SyntheticEvent<>) => {
    // $FlowFixMe - ignore flow warning below
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleDisplayModeClick = () => {
    this.setState({ displayModeOpen: true });
    this.handleClose();
  };

  handleDisplayModeClose = (value: ?string) => {
    this.setState({ displayModeOpen: false });
    if (value) {
      const { onDisplayModeChange } = this.props;
      onDisplayModeChange(value);
    }
  };

  handleSortTypeClick = () => {
    this.setState({ sortTypeOpen: true });
    this.handleClose();
  };

  handleSortTypeClose = (value: ?string) => {
    this.setState({ sortTypeOpen: false });
    if (value) {
      const { onSortTypeChange } = this.props;
      onSortTypeChange(value);
    }
  };

  render() {
    const { anchorEl, displayModeOpen, sortTypeOpen } = this.state;
    const {
      sourceUrl,
      flags: { displayMode, sortType }
    } = this.props;

    return (
      <>
        <Tooltip title="More options">
          <IconButton onClick={this.handleClick}>
            <Icon>more_vert</Icon>
          </IconButton>
        </Tooltip>

        {/* getContentAnchorEl must be null to make anchorOrigin work */}
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          getContentAnchorEl={null}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.handleDisplayModeClick}>
            Change Display Mode
          </MenuItem>
          <MenuItem onClick={this.handleSortTypeClick}>Sorting Mode</MenuItem>
          {/* <MenuItem>Download</MenuItem> */}

          {sourceUrl != null ? (
            <MenuItem component="a" href={sourceUrl} target="_blank">
              <ListItemIcon>
                <Icon>open_in_new</Icon>
              </ListItemIcon>
              <ListItemText primary="Open source website" />
            </MenuItem>
          ) : null}
        </Menu>

        <RadioOptionsDialogue
          title="Choose Display Mode"
          open={displayModeOpen}
          value={displayMode}
          options={displayModes}
          onClose={this.handleDisplayModeClose}
        />

        <RadioOptionsDialogue
          title="Sorting Mode"
          open={sortTypeOpen}
          value={sortType}
          options={sortingModes}
          onClose={this.handleSortTypeClose}
        />
      </>
    );
  }
}

export default MangaInfoMore;
