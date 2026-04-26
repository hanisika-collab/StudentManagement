package com.example.studentApi.controller;

import com.example.studentApi.model.Marks;
import com.example.studentApi.service.MarkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marks")
@CrossOrigin(origins = "http://localhost:3000")
public class MarksController {

    @Autowired
    private MarkService markService;

    // Add academic marks for a specific student using String ID
    @PostMapping("/add/{studentId}")
    public ResponseEntity<Marks> addMarks(@PathVariable String studentId, @RequestBody Marks marks) {
        Marks savedMarks = markService.addMarks(studentId, marks);
        return ResponseEntity.ok(savedMarks);
    }

    // Retrieve all marks for the Student Portal and AI Analysis
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Marks>> getMarksByStudent(@PathVariable String studentId) {
        List<Marks> marksList = markService.getMarksByStudent(studentId);
        return ResponseEntity.ok(marksList);
    }
}