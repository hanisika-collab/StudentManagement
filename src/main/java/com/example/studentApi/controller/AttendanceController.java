package com.example.studentApi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.studentApi.model.Attendance;
import com.example.studentApi.service.AttendanceService;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "http://localhost:3000")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    // Mark attendance for a specific student using String ID
    @PostMapping("/mark/{studentId}")
    public ResponseEntity<Attendance> markAttendance(@PathVariable String studentId, @RequestBody Attendance attendance) {
        Attendance savedAttendance = attendanceService.markAttendance(studentId, attendance);
        return ResponseEntity.ok(savedAttendance);
    }

    // Get all attendance records for a specific student
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Attendance>> getAttendanceByStudent(@PathVariable String studentId) {
        List<Attendance> records = attendanceService.getAttendanceByStudent(studentId);
        return ResponseEntity.ok(records);
    }
    @GetMapping("/date/{date}")
    public ResponseEntity<List<Attendance>> getAttendanceByDate(@PathVariable String date) {
    // Assuming you have a method in service to find by date string or LocalDate
    return ResponseEntity.ok(attendanceService.getAttendanceByDate(date));
    }
    
}