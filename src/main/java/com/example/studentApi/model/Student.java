package com.example.studentApi.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @Column(name = "register_number")
    private String id; // CHANGED: String supports letters and numbers (e.g., AC22UIT001)

    private String name;
    private String department;
    
    @Column(name = "date_of_birth")
    private String dateOfBirth; // Format: DDMMYYYY
    
    @Column(name = "current_goal", length = 500)
    private String currentGoal;

    // Default Constructor
    public Student() {}

    // Parameterized Constructor
    public Student(String id, String name, String department, String dateOfBirth) {
        this.id = id;
        this.name = name;
        this.department = department;
        this.dateOfBirth = dateOfBirth;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getCurrentGoal() {
        return currentGoal;
    }

    public void setCurrentGoal(String currentGoal) {
        this.currentGoal = currentGoal;
    }
}