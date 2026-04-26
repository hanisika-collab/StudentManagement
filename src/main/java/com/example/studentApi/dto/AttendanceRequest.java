package com.example.studentApi.dto;

public class AttendanceRequest {
    private Long studentId;
    private String status; // "Present" or "Absent"

    // Getters and Setters
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
}
