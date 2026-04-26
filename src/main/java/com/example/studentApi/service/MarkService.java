package com.example.studentApi.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.studentApi.model.Marks;
import com.example.studentApi.model.Student;
import com.example.studentApi.repository.MarkRepository;
import com.example.studentApi.repository.StudentRepository;

@Service
public class MarkService {

    @Autowired
    private MarkRepository markRepository;

    @Autowired
    private StudentRepository studentRepository;

    public Marks addMarks(String studentId, Marks marks) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + studentId));
        marks.setStudent(student);
        return markRepository.save(marks);
    }

    public List<Marks> getMarksByStudent(String studentId) {
        return markRepository.findByStudentId(studentId);
    }
}