package com.example.studentApi.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.studentApi.model.Attendance;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    
    // Finds all attendance records for a specific university reg number
    List<Attendance> findByStudentId(String studentId);

    // Finds all records for a specific date
    List<Attendance> findByDate(LocalDate date);
}