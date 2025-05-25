package com.example.service;

import com.example.entity.Train;
import com.example.repository.TrainRepository;
import com.example.service.TrainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TrainServiceImpl implements TrainService {
    @Autowired
    private TrainRepository trainRepository;

    @Override
    public Train addTrain(Train train) {
        return trainRepository.save(train);
    }

    @Override
    public List<Train> searchTrains(String source, String destination) {
        return trainRepository.findBySourceAndDestination(source, destination);
    }

    @Override
    public Optional<Train> getTrainById(Long id) {
        return trainRepository.findById(id);
    }
    @Override
    public boolean deleteTrainById(Long id) {
        Optional<Train> train = trainRepository.findById(id);
        if (train.isPresent()) {
            trainRepository.deleteById(id);
            return true;
        }
        return false;
    }

}
