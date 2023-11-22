import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import { Box, Typography, useTheme } from '@mui/material'
import { tokens } from '../theme'
import {getDatabase, onValue, ref} from "firebase/database"


const Dashboard = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode);
  const db = getDatabase();

  return (
    <Box m="20px">
         <Header title="ATTEDANCE MONITORING SYSTEM" subtitle="Designed for student-based attendance"/>
       <Box display="flex" justifyContent="space-evenly">
          <Typography
            variant="h2"
            color={colors.goldish[100]}
            fontWeight="bold"
            sx={{m: "5px 0 0 0"}}>
              Grade Level Chart
            </Typography>

       </Box>
   
    </Box>
  )
}

export default Dashboard