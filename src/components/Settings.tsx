import React, { useState, forwardRef, useEffect } from "react";
import { map, filter, toUpper, isEmpty, forEach } from "lodash";
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Button,
  TextField,
  Chip,
  Input,
  Stack,
  Alert,
  Collapse,
} from "@mui/material";
import CloseIcon from "../assets/icons/close";
import { TransitionProps } from "@mui/material/transitions";
import TeamMember from "./TeamMember";
import { ISettings } from "../interfaces";

// ----------------------------------------------------------------------

interface Member {
  name: string;
  workHours: string;
  vacationHours: string;
}

interface Props {
  isSettingsOpen: boolean;
  onCloseSettings: () => void;
  settings: any;
  setSettings: any;
}

function isSettingsValid(data: ISettings) {
  let valid = true;

  if (!data.totalDays || !data.buffer) {
    valid = false;
  }

  if (!data.teams.length) {
    valid = false;
  }

  forEach(data.members, (members, team) => {
    if (!data.teams.includes(team)) {
      valid = false;
    }

    if (!members.length) {
      valid = false;
    }

    forEach(members, (member) => {
      if (!member.name || !member.workHours || !member.vacationHours) {
        valid = false;
      }
    });
  });

  return valid;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Settings(props: Props) {
  const { isSettingsOpen, onCloseSettings, settings, setSettings } = props;
  const [inputSettings, setInputSettings] = useState<ISettings>(
    {} as ISettings
  );
  const [teamName, setTeamName] = useState<string>("");
  const [teamMemberName, setTeamMemberName] = useState<Record<string, string>>(
    {}
  );
  const [isFileImportError, setIsFileImportError] = useState<boolean>(false);

  function updateTeamMember(team: string, member: Member) {
    setSettings({
      ...settings,
      members: {
        ...settings.members,
        [team]: map(settings.members[team], (_member) => {
          if (_member.name === member.name) {
            _member = { ...member };
          }
          return _member;
        }),
      },
    });
  }

  function addTeamMember(team: string, memberName: string) {
    if (!memberName) return;
    console.log("[addTeamMember] teamMembers ", team, memberName);
    const members = settings.members;
    const [foundTeamMember] = filter(
      members[team],
      (_member) => _member.name === memberName
    );
    if (!foundTeamMember) {
      setSettings({
        ...settings,
        members: {
          ...members,
          [team]: [
            ...members[team],
            { name: memberName, workHours: "7", vacationHours: "0" },
          ],
        },
      });

      setTeamMemberName({
        ...teamMemberName,
        [team]: "",
      });
    }
  }

  function removeTeamMember(team: string, member: Member) {
    const members = settings.members;
    setSettings({
      ...settings,
      members: {
        ...members,
        [team]: filter(
          members[team],
          (_member) => _member.name !== member.name
        ),
      },
    });
  }

  function addTeam(name: string) {
    if (!teamName.length) return;
    const [foundTeam] = filter(settings.teams, (_name) => _name === name);
    console.log("[addTeam] foundTeam ", foundTeam);
    if (!foundTeam) {
      const newTeams = [...settings.teams, name];
      setSettings({
        ...settings,
        teams: newTeams,
        ...(!settings.members[name] && {
          members: {
            ...settings.members,
            [name]: [],
          },
        }),
      });
      setTeamName("");
      setTeamMemberName({
        ...teamMemberName,
        [name]: "",
      });
    }
  }

  function removeTeam(name: string) {
    const newTeams = filter(settings.teams, (_name) => _name !== name);
    const updatedMembers = { ...settings.members };
    delete updatedMembers[name];

    setSettings({
      ...settings,
      teams: newTeams,
      members: {
        ...updatedMembers,
      },
    });
  }

  function onSelectFile(e: Event) {
    try {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        const fileReader = new FileReader();
        fileReader.readAsText(file, "UTF-8");
        fileReader.addEventListener("load", (e) => {
          const rawResult = (e?.target?.result as string) ?? ("{}" as string);
          const parsedSettings = JSON.parse(rawResult);

          if (isSettingsValid(parsedSettings)) {
            console.log("parsedSettings valid >>> ", parsedSettings);
            setInputSettings(parsedSettings);
            setIsFileImportError(false);
          } else {
            setIsFileImportError(true);
          }
        });
      }
    } catch (error) {
      setIsFileImportError(true);
    }
  }

  async function handleDownloadSettings() {
    try {
      const filename = "gitple-butler-settings";
      const json = JSON.stringify(settings);
      const blob = new Blob([json], { type: "application/JSON" });
      const href = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      link.download = filename + ".json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log("error downloading file");
    }
  }

  useEffect(() => {
    if (!isEmpty(inputSettings)) {
      setSettings(inputSettings);
    }
  }, [inputSettings]);

  return (
    <Dialog
      fullWidth
      fullScreen
      open={isSettingsOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={onCloseSettings}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
        <Typography sx={{ fontWeight: "bold" }}>Settings</Typography>
        <IconButton onClick={onCloseSettings} sx={{ ml: "auto" }}>
          <CloseIcon sx={{ display: "flex", alignItems: "center" }} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ my: 2 }}>
          <label htmlFor="gitple-butler-config">
            <Input
              sx={{ display: "none" }}
              // @ts-ignore
              onInput={onSelectFile}
              accept="application/JSON"
              id="gitple-butler-config"
              type="file"
            />
            <Button size="small" variant="contained">
              Import Settings
            </Button>
          </label>
          <Button
            size="small"
            sx={{ ml: 2 }}
            variant="contained"
            color="secondary"
            onClick={handleDownloadSettings}
          >
            Export Settings
          </Button>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Collapse in={isFileImportError}>
            <Alert
              severity="error"
              action={
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setIsFileImportError(false);
                  }}
                >
                  <CloseIcon sx={{ display: "flex", alignItems: "center" }} />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              Error importing Settings
            </Alert>
          </Collapse>
        </Box>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ mb: 2 }}>
            <TextField
              type="number"
              size="small"
              variant="standard"
              label="Total Days"
              value={settings.totalDays}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  totalDays: e.target.value as string,
                })
              }
              placeholder="Total Days"
            />
          </Box>
          <Box sx={{ mb: 2, mx: 2 }}>
            <TextField
              type="number"
              size="small"
              variant="standard"
              label="Buffer"
              value={settings.buffer}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  buffer: e.target.value as string,
                })
              }
              placeholder="Buffer"
            />
          </Box>
          <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
            <TextField
              label="Add New Team"
              variant="standard"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              size="small"
              placeholder="New Team Name"
            />
            <Button
              onClick={() => addTeam(teamName)}
              sx={{ ml: 2 }}
              size="small"
              variant="outlined"
            >
              Add
            </Button>
          </Box>
        </Box>
        <Stack direction="row" spacing={1}>
          {map(settings.teams, (teamName) => (
            <Chip
              sx={{ p: 1 }}
              variant="outlined"
              color="primary"
              key={teamName}
              label={toUpper(teamName)}
              onDelete={() => removeTeam(teamName)}
            />
          ))}
        </Stack>
        <Box>
          {map(settings.members, (member, team) => (
            <Box
              key={team}
              sx={{
                p: 1,
                border: "1px solid #ddd",
                my: 2,
                borderRadius: 1.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ fontWeight: "bold", pr: 5 }}>
                  Team: {toUpper(team)}
                </Typography>
                <TextField
                  variant="standard"
                  value={teamMemberName[team] ?? ""}
                  onChange={(e) =>
                    setTeamMemberName({
                      ...teamMemberName,
                      [team]: e.target.value,
                    })
                  }
                  size="small"
                  placeholder={`New Team Member`}
                />
                <Button
                  onClick={() => addTeamMember(team, teamMemberName[team])}
                  sx={{ ml: 2 }}
                  variant="outlined"
                  size="small"
                >
                  Add
                </Button>
              </Box>
              <Stack
                direction="row"
                spacing={1}
                sx={{ overflowX: "auto", py: 1 }}
              >
                {map(settings.members[team], (member) => (
                  <TeamMember
                    key={member.name}
                    team={team}
                    member={member}
                    onDelete={removeTeamMember}
                    onUpdate={updateTeamMember}
                  />
                ))}
              </Stack>
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" fullWidth onClick={onCloseSettings}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
