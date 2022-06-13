import { Box, BoxProps } from "@mui/material";
// ----------------------------------------------------------------------

interface Props extends BoxProps {
  width?: number;
  height?: number;
}

export default function SettingsIcon({
  width = 24,
  height = 24,
  ...other
}: Props) {
  //   const theme = useTheme();
  return (
    <Box {...other}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="16"
          cy="6"
          r="2"
          stroke="#33374D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="8"
          cy="12"
          r="2"
          stroke="#33374D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="16"
          cy="18"
          r="2"
          stroke="#33374D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 6H14"
          stroke="#33374D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 12H20"
          stroke="#33374D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 12H6"
          stroke="#33374D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18 6H20"
          stroke="#33374D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18 18H20"
          stroke="#33374D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 18H14"
          stroke="#33374D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Box>
  );
}
