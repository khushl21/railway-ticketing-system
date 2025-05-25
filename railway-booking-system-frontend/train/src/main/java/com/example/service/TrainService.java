package com.example.service;

import com.example.entity.Train;

import java.util.List;
import java.util.Optional;

public interface TrainService {
    Train addTrain(Train train);
    List<Train> searchTrains(String source, String destination);
    Optional<Train> getTrainById(Long id);
    boolean deleteTrainById(Long id);

}
