package com.example.service;

import com.example.entity.Booking;
import java.util.List;

public interface BookingService {
    Booking createBooking(Booking booking);
    List<Booking> getBookingsByUserId(Long userId);
}
