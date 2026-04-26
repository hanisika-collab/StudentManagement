package com.example.studentApi.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.studentApi.repository.StaffRepository;
import com.example.studentApi.repository.StudentRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private StudentRepository studentRepo;

    @Autowired
    private StaffRepository staffRepo;

    @PostMapping("/login/student")
    public ResponseEntity<?> studentLogin(@RequestBody Map<String, String> data) {
        String regNo = data.get("regNo"); // String type for AC22UIT001
        String dob = data.get("dob");

        return studentRepo.findById(regNo)
                .filter(student -> dob.equals(student.getDateOfBirth()))
                .map(student -> ResponseEntity.ok(student))
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    @PostMapping("/login/staff")
    public ResponseEntity<?> staffLogin(@RequestBody Map<String, String> data) {
        String name = data.get("name");
        String phone = data.get("phone");

        return staffRepo.findByName(name)
                .filter(staff -> phone.equals(staff.getPhoneNumber()))
                .map(staff -> ResponseEntity.ok(staff))
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
    
}