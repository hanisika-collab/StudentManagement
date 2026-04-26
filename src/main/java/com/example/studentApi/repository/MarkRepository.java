package com.example.studentApi.repository;

import com.example.studentApi.model.Marks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MarkRepository extends JpaRepository<Marks, Long> {

    // ADD THIS LINE: To find marks by university register number (String)
    List<Marks> findByStudentId(String studentId);
}