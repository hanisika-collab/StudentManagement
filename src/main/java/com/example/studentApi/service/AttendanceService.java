package com.example.studentApi.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.studentApi.model.Attendance;
import com.example.studentApi.model.Student;
import com.example.studentApi.repository.AttendanceRepository;
import com.example.studentApi.repository.StudentRepository;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private StudentRepository studentRepository;

    // 1. Mark Attendance
    public Attendance markAttendance(String studentId, Attendance attendance) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found: " + studentId));
        attendance.setStudent(student);
        return attendanceRepository.save(attendance);
    }

    // 2. Get by Student (Used by Student Portal)
    public List<Attendance> getAttendanceByStudent(String studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }

    // 3. Get by Date (Used by Reports/PDF)
    public List<Attendance> getAttendanceByDate(String date) {
        LocalDate localDate = LocalDate.parse(date);
        return attendanceRepository.findByDate(localDate);
    }
}