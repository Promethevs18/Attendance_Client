import React, { useEffect, useRef, useState } from 'react'
import Header from '../Components/Header'
import { Box, Dialog, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from '@mui/material'
import { equalTo, get, getDatabase, onValue, orderByChild, query, ref, update } from "firebase/database"
import Clock from "../Components/Clock"
import { Form, Formik } from 'formik'
import { toast } from 'react-toastify'
import axios from 'axios'
import Loading from '@mui/material/CircularProgress'
import { blue } from '@mui/material/colors'
import { PieChart } from '@mui/x-charts'



const Dashboard = () => {

  const db = getDatabase();
  const currentDate = new Date().toDateString();
  const formikRef = useRef(null)
  const initial = {
    idNumber: ""
  }

  const [totalStudents, setTotalStudents] = useState(0);
  const [totalAbsent, setTotalAbsent] = useState(0)

  const [currentSub, setSub] = useState('')

  const [showLoad, setShow] = useState(false)
  const [showTeacherInput, setTeacherInput] = useState(true)

  useEffect(() => {
    const getData = async () => {
      const attendanceRef = ref(db, "Grand Attendance");
      onValue(attendanceRef, (snapshot) => {
        calculateAttendance(snapshot.val());
      });

      const absentRef = ref(db, "Grand List");
      onValue(absentRef, (snapshot) => {
        calculateAbsents(snapshot.val());
      });
    };


    const calculateAttendance = (data) => {
      let totalStudents = 0;
      const currentDate = new Date().toDateString();

      try{
        if (data[currentDate]) {
          for (const level in data[currentDate]) {
            for (const subject in data[currentDate][level]) {
              if (currentSub === Object.keys(data[currentDate][level]).toString()) {
                totalStudents += 1; // Increment students count
              }
            }
          }
        }
      }
      catch (error){
        console.log('error')
      }
      
      setTotalStudents(totalStudents)
    };

    const calculateAbsents = (data) => {
      
      let totalAbsent = 0;
      Object.values(data).forEach((item) => {
        if (item.admission === 'Absent') {
          totalAbsent += 1; // Increment absent count
        }
      });
      setTotalAbsent(totalAbsent)
    };

    getData();
  }, [currentSub]);
  


  const handleClose = () => {
    setTeacherInput(false)
  }

  // Check teacher
  const checkTeacher = async (value) => {
    setShow(true);
    const getTeacherName = ref(db, "System Users");
    try {
      const snapshot = await get(getTeacherName);
      let userName = null;

      // Convert snapshot to array
      const teacherArray = [];
      snapshot.forEach(childSnapshot => {
        teacherArray.push(childSnapshot);
      });

      for (let i = 0; i < teacherArray.length; i++) {
        const teacherSnapshot = teacherArray[i];
        const userSnapshot = teacherSnapshot.child(value.teacherID);
        const user = userSnapshot.child('userName').val();

        if (user !== null) {
          userName = user;
          break; // Exit loop if user is found
        }
      }

      if (userName !== null) {
        const snappy = await get(query(ref(db, "Subject Schedules/"), orderByChild('teacherAssigned'), equalTo(userName)));
        if (snappy.exists() && snappy.val() !== null) {
          snappy.forEach((laman) => {
            setSub(laman.child('subject').val());
            toast.success("Subject set - now accepting attendance");
            const speak = new SpeechSynthesisUtterance("Subject set - now accepting attendance");
            speak.voice = window.speechSynthesis.getVoices().find(voice => voice.name === "Microsoft Hazel - English (United Kingdom)")

            window.speechSynthesis.speak(speak);
            setShow(false);
            setTeacherInput(false);
          });
        } else {
          toast.error("No subject is assigned to current user. Contact the administrator");
          const speak = new SpeechSynthesisUtterance("No subject is assigned to current user. Contact the administrator");
          speak.voice = window.speechSynthesis.getVoices().find(voice => voice.name === "Microsoft Hazel - English (United Kingdom)")

          window.speechSynthesis.speak(speak);
          setShow(false)
        }
      } else {
        toast.error("User is not found. Contact the administrator");
        const speak = new SpeechSynthesisUtterance("User is not found. Contact the administrator");
        speak.voice = window.speechSynthesis.getVoices().find(voice => voice.name === "Microsoft Hazel - English (United Kingdom)")

        window.speechSynthesis.speak(speak);
        setShow(false)
      }
    } catch (error) {
      console.error("Error retrieving teacher data:", error);
      toast.error("An error occurred. Please try again.");
      setShow(false)
      const speak = new SpeechSynthesisUtterance("Error retrieving teacher data");
      speak.voice = window.speechSynthesis.getVoices().find(voice => voice.name === "Microsoft Hazel - English (United Kingdom)")

      window.speechSynthesis.speak(speak);
    }
  };

  // In and out
  const inAndOut = async (value, { resetForm }) => {
    setShow(true);
    try {
      // Fetch student information from the Grand List
      const getStudent = ref(db, "Grand List/" + value.idNumber);
      const snapshot = await get(getStudent);
      const studentData = snapshot.val();
  
      if (snapshot.exists()) {
        const currentTime = new Date();
        const scheduledTime = new Date(studentData.timeIn); // Assuming timeIn is stored in a format parseable by Date
  
        // Calculate time difference in minutes
        const timeDifference = (currentTime - scheduledTime) / 1000 / 60; // Convert to minutes
  
        let admissionStatus;
        if (timeDifference < 0) {
          admissionStatus = `Early Out ${currentSub}`; // Student is early
        } else if (timeDifference <= 15) {
          admissionStatus = `In ${currentSub}`; // On time
        } else if (timeDifference <= 30) {
          admissionStatus = `Late for ${currentSub}`; // Late
        } else {
          admissionStatus = `Absent for ${currentSub}`; // Absent
        }
  
        // Update Grand Attendance and Grand List
        await update(ref(db, `Grand Attendance/${currentDate}/${studentData.grade_level}/${currentSub}/${studentData.id_num}`), {
          ...studentData,
          admission: admissionStatus,
          status: timeDifference > 30 ? 'Absent' : timeDifference > 15 ? 'Late' : 'Present',
          timeChecked: currentTime.toLocaleTimeString(),
          subject: currentSub
        });
  
        await update(ref(db, `Grand List/${studentData.id_num}`), {
          ...studentData,
          status: timeDifference > 30 ? 'Absent' : timeDifference > 15 ? 'Late' : 'Present',
          subject: currentSub,
          admission: admissionStatus,
        });
  
        const message = `Hello! Student ${studentData.student_name} has successfully ${timeDifference > 30 ? "missed attendance" : "attended"} at ${currentTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}.`;
  
        const phoneNum = studentData.caretaker_num;
        // For sending message
        const padala = await axios.post("https://attendance-monitoring-back-end.onrender.com/send-sms", { message, phoneNum });
        toast.info(padala.data.message);
  
        // For the AI to speak
        if ('speechSynthesis' in window) {
          const speak = new SpeechSynthesisUtterance(message);
          speak.voice = window.speechSynthesis.getVoices().find(voice => voice.name === "Microsoft Hazel - English (United Kingdom)");
          window.speechSynthesis.speak(speak);
        } else {
          console.log("Speech isn't supported here");
        }
  
        toast.success(`You have successfully ${timeDifference > 30 ? "missed attendance" : "attended"}`);
      } else {
        toast.error("Student is not registered. Contact administrator");
        const speak = new SpeechSynthesisUtterance('Student is not registered. Contact administrator');
        speak.voice = window.speechSynthesis.getVoices().find(voice => voice.name === "Microsoft Hazel - English (United Kingdom)");
        window.speechSynthesis.speak(speak);
      }
    } catch (error) {
      console.error("Student is not enrolled. Contact administrator", error);
      const speak = new SpeechSynthesisUtterance('Student information is not enrolled. Contact administrator');
      speak.voice = window.speechSynthesis.getVoices().find(voice => voice.name === "Microsoft Hazel - English (United Kingdom)");
      window.speechSynthesis.speak(speak);
    }
  
    setTimeout(() => {
      resetForm();
    }, 3500);
    setShow(false);
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
      <Box display='flex' justifyContent='space-around'>
        <Box display='grid'>
          <Typography variant='h5' textAlign='center'>Number of Present Students</Typography>
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: totalStudents, label: 'Total Present Students' },
                  { id: 1, value: totalAbsent, label: 'Total Absent Students' },
                
                ],
              },
            ]}
            width={500}
            height={200}
          />
        </Box>
       
      </Box>
    </Box>
  )
}

export default Dashboard