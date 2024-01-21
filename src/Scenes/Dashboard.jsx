import React, { useEffect, useRef, useState } from 'react'
import Header from '../Components/Header'
import { Box, TextField, Typography, useTheme } from '@mui/material'
import { tokens } from '../theme'
import {getDatabase, onValue, ref} from "firebase/database"
import Clock from "../Components/Clock"
import { Form, Formik } from 'formik'
import { toast } from 'react-toastify'

const Dashboard = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode);
  const db = getDatabase();

  const formikRef = useRef(null)
  const initial = {
    idNumber: ""
  }

  const inAndOut = () => {
    toast.success("Nice one, boi")
  }

  return (
    <Box m="20px">
         <Header title="ATTEDANCE MONITORING SYSTEM" subtitle="Designed for student-based attendance"/>
       <Box display="flex" justifyContent="space-evenly" alignItems="center" >
  
         <Clock datediff={0}/> 

        <Formik
          ref={formikRef}
          initialValues={initial}
          onSubmit={inAndOut}>
            {({errors, touched, handleBlur, handleChange}) => (
              <Form>
                  <TextField
                    variant='filled'
                    fullWidth
                    type='text'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="TAP YOUR ID!"
                    name='idNumber'
                    error={!!touched.idNumber && !!errors.idNumber}
                    helperText={touched.idNumber && errors.idNumber}
                    sx={{width: "250%", justifyContent: "space-between"}}
                  />
              </Form>
            )}
        </Formik>
       </Box>
    </Box>
  )
}

export default Dashboard