package com.example.service;

import com.example.entity.Admin;
import java.util.Optional;

public interface AdminService {
    Admin registerAdmin(Admin admin);
    Admin registerUser(Admin user);
    String login(String username, String password);
}
