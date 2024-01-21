import React, { useRef } from 'react'
import Header from '../Components/Header'
import { Box, TextField, useTheme } from '@mui/material'
import { tokens } from '../theme'
import {getDatabase} from "firebase/database"
import Clock from "../Components/Clock"
import { Form, Formik } from 'formik'
import { toast } from 'react-toastify'

const Dashboard = () => {
  const theme = useTheme()
  const db = getDatabase();


  const formikRef = useRef(null)
  const initial = {
    idNumber: ""
  }

  const inAndOut = (value) => {
    
    toast.success(value.idNumber)
    toast.info(new Date().toLocaleTimeString())
    setTimeout(() => {
      window.location.reload()
    }, 3000)
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
                    autoFocus
                  />
              </Form>
            )}
        </Formik>
       </Box>
    </Box>
  )
}

export default Dashboard