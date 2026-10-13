package com.example.bakery_site.service;

import com.example.bakery_site.dto.ReservationRequestDto;

public interface IReservationService {

    String createReservation(ReservationRequestDto request);
}
