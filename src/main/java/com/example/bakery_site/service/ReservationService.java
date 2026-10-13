package com.example.bakery_site.service;

import com.example.bakery_site.dto.ReservationRequestDto;
import com.example.bakery_site.model.Reservation;
import com.example.bakery_site.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservationService implements IReservationService {

    private static final int TABLE_LIMIT_PER_SLOT = 15;

    private final ReservationRepository reservationRepository;

    public ReservationService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    @Override
    public String createReservation(ReservationRequestDto request) {
        Reservation reservation = new Reservation();
        reservation.setName(clean(request.getName()));
        reservation.setPhone(clean(request.getPhone()));
        reservation.setEmail(clean(request.getEmail()).toLowerCase());
        reservation.setPersons(request.getPersons() <= 0 ? 1 : request.getPersons());
        reservation.setReservationDate(request.getReservationDate());
        reservation.setReservationTime(request.getReservationTime());
        reservation.setMessage(request.getMessage() == null ? "" : request.getMessage());
        reservation.setReservationStatus("Pending");
        reservation.setCancelRequested(false);
        reservation.setCreatedAt(LocalDateTime.now().toString());

        List<Reservation> existing = reservationRepository.findByReservationDateAndReservationTime(
                reservation.getReservationDate(),
                reservation.getReservationTime()
        );
        if (existing.size() >= TABLE_LIMIT_PER_SLOT) {
            return "FULL";
        }

        List<Reservation> duplicate = reservationRepository.findByNameAndPhoneAndReservationDateAndReservationTime(
                reservation.getName(),
                reservation.getPhone(),
                reservation.getReservationDate(),
                reservation.getReservationTime()
        );
        if (!duplicate.isEmpty()) {
            return "DUPLICATE";
        }

        reservationRepository.save(reservation);
        return "SUCCESS";
    }

    private String clean(String value) {
        return value == null ? "" : value.trim();
    }
}
