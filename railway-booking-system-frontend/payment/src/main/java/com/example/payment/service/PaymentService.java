package com.example.payment.service;

import com.example.payment.entity.Payment;

import java.util.List;
import java.util.Optional;

public interface PaymentService {
    Payment processPayment(Payment payment);
    Optional<Payment> getPaymentByTransactionId(String transactionId);
    boolean refundPayment(String transactionId);
    List<Payment> getPaymentsByUserId(Long userId);
}
