import React, { useEffect, useState, useCallback, Fragment } from "react";
import { isEmpty, forEach, map, toUpper, reduce, toNumber } from "lodash";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Divider,
  Chip,
} from "@mui/material";
import SettingsIcon from "./assets/icons/cogs";
import Settings from "./components/Settings";
import useLocalStorage from "./hooks/useLocalStorage";
import { createActualEstimation } from "./util";
import {
  Member,
  ISettings,
  DOMMessage,
  DOMMessageResponse,
} from "./interfaces";
import { LOCAL_STORAGE_NAME } from "./consts";

// ----------------------------------------------------------------------

const hrs = {
  requiredHours: "Required",
  optionalHours: "Optional",
};

type ActualEstimation = Record<
  "requiredHours" | "optionalHours",
  Array<{ team: string; total: number }>
>;

type TeamMembers = Record<string, Member[]>;

function sumTeamHours(data: TeamMembers) {
  const result = {} as Record<string, number>;
  try {
    forEach(data, (members, team) => {
      result[team] = reduce(
        members,
        (acc, member) => acc + toNumber(member.workHours),
        0
      );
    });
    return result;
  } catch (error) {
    return {};
  }
}

function getVacationHours(data: TeamMembers) {
  const result = [] as { name: string; vacationHours: number }[];
  forEach(data, (members) => {
    forEach(members, (member) => {
      if (toNumber(member.vacationHours) > 0) {
        result.push({
          name: member.name,
          vacationHours: toNumber(member.vacationHours),
        });
      }
    });
  });
  return result;
}

const initialSettings: ISettings = {
  totalDays: "0",
  buffer: "0",
  teams: [] as Array<string>,
  members: {} as Record<string, Member[]>,
};

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [actualEstimation, setActualEstimation] = useState<ActualEstimation>(
    {} as ActualEstimation
  );
  const [settings, setSettings] = useLocalStorage(
    LOCAL_STORAGE_NAME,
    initialSettings
  );

  console.log("settings ", settings);

  const openSettingsDialog = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);

  const closeSettingsDialog = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  useEffect(() => {
    chrome.tabs &&
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        (tabs) => {
          chrome.tabs.sendMessage(
            tabs[0].id || 0,
            { type: "GET_DOM" } as DOMMessage,
            (response: DOMMessageResponse) => {
              console.log("response from chrome tabs >>> ", response);
              const estimationResult = createActualEstimation(
                response.cards,
                settings.teams
              );
              if (!isEmpty(estimationResult)) {
                setActualEstimation(estimationResult);
                console.log("[estimationResult] result ", estimationResult);
              }
            }
          );
        }
      );
  }, [settings]);

  const totalVacationHrs = reduce(
    getVacationHours(settings.members),
    (acc, member) => acc + member.vacationHours,
    0
  );

  return (
    <Box sx={{ backgroundColor: "#f6f6f6", m: 0, height: "100%" }}>
      <Box sx={{ p: 1, display: "flex", alignItems: "center" }}>
        <IconButton>
          <Avatar src="/gitple-logo.png" />
        </IconButton>
        <Typography variant="h6" sx={{ ml: 2 }}>
          Gitple Planning Butler
        </Typography>
        <IconButton onClick={openSettingsDialog} sx={{ ml: "auto" }}>
          <SettingsIcon sx={{ display: "flex", alignItems: "center" }} />
        </IconButton>
      </Box>
      <Box sx={{ px: 2 }}>
        <Divider sx={{ my: 1 }} />
      </Box>
      <Box sx={{ px: 2, pt: 0, my: 2, mb: 0 }}>
        <Box>
          <Box
            sx={{
              display: "flex",
              mb: 1,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Typography variant="body2" sx={{ mr: 1, fontWeight: "bold" }}>
              Total Days:
            </Typography>
            <Chip
              size="small"
              label={`${settings.totalDays}d`}
              color="primary"
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              mb: 1,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Typography variant="body2" sx={{ mr: 1, fontWeight: "bold" }}>
              Buffer:
            </Typography>
            <Chip size="small" label={`${settings.buffer}d`} color="default" />
          </Box>
          <Box
            sx={{
              display: "flex",
              mb: 1,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Typography variant="body2" sx={{ mr: 1, fontWeight: "bold" }}>
              Total Per Team:{" "}
            </Typography>
            {map(sumTeamHours(settings.members), (hours, team) => (
              <Chip
                sx={{ mr: 1 }}
                key={team}
                size="small"
                label={`${toUpper(team)}: ${hours}d`}
                color="primary"
              />
            ))}
          </Box>
          <Box
            sx={{
              display: "flex",
              mb: 1,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Typography variant="body2" sx={{ mr: 1, fontWeight: "bold" }}>
              Vacation:
            </Typography>
            {map(getVacationHours(settings.members), (member) => (
              <Chip
                sx={{ mr: 1 }}
                key={member.name}
                size="small"
                label={`${member.name}: ${member.vacationHours}`}
                color="warning"
              />
            ))}
          </Box>
          <Box
            sx={{
              display: "flex",
              mb: 1,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Typography variant="body2" sx={{ mr: 1, fontWeight: "bold" }}>
              Total Planned:{" "}
            </Typography>
            {map(
              map(sumTeamHours(settings.members), (hours, team) => ({
                team,
                hours,
              })),
              (item, index, arr) => (
                <Fragment key={index}>
                  <Chip
                    sx={{ mr: 1 }}
                    size="small"
                    label={`${toUpper(item.team)}: ${item.hours}`}
                    color="primary"
                  />
                  {arr.length > index + 1 && (
                    <Typography sx={{ ml: -1, px: 0.5 }}> + </Typography>
                  )}
                </Fragment>
              )
            )}

            <Typography sx={{ ml: -1, px: 1 }}> = </Typography>
            {/* result */}
            <Chip
              sx={{ mr: 1 }}
              size="small"
              label={`${
                reduce(
                  Object.values(sumTeamHours(settings.members)),
                  (acc, v) => acc + v,
                  0
                ) - totalVacationHrs
              }d`}
              color="secondary"
            />
          </Box>
        </Box>
        <Divider sx={{ my: 1 }} />
      </Box>
      <Box sx={{ px: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
          Actual Estimation
        </Typography>
        {map(actualEstimation, (_teams, key) => (
          <Box
            sx={{
              display: "flex",
              mb: 1,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="body2"
              sx={{ mr: 1, fontWeight: "bold" }}
              key={key}
            >
              {/* @ts-ignore */}
              {hrs[key]}:
            </Typography>
            {map(_teams, (_team, index, arr) => (
              <Fragment key={_team.team}>
                <Chip
                  sx={{ mr: 1 }}
                  size="small"
                  color={
                    // @ts-ignore
                    toUpper(hrs[key]) === "OPTIONAL" ? "default" : "primary"
                  }
                  label={`${toUpper(_team.team)}: ${_team.total}`}
                />
                {arr.length > index + 1 && (
                  <Typography sx={{ ml: -1, px: 0.5 }}> + </Typography>
                )}
              </Fragment>
            ))}
            <Typography sx={{ ml: -1, px: 1 }}> = </Typography>
            <Chip
              sx={{ mr: 1 }}
              size="small"
              label={`${reduce(_teams, (acc, _team) => acc + _team.total, 0)}d`}
              color={
                // @ts-ignore
                toUpper(hrs[key]) === "OPTIONAL" ? "default" : "primary"
              }
            />
          </Box>
        ))}
      </Box>
      {/* Dialog */}
      <Settings
        isSettingsOpen={isSettingsOpen}
        onCloseSettings={closeSettingsDialog}
        settings={settings}
        setSettings={setSettings}
      />
    </Box>
  );
}

export default App;
