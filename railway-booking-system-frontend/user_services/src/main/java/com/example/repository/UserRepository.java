package com.example.repository;

import com.example.entity.user;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<user,Long> {
    Optional<user> findByUsername(String username);
    Optional<user> findByEmail(String email);
    Optional<user> findById(Long id);
}
