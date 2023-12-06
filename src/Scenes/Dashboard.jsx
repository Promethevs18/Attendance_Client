import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import { Box, Typography, useTheme } from '@mui/material'
import { tokens } from '../theme'
import {getDatabase, onValue, ref} from "firebase/database"
import Clock from "../Components/Clock"

const Dashboard = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode);
  const db = getDatabase();

  return (
    <Box m="20px">
         <Header title="ATTEDANCE MONITORING SYSTEM" subtitle="Designed for student-based attendance"/>
       <Box display="flex" justifyContent="space-around">
        <Clock datediff={0}/>
        Hello World
       </Box>
   
    </Box>
  )
}

export default Dashboard