package com.example.bakery_site.controller;

import com.example.bakery_site.dto.ReservationRequestDto;
import com.example.bakery_site.service.IReservationService;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/reservations")
public class ReservationController {

    private final IReservationService reservationService;

    public ReservationController(IReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping
    public String createReservation(@RequestBody ReservationRequestDto request) {
        return reservationService.createReservation(request);
    }
}
