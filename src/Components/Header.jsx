import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box mb="30px">
      <Typography
        variant="h1"
        color={colors.pink[100]}
        fontWeight="bold"
        sx={{ mb: "5px", textAlign:"center", fontSize:"50px"}}
      >
        {title}
      </Typography>
      <Typography variant="h5" color={colors.white[200]} fontStyle="italic" sx={{textAlign:"center"}}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;

//THIS PROJECT WAS MADE BY PROMETHEUS
