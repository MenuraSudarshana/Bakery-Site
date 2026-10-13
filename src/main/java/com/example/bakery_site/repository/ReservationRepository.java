package com.example.bakery_site.repository;

import com.example.bakery_site.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByReservationDateAndReservationTime(String date, String time);

    List<Reservation> findByNameAndPhoneAndReservationDateAndReservationTime(
            String name, String phone, String date, String time
    );

    List<Reservation> findAllByOrderByIdDesc();

    List<Reservation> findByPhoneOrderByIdDesc(String phone);

    List<Reservation> findByEmailIgnoreCaseOrderByIdDesc(String email);
}
