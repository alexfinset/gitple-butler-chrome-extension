import { Box, BoxProps } from "@mui/material";

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  width?: number;
  height?: number;
}

export default function CloseIcon({
  width = 14,
  height = 14,
  ...other
}: Props) {
  return (
    <Box {...other}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 1L13 13"
          stroke="#33374D"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M1 13L13 1"
          stroke="#33374D"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </Box>
  );
}
