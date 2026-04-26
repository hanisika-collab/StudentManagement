import axios from 'axios';

const STUDENT_API_BASE_URL = "http://localhost:8080/api/students";
const ATTENDANCE_API_BASE_URL = "http://localhost:8080/api/attendance";
const MARKS_API_BASE_URL = "http://localhost:8080/api/marks";

class StudentService {
    // --- STUDENT METHODS ---
    getStudents() {
        return axios.get(`${STUDENT_API_BASE_URL}/all`);
    }

    saveStudent(student) {
        return axios.post(`${STUDENT_API_BASE_URL}/add`, student);
    }

    getStudentById(studentId) {
        return axios.get(`${STUDENT_API_BASE_URL}/${studentId}`);
    }

    updateStudentGoal(studentId, goal) {
        // CRITICAL: Sends raw text and matches StudentController.java
        return axios.put(`${STUDENT_API_BASE_URL}/${studentId}/goal`, goal, {
            headers: { 'Content-Type': 'text/plain' }
        });
    }

    // --- ATTENDANCE METHODS ---
    getAttendanceByStudent(studentId) {
        return axios.get(`${ATTENDANCE_API_BASE_URL}/student/${studentId}`);
    }

    getAttendanceByDate(date) {
        return axios.get(`${ATTENDANCE_API_BASE_URL}/date/${date}`);
    }

    // --- MARKS METHODS ---
    getStudentMarks(studentId) {
        return axios.get(`${MARKS_API_BASE_URL}/student/${studentId}`);
    }

    addStudentMarks(studentId, marksData) {
        return axios.post(`${MARKS_API_BASE_URL}/add/${studentId}`, marksData);
    }
    // Add this to StudentService.js
    staffLogin(name, phone) {
    return axios.post(`http://localhost:8080/api/auth/login/staff`, { name, phone });
}
}

export default new StudentService();