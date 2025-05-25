package com.example.controller;

import com.example.entity.Train;
import com.example.service.TrainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/train")
@CrossOrigin(origins = "http://localhost:3000")
public class TrainController {
    @Autowired
    private TrainService trainService;

    @PostMapping("/add")
    public Train addTrain(@RequestBody Train train) {
        return trainService.addTrain(train);
    }

    @GetMapping("/search")
    public List<Train> searchTrains(@RequestParam String source, @RequestParam String destination) {
        return trainService.searchTrains(source, destination);
    }

    @GetMapping("/{id}")
    public Optional<Train> getTrainById(@PathVariable Long id) {
        return trainService.getTrainById(id);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteTrain(@PathVariable Long id) {
        boolean deleted = trainService.deleteTrainById(id);
        if (deleted) {
            return "Train with ID " + id + " deleted successfully.";
        } else {
            return "Train with ID " + id + " not found.";
        }
    }

}
