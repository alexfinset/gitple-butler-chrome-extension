import React, { useState } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  IconButton,
  FormControl,
  MenuItem,
  InputLabel,
} from "@mui/material";
import CloseIcon from "../assets/icons/close";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import map from "lodash/map";

// ----------------------------------------------------------------------

interface IOptions {
  label: string;
  value: string;
}

const hours: IOptions[] = [
  { label: "0d", value: "0" },
  { label: "1d", value: "1" },
  { label: "2d", value: "2" },
  { label: "3d", value: "3" },
  { label: "4d", value: "4" },
  { label: "5d", value: "5" },
  { label: "6d", value: "6" },
  { label: "7d", value: "7" },
  { label: "8d", value: "8" },
  { label: "9d", value: "9" },
  { label: "10d", value: "10" },
];

interface IMember {
  name: string;
  workHours: string;
  vacationHours: string;
}

interface Props {
  team: string;
  member: IMember;
  onDelete: (team: string, member: IMember) => void;
  onUpdate: (team: string, member: IMember) => void;
}

export default function TeamMember(props: Props) {
  const { member, team, onDelete, onUpdate } = props;
  // console.log("TeamMember props", props);
  const [workHours, setWorkHours] = useState<string>(member.workHours);
  const [vacationHours, setVacationHours] = useState<string>(
    member.vacationHours
  );

  return (
    <Card sx={{ minWidth: 140, bgcolor: "whitesmoke" }}>
      <CardContent sx={{ p: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {member.name}
          </Typography>
          <IconButton
            size="small"
            onClick={() => onDelete(team, member)}
            sx={{ ml: "auto" }}
          >
            <CloseIcon
              width={12}
              height={12}
              sx={{ display: "flex", alignItems: "center" }}
            />
          </IconButton>
        </Box>
        <Box sx={{ mt: 1 }}>
          <FormControl size="small" variant="standard" sx={{ mb: 1 }} fullWidth>
            <InputLabel size="small">Work Hours</InputLabel>
            <Select
              size="small"
              value={workHours}
              label={`${workHours}d`}
              onChange={(event: SelectChangeEvent) => {
                setWorkHours(event.target.value as string);
              }}
            >
              {map(hours, (hour) => (
                <MenuItem key={hour.label} value={hour.value}>
                  {hour.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" variant="standard" sx={{ mb: 1 }} fullWidth>
            <InputLabel size="small">Vacation</InputLabel>
            <Select
              size="small"
              value={vacationHours}
              label={`${vacationHours}d`}
              onChange={(event: SelectChangeEvent) => {
                setVacationHours(event.target.value as string);
                console.log("VACATION HOURS onChange ", event.target.value);
              }}
            >
              {map(hours, (hour) => (
                <MenuItem key={hour.label} value={hour.value}>
                  {hour.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </CardContent>
      <CardActions>
        <Button
          disabled={
            member.vacationHours === vacationHours &&
            member.workHours === workHours
          }
          fullWidth
          variant="outlined"
          onClick={() => {
            onUpdate(team, {
              ...member,
              workHours,
              vacationHours,
            });
          }}
          size="small"
        >
          Save
        </Button>
      </CardActions>
    </Card>
  );
}
