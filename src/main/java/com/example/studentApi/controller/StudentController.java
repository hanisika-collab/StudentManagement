package com.example.studentApi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.studentApi.model.Student;
import com.example.studentApi.service.StudentService;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:3000")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping("/add")
    public Student addStudent(@RequestBody Student student) {
        return studentService.saveStudent(student);
    }

    @GetMapping("/all")
    public List<Student> getAll() {
        return studentService.getAllStudents();
    }

    @GetMapping("/{id}")
    public Student getById(@PathVariable String id) {
        return studentService.getStudentById(id);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable String id) {
        return studentService.deleteStudent(id);
    }
    @PutMapping("/{id}/goal")
public ResponseEntity<Student> updateStudentGoal(@PathVariable String id, @RequestBody String goal) {
    Student student = studentService.getStudentById(id);
    student.setCurrentGoal(goal);
    studentService.saveStudent(student);
    return ResponseEntity.ok(student);
}
}