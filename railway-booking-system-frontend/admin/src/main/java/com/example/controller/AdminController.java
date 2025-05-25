package com.example.controller;

import com.example.entity.Admin;
import com.example.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/registerAdmin")
    public Admin registerAdmin(@RequestBody Admin admin) {
        return adminService.registerAdmin(admin);
    }

    @PostMapping("/registerUser")
    public Admin registerUser(@RequestBody Admin user) {
        return adminService.registerUser(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody Admin loginRequest) {
        return adminService.login(loginRequest.getUsername(), loginRequest.getPassword());
    }
}
