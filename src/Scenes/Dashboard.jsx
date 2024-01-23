import React, { useRef, useState} from 'react'
import Header from '../Components/Header'
import { Box, TextField } from '@mui/material'
import { get, getDatabase, ref, update} from "firebase/database"
import Clock from "../Components/Clock"
import { Form, Formik } from 'formik'
import { toast } from 'react-toastify'



const Dashboard = () => {

  const db = getDatabase();
  const currentDate = new Date().toDateString();
  const formikRef = useRef(null)
  const initial = {
    idNumber: ""
  }


  const inAndOut = (value) => {
    try {
      // Fetch student information from the Grand List
      const getStudent = ref(db, "Grand List/" + value.idNumber);
      get(getStudent).then((snapshot) => {
        const studentData = snapshot.val();
  
        if (snapshot.exists()) {
          try {
            // Check if the student is timed in or timed out
            const status = studentData.status === "timedIn" ? "timedOut" : "timedIn";
  
            //Update Grand Attendance and Grand List
            update(ref(db, `Grand Attendance/${currentDate}/${studentData.grade_level}/${studentData.id_num}`), {
              status,
              [status === "timedIn" ? "timeIn" : "timeOut"]: new Date().toLocaleTimeString(),
            });
            update(ref(db, `Grand List/${studentData.id_num}`), { status });
  
            const message = `Hello! Student ${studentData.student_name} has successfully ${
              status === "timedIn" ? "timed in" : "timed out"
            } at ${new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}.`;
          
      
            if('speechSynthesis' in window) {
              const speak = new SpeechSynthesisUtterance(message)
              window.speechSynthesis.speak(speak);
              speak.rate = 0.7
            }
            else {
              console.log("Speech isn't supported here")
            }

            toast.success(`You have successfully ${status === "timedIn" ? "timed in" : "timed out"}`);
          } catch (error) {
            toast.error(`Something went wrong. Try again later. Error: ${error.message}`);
          }
        } else {
          toast.error("Your information wasn't found. Contact administrator");
        }
      });
    } catch (error) {
      console.error("Student information cannot be fetched. Contact administrator", error);
    }

    setTimeout(()=>{
      window.location.reload()
    }, 3500)
  };
  

  

  return (
    <Box m="20px">
         <Header title="ATTEDANCE MONITORING SYSTEM" subtitle="Designed for student-based attendance"/>
       <Box display="flex" justifyContent="space-evenly" alignItems="center" >
  
         <Clock datediff={0}/> 

      
        <Formik
          innerRef={formikRef}
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