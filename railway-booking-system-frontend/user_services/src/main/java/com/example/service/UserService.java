package com.example.service;


import com.example.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.entity.user;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

//    @Autowired
//    private PasswordEncoder passwordEncoder;
    public user registerUser(user u1){
        u1.setPassword(u1.getPassword());//Encrypts password
        return userRepository.save(u1);
    }

    public Optional<user> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<user> getUserById(Long id) {
        return userRepository.findById(id);
    }
}
