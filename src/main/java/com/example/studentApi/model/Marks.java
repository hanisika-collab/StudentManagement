package com.example.studentApi.model;

import jakarta.persistence.*;

@Entity
@Table(name = "marks")
public class Marks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String semester; // e.g., Semester 8
    private String subject;  // e.g., Java, Cloud Computing
    private int internalMarks;
    private int externalMarks;
    private int totalMarks;
    private int extraCurricularPoints;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;

    public Marks() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public int getInternalMarks() { return internalMarks; }
    public void setInternalMarks(int internalMarks) { this.internalMarks = internalMarks; }

    public int getExternalMarks() { return externalMarks; }
    public void setExternalMarks(int externalMarks) { this.externalMarks = externalMarks; }

    public int getTotalMarks() { return totalMarks; }
    public void setTotalMarks(int totalMarks) { this.totalMarks = totalMarks; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public int getExtraCurricularPoints() { return extraCurricularPoints; }
    public void setExtraCurricularPoints(int extraCurricularPoints) { this.extraCurricularPoints = extraCurricularPoints; }
}