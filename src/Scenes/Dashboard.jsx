import React, { useRef, useState } from 'react'
import Header from '../Components/Header'
import { Box, Dialog, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import { equalTo, get, getDatabase, onValue, orderByChild, query, ref, update } from "firebase/database"
import Clock from "../Components/Clock"
import { Form, Formik } from 'formik'
import { toast } from 'react-toastify'
import axios from 'axios'
import Loading from '@mui/material/CircularProgress'
import { blue } from '@mui/material/colors'



const Dashboard = () => {

  const db = getDatabase();
  const currentDate = new Date().toDateString();
  const formikRef = useRef(null)
  const initial = {
    idNumber: ""
  }

  const [currentSub, setSub] = useState('')

  const [showLoad, setShow] = useState(false)
  const [showTeacherInput, setTeacherInput] = useState(true)

  const handleClose = () => {
    setTeacherInput(false)
  }

  // Check teacher
  const checkTeacher = (value) => {
    let userName = ''
    setShow(true)
    const getTeacherName = ref(db, "System Users");
    onValue(getTeacherName, (snapshot) => {
      snapshot.forEach((laman) => {
        userName = (laman.child(value.teacherID).child('userName').val())
      })
      if (userName !== null) {
        onValue(query(ref(db, "Subject Schedules/"), orderByChild('teacherAssigned'), equalTo(userName)), (snappy) => {
          if (snappy.exists && snappy.val() !== null) {
            snappy.forEach((laman) => {
              setSub(laman.child('subject').val())
              toast.success("Subject set - now accepting attendance")
              setShow(false)
              setTeacherInput(false)
            })
          }
          else {
            toast.error("No subject is assigned to current user. Contact the administrator")
          }
        })
      }
      else {
        toast.error("User is not found. Contact the administrator")
      }
    })

  }


  // In and out
  const inAndOut = async (value, { resetForm }) => {
    setShow(true);
    try {
      // Fetch student information from the Grand List
      const getStudent = ref(db, "Grand List/" + value.idNumber);
      const snapshot = await get(getStudent);
      const studentData = snapshot.val();

      if (snapshot.exists()) {
        try {
          // Check if the student is timed in or timed out
          const status = studentData.status === "timedIn" ? "timedOut" : "timedIn";

          // Update Grand Attendance and Grand List
          await update(ref(db, `Grand Attendance/${currentDate}/${studentData.grade_level}/${currentSub}/${studentData.id_num}`), {
            ...studentData,
            status,
            [status === "timedIn" ? "timeIn" : "timeOut"]: new Date().toLocaleTimeString(),
            subject: currentSub
          });
          await update(ref(db, `Grand List/${studentData.id_num}`), { ...studentData, status, subject: currentSub });

          const message = `Hello! Student ${studentData.student_name} has successfully ${status === "timedIn" ? "timed in" : "timed out"
            } at ${new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}.`;

          const phoneNum = studentData.caretaker_num;
          // For sending message
          const padala = await axios.post("https://attendance-monitoring-back-end.onrender.com/send-sms", { message, phoneNum });
          toast.info(padala.data.message)

          // For the AI to speak
          if ('speechSynthesis' in window) {
            const speak = new SpeechSynthesisUtterance(message);
            window.speechSynthesis.speak(speak);
            speak.rate = 0.7;
          } else {
            console.log("Speech isn't supported here");
          }

          toast.success(`You have successfully ${status === "timedIn" ? "timed in" : "timed out"}`);
        } catch (error) {
          toast.error(`Something went wrong. Try again later. Error: ${error.message}`);
        }
      } else {
        toast.error("Your information wasn't found. Contact administrator");
      }
    } catch (error) {
      console.error("Student information cannot be fetched. Contact administrator", error);
    }

    setTimeout(() => {
      resetForm()
    }, 3500);
    setShow(false)
  };

  return (
    <Box m="20px">

      {/* Loading element */}
      {showLoad !== false && (
        <Box
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
          }}
        >
          <Loading sx={{ color: blue[500] }} size="80px" />
        </Box>
      )}

      {showTeacherInput !== false && (
        <Dialog
          open={showTeacherInput}
          onClose={handleClose}
        >
          <Formik initialValues={{ teacherID: '' }} onSubmit={checkTeacher}>
            {({ handleChange }) => (
              <Form>
                <DialogTitle>Scan Teacher's RFID</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Tap you RFID card here teacher, so I can determine which subject that the students attends
                  </DialogContentText>
                  <TextField
                    variant='filled'
                    fullWidth
                    id='teacherID'
                    label="Scan your ID please"
                    name='teacherID'
                    type='text'
                    required
                    color='secondary'
                    autoFocus={showTeacherInput}
                    onChange={handleChange}
                  />
                </DialogContent>
              </Form>
            )}
          </Formik>
        </Dialog>
      )}
      <Header title="ATTEDANCE MONITORING SYSTEM" subtitle={`Subject in attendance is ${currentSub}`} />
      <Box display="flex" justifyContent="space-evenly" alignItems="center" >

        <Clock datediff={0} />

        <Formik
          innerRef={formikRef}
          initialValues={initial}
          onSubmit={inAndOut}
        >
          {({ values, errors, touched, handleBlur, handleChange }) => (
            <Form>
              <TextField
                variant='filled'
                fullWidth
                type='text'
                onBlur={handleBlur}
                onChange={handleChange}
                label="TAP YOUR ID!"
                name='idNumber'
                value={values.idNumber}
                error={!!touched.idNumber && !!errors.idNumber}
                helperText={touched.idNumber && errors.idNumber}
                sx={{ width: "250%", justifyContent: "space-between" }}
              />
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  )
}

export default Dashboard