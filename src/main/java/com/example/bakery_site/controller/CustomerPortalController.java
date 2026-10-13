package com.example.bakery_site.controller;

import com.example.bakery_site.model.CustomerOrder;
import com.example.bakery_site.model.CustomizeCakeOrder;
import com.example.bakery_site.model.Reservation;
import com.example.bakery_site.repository.CustomerOrderRepository;
import com.example.bakery_site.repository.CustomizeCakeOrderRepository;
import com.example.bakery_site.repository.ReservationRepository;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@CrossOrigin
@RequestMapping("/api/customers")
public class CustomerPortalController {

    private final CustomerOrderRepository customerOrderRepository;
    private final ReservationRepository reservationRepository;
    private final CustomizeCakeOrderRepository customizeCakeOrderRepository;

    public CustomerPortalController(
            CustomerOrderRepository customerOrderRepository,
            ReservationRepository reservationRepository,
            CustomizeCakeOrderRepository customizeCakeOrderRepository
    ) {
        this.customerOrderRepository = customerOrderRepository;
        this.reservationRepository = reservationRepository;
        this.customizeCakeOrderRepository = customizeCakeOrderRepository;
    }

    @GetMapping("/account-overview")
    public Map<String, Object> accountOverview(
            @RequestParam(required = false) Integer customerId,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String phone
    ) {
        List<CustomerOrder> orders = customerId != null
                ? customerOrderRepository.findByCustomerIdOrderByIdDesc(customerId)
                : customerOrderRepository.findByCustomerEmailIgnoreCaseOrderByIdDesc(clean(email).toLowerCase());

        String cleanPhone = clean(phone);
        String cleanEmail = clean(email).toLowerCase();
        List<Reservation> reservations;
        if (!cleanPhone.isEmpty()) {
            reservations = reservationRepository.findByPhoneOrderByIdDesc(cleanPhone);
        } else if (!cleanEmail.isEmpty()) {
            reservations = reservationRepository.findByEmailIgnoreCaseOrderByIdDesc(cleanEmail);
        } else {
            reservations = List.of();
        }

        List<CustomizeCakeOrder> customizeOrders = customerId != null
                ? customizeCakeOrderRepository.findByCustomerIdOrderByIdDesc(customerId)
                : customizeCakeOrderRepository.findByCustomerEmailIgnoreCaseOrderByIdDesc(clean(email).toLowerCase());

        return Map.of("success", true, "orders", orders, "reservations", reservations, "customizeOrders", customizeOrders);
    }

    @PatchMapping("/orders/{orderId}/cancel-request")
    public Map<String, Object> requestOrderCancel(
            @PathVariable Integer orderId,
            @RequestParam(required = false) Integer customerId,
            @RequestParam(required = false) String email
    ) {
        CustomerOrder order = customerOrderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found."));

        boolean ownsById = customerId != null && order.getCustomerId() != null && customerId.equals(order.getCustomerId());
        boolean ownsByEmail = !clean(email).isEmpty() && clean(email).equalsIgnoreCase(clean(order.getCustomerEmail()));
        if (!ownsById && !ownsByEmail) {
            throw new IllegalArgumentException("You are not allowed to update this order.");
        }

        String status = clean(order.getOrderStatus());
        if (!status.equalsIgnoreCase("pending") && !status.equalsIgnoreCase("requested_to_cancel")) {
            throw new IllegalArgumentException("Only pending orders can request cancellation.");
        }

        order.setCancelRequested(true);
        order.setOrderStatus("REQUESTED_TO_CANCEL");
        customerOrderRepository.save(order);
        return Map.of("success", true, "message", "Cancel request submitted for order.");
    }

    @PatchMapping("/orders/{orderId}/update-request")
    public Map<String, Object> requestOrderUpdate(
            @PathVariable Integer orderId,
            @RequestParam(required = false) Integer customerId,
            @RequestParam(required = false) String email,
            @RequestParam String note
    ) {
        CustomerOrder order = customerOrderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found."));

        boolean ownsById = customerId != null && order.getCustomerId() != null && customerId.equals(order.getCustomerId());
        boolean ownsByEmail = !clean(email).isEmpty() && clean(email).equalsIgnoreCase(clean(order.getCustomerEmail()));
        if (!ownsById && !ownsByEmail) {
            throw new IllegalArgumentException("You are not allowed to update this order.");
        }

        String updateNote = clean(note);
        if (updateNote.isEmpty()) {
            throw new IllegalArgumentException("Please enter what you need to change.");
        }

        order.setUpdateRequested(true);
        order.setUpdateRequestNote(updateNote);
        customerOrderRepository.save(order);
        return Map.of("success", true, "message", "Update request submitted for order.");
    }

    @PutMapping("/orders/{orderId}")
    public Map<String, Object> updateOrder(
            @PathVariable Integer orderId,
            @RequestParam(required = false) Integer customerId,
            @RequestParam(required = false) String email,
            @RequestBody Map<String, Object> body
    ) {
        CustomerOrder order = customerOrderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found."));

        boolean ownsById = customerId != null && order.getCustomerId() != null && customerId.equals(order.getCustomerId());
        boolean ownsByEmail = !clean(email).isEmpty() && clean(email).equalsIgnoreCase(clean(order.getCustomerEmail()));
        if (!ownsById && !ownsByEmail) {
            throw new IllegalArgumentException("You are not allowed to update this order.");
        }

        if (!"pending".equalsIgnoreCase(clean(order.getOrderStatus()))) {
            throw new IllegalArgumentException("Only pending orders can be updated.");
        }

        String pickupDate = clean(String.valueOf(body.getOrDefault("pickupDate", "")));
        String pickupTime = clean(String.valueOf(body.getOrDefault("pickupTime", "")));
        String paymentMethod = clean(String.valueOf(body.getOrDefault("paymentMethod", "")));
        String customerPhone = clean(String.valueOf(body.getOrDefault("customerPhone", "")));
        int quantity = parseInt(body.get("quantity"), 1);

        if (pickupDate.isEmpty() || pickupTime.isEmpty() || paymentMethod.isEmpty() || customerPhone.isEmpty()) {
            throw new IllegalArgumentException("Phone, pickup date, pickup time and payment method are required.");
        }
        if (!customerPhone.matches("^\\d{10}$")) {
            throw new IllegalArgumentException("Phone number must contain exactly 10 digits.");
        }
        if (quantity < 1) {
            throw new IllegalArgumentException("Quantity must be at least 1.");
        }
        if (!paymentMethod.equals("Pay at Pickup")
                && !paymentMethod.equals("Card on Collection")
                && !paymentMethod.equals("Home Delivery")) {
            throw new IllegalArgumentException("Please choose a valid payment method.");
        }

        UpdatedOrderData updatedOrderData = recalculateOrderItemsAndTotal(order.getOrderItems(), quantity);
        order.setPickupDate(pickupDate);
        order.setPickupTime(pickupTime);
        order.setPaymentMethod(paymentMethod);
        order.setCustomerPhone(customerPhone);
        order.setOrderItems(updatedOrderData.orderItems());
        order.setTotal(updatedOrderData.total());
        order.setUpdateRequested(false);
        order.setUpdateRequestNote(null);
        customerOrderRepository.save(order);
        return Map.of("success", true, "message", "Order updated successfully.");
    }

    @PatchMapping("/reservations/{reservationId}/cancel-request")
    public Map<String, Object> requestReservationCancel(
            @PathVariable Long reservationId,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) String email
    ) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found."));

        boolean ownsByPhone = !clean(phone).isEmpty() && clean(phone).equals(clean(reservation.getPhone()));
        boolean ownsByEmail = !clean(email).isEmpty() && clean(email).equalsIgnoreCase(clean(reservation.getEmail()));
        if (!ownsByPhone && !ownsByEmail) {
            throw new IllegalArgumentException("You are not allowed to update this reservation.");
        }

        String status = clean(reservation.getReservationStatus());
        if (!status.equalsIgnoreCase("pending") && !status.equalsIgnoreCase("requested_to_cancel")) {
            throw new IllegalArgumentException("Only pending reservations can request cancellation.");
        }

        reservation.setCancelRequested(true);
        reservation.setReservationStatus("REQUESTED_TO_CANCEL");
        reservationRepository.save(reservation);
        return Map.of("success", true, "message", "Cancel request submitted for reservation.");
    }

    @PatchMapping("/reservations/{reservationId}/update-request")
    public Map<String, Object> requestReservationUpdate(
            @PathVariable Long reservationId,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) String email,
            @RequestParam String note
    ) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found."));

        boolean ownsByPhone = !clean(phone).isEmpty() && clean(phone).equals(clean(reservation.getPhone()));
        boolean ownsByEmail = !clean(email).isEmpty() && clean(email).equalsIgnoreCase(clean(reservation.getEmail()));
        if (!ownsByPhone && !ownsByEmail) {
            throw new IllegalArgumentException("You are not allowed to update this reservation.");
        }

        String updateNote = clean(note);
        if (updateNote.isEmpty()) {
            throw new IllegalArgumentException("Please enter what you need to change.");
        }

        reservation.setUpdateRequested(true);
        reservation.setUpdateRequestNote(updateNote);
        reservationRepository.save(reservation);
        return Map.of("success", true, "message", "Update request submitted for reservation.");
    }

    @PutMapping("/reservations/{reservationId}")
    public Map<String, Object> updateReservation(
            @PathVariable Long reservationId,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) String email,
            @RequestBody Map<String, Object> body
    ) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found."));

        boolean ownsByPhone = !clean(phone).isEmpty() && clean(phone).equals(clean(reservation.getPhone()));
        boolean ownsByEmail = !clean(email).isEmpty() && clean(email).equalsIgnoreCase(clean(reservation.getEmail()));
        if (!ownsByPhone && !ownsByEmail) {
            throw new IllegalArgumentException("You are not allowed to update this reservation.");
        }

        String status = clean(reservation.getReservationStatus());
        if (!status.equalsIgnoreCase("pending")) {
            throw new IllegalArgumentException("Only pending reservations can be updated.");
        }

        String reservationDate = clean(String.valueOf(body.getOrDefault("reservationDate", "")));
        String reservationTime = clean(String.valueOf(body.getOrDefault("reservationTime", "")));
        int guests = parseInt(body.get("persons"), 0);

        if (reservationDate.isEmpty() || reservationTime.isEmpty() || guests < 1) {
            throw new IllegalArgumentException("Date, time and guests are required.");
        }

        reservation.setReservationDate(reservationDate);
        reservation.setReservationTime(reservationTime);
        reservation.setPersons(guests);
        reservation.setUpdateRequested(false);
        reservation.setUpdateRequestNote(null);
        reservationRepository.save(reservation);
        return Map.of("success", true, "message", "Reservation updated successfully.");
    }

    @PatchMapping("/customize-orders/{orderId}/cancel-request")
    public Map<String, Object> requestCustomizeOrderCancel(
            @PathVariable Long orderId,
            @RequestParam(required = false) Integer customerId,
            @RequestParam(required = false) String email
    ) {
        CustomizeCakeOrder order = customizeCakeOrderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Customize cake order not found."));

        boolean ownsById = customerId != null && order.getCustomerId() != null && customerId.equals(order.getCustomerId());
        boolean ownsByEmail = !clean(email).isEmpty() && clean(email).equalsIgnoreCase(clean(order.getCustomerEmail()));
        if (!ownsById && !ownsByEmail) {
            throw new IllegalArgumentException("You are not allowed to update this customize cake order.");
        }

        String status = clean(order.getOrderStatus());
        if (!status.equalsIgnoreCase("pending")
                && !status.equalsIgnoreCase("pending_review")
                && !status.equalsIgnoreCase("requested_to_cancel")) {
            throw new IllegalArgumentException("Only pending customize cake orders can request cancellation.");
        }

        order.setCancelRequested(true);
        order.setOrderStatus("REQUESTED_TO_CANCEL");
        customizeCakeOrderRepository.save(order);
        return Map.of("success", true, "message", "Cancel request submitted for customize cake order.");
    }

    @PatchMapping("/customize-orders/{orderId}/update-request")
    public Map<String, Object> requestCustomizeOrderUpdate(
            @PathVariable Long orderId,
            @RequestParam(required = false) Integer customerId,
            @RequestParam(required = false) String email,
            @RequestParam String note
    ) {
        CustomizeCakeOrder order = customizeCakeOrderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Customize cake order not found."));

        boolean ownsById = customerId != null && order.getCustomerId() != null && customerId.equals(order.getCustomerId());
        boolean ownsByEmail = !clean(email).isEmpty() && clean(email).equalsIgnoreCase(clean(order.getCustomerEmail()));
        if (!ownsById && !ownsByEmail) {
            throw new IllegalArgumentException("You are not allowed to update this customize cake order.");
        }

        String updateNote = clean(note);
        if (updateNote.isEmpty()) {
            throw new IllegalArgumentException("Please enter what you need to change.");
        }

        order.setUpdateRequested(true);
        order.setUpdateRequestNote(updateNote);
        customizeCakeOrderRepository.save(order);
        return Map.of("success", true, "message", "Update request submitted for customize cake order.");
    }

    @PutMapping("/customize-orders/{orderId}")
    public Map<String, Object> updateCustomizeOrder(
            @PathVariable Long orderId,
            @RequestParam(required = false) Integer customerId,
            @RequestParam(required = false) String email,
            @RequestBody Map<String, Object> body
    ) {
        CustomizeCakeOrder order = customizeCakeOrderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Customize cake order not found."));

        boolean ownsById = customerId != null && order.getCustomerId() != null && customerId.equals(order.getCustomerId());
        boolean ownsByEmail = !clean(email).isEmpty() && clean(email).equalsIgnoreCase(clean(order.getCustomerEmail()));
        if (!ownsById && !ownsByEmail) {
            throw new IllegalArgumentException("You are not allowed to update this customize cake order.");
        }

        String status = clean(order.getOrderStatus());
        if (!status.equalsIgnoreCase("pending") && !status.equalsIgnoreCase("pending_review")) {
            throw new IllegalArgumentException("Only pending customize orders can be updated.");
        }

        String occasion = clean(String.valueOf(body.getOrDefault("occasion", "")));
        String weight = clean(String.valueOf(body.getOrDefault("weight", "")));
        String requiredDate = clean(String.valueOf(body.getOrDefault("requiredDate", "")));
        String paymentMethod = clean(String.valueOf(body.getOrDefault("paymentMethod", "")));
        String contactNumber = clean(String.valueOf(body.getOrDefault("contactNumber", "")));
        String flavor = clean(String.valueOf(body.getOrDefault("flavor", "")));
        String specifications = clean(String.valueOf(body.getOrDefault("specifications", "")));
        String note = clean(String.valueOf(body.getOrDefault("note", "")));
        String designPhotoUrl = clean(String.valueOf(body.getOrDefault("designPhotoUrl", "")));
        int layers = parseInt(body.get("layers"), order.getLayers() == null ? 1 : order.getLayers());

        if (occasion.isEmpty() || weight.isEmpty() || requiredDate.isEmpty() || paymentMethod.isEmpty() || contactNumber.isEmpty()) {
            throw new IllegalArgumentException("Please fill all required fields.");
        }

        order.setOccasion(occasion);
        order.setWeight(weight);
        order.setRequiredDate(requiredDate);
        order.setPaymentMethod(paymentMethod);
        order.setContactNumber(contactNumber);
        order.setFlavor(flavor);
        order.setSpecifications(specifications);
        order.setNote(note);
        order.setLayers(Math.max(1, layers));
        if (!designPhotoUrl.isEmpty()) {
            order.setDesignPhotoUrl(designPhotoUrl);
        }
        order.setUpdateRequested(false);
        order.setUpdateRequestNote(null);
        customizeCakeOrderRepository.save(order);
        return Map.of("success", true, "message", "Customize cake order updated successfully.");
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public Map<String, Object> handleValidationError(IllegalArgumentException exception) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("success", false);
        payload.put("message", exception.getMessage());
        return payload;
    }

    private String clean(String value) {
        return value == null ? "" : value.trim();
    }

    private int parseInt(Object value, int fallback) {
        try {
            return Integer.parseInt(String.valueOf(value));
        } catch (Exception ex) {
            return fallback;
        }
    }

    private UpdatedOrderData recalculateOrderItemsAndTotal(String rawItems, int quantity) {
        String content = clean(rawItems);
        if (content.isEmpty()) return new UpdatedOrderData(content, 0);
        String updatedItems = content.replaceAll("\"qty\"\\s*:\\s*\\d+", "\"qty\":" + quantity);

        Pattern unitPricePattern = Pattern.compile("\"unitPrice\"\\s*:\\s*(\\d+(?:\\.\\d+)?)");
        Matcher matcher = unitPricePattern.matcher(updatedItems);
        double perUnitSum = 0;
        int itemCount = 0;
        while (matcher.find()) {
            perUnitSum += parseDouble(matcher.group(1), 0);
            itemCount += 1;
        }
        if (itemCount == 0) {
            throw new IllegalArgumentException("Could not update order items. Please try again.");
        }

        double total = perUnitSum * quantity;
        return new UpdatedOrderData(updatedItems, total);
    }

    private double parseDouble(String value, double fallback) {
        try {
            return Double.parseDouble(value);
        } catch (Exception ex) {
            return fallback;
        }
    }

    private record UpdatedOrderData(String orderItems, double total) {}
}
