package com.example.studentApi.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.studentApi.exception.ResourceNotFoundException;
import com.example.studentApi.model.Marks;
import com.example.studentApi.model.Student;
import com.example.studentApi.repository.MarkRepository;
import com.example.studentApi.repository.StudentRepository;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private MarkRepository markRepository;

    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(String id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + id));
    }

    public String deleteStudent(String id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cannot delete. Student not found: " + id);
        }
        studentRepository.deleteById(id);
        return "Student removed successfully: " + id;
    }

    public Student updateStudent(String id, Student details) {
        Student existing = getStudentById(id);
        existing.setName(details.getName());
        existing.setDepartment(details.getDepartment());
        existing.setDateOfBirth(details.getDateOfBirth());
        existing.setCurrentGoal(details.getCurrentGoal());
        return studentRepository.save(existing);
    }
    // Add this helper to StudentService.java
public String generateSimpleInsight(String studentId) {
    // This can be used for the AI Card if you want to move logic to backend
    List<Marks> marks = markRepository.findByStudentId(studentId);
    if (marks.isEmpty()) return "No academic data available for analysis.";
    
    double avg = marks.stream().mapToDouble(m -> m.getInternalMarks() + m.getExternalMarks()).average().orElse(0);
    return avg > 75 ? "Excellent standing. Eligible for internships." : "Maintain focus on core subjects.";
}
}