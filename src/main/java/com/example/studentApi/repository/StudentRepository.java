package com.example.studentApi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.studentApi.model.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, String> {
    List<Student> findByDepartment(String department);
}