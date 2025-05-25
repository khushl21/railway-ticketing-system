package com.example.controller;

import com.example.entity.LoginRequest;
import com.example.entity.LoginResponse;
import com.example.entity.User;
import com.example.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/login")
@CrossOrigin(origins = "http://localhost:3000")
public class LoginController {
    private final UserService userService;

    public LoginController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/check")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userService.authenticateAndGetUser(request.getEmail(), request.getPassword());
        if (user != null) {
            return ResponseEntity.ok(user); // Send entire user object
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password.");
        }
    }
}
