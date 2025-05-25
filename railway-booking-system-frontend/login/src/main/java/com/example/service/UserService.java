package com.example.service;

import com.example.entity.User;
import com.example.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

//    public boolean authenticate(String email, String password) {
//        Optional<User> user = userRepository.findByEmail(email);
//
//        if (user.isPresent()) {
//            String storedPassword = user.get().getPassword();
//            log.info("User found with email: {}", email);
//            log.info("Stored Password: {}", storedPassword);
//            log.info("Entered Password: {}", password);
//
//            boolean isMatch = storedPassword.equals(password);
//            log.info("Password Match: {}", isMatch);
//            return isMatch;
//        } else {
//            log.warn("No user found with email: {}", email);
//            return false;
//        }
//    }
public User authenticateAndGetUser(String email, String password) {
    Optional<User> user = userRepository.findByEmail(email);
    if (user.isPresent() && user.get().getPassword().equals(password)) {
        return user.get();
    }
    return null;
}

}
