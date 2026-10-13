package com.example.bakery_site.controller;

import com.example.bakery_site.dto.CustomerReviewRequestDto;
import com.example.bakery_site.model.CustomerReview;
import com.example.bakery_site.service.CustomerReviewService;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
public class CustomerReviewController {

    private final CustomerReviewService customerReviewService;

    public CustomerReviewController(CustomerReviewService customerReviewService) {
        this.customerReviewService = customerReviewService;
    }

    @PostMapping("/api/customers/reviews")
    public CustomerReview createReview(@RequestBody CustomerReviewRequestDto request) {
        return customerReviewService.createReview(request);
    }

    @PutMapping("/api/customers/reviews/{reviewId}")
    public CustomerReview updateReview(@PathVariable Long reviewId, @RequestBody CustomerReviewRequestDto request) {
        return customerReviewService.updateOwnReview(reviewId, request);
    }

    @GetMapping("/api/customers/reviews")
    public List<CustomerReview> ownReviews(@RequestParam Integer customerId) {
        return customerReviewService.getOwnReviews(customerId);
    }

    @DeleteMapping("/api/customers/reviews/{reviewId}")
    public Map<String, Object> deleteOwnReview(@PathVariable Long reviewId, @RequestParam Integer customerId) {
        customerReviewService.deleteOwnReview(reviewId, customerId);
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("success", true);
        payload.put("message", "Review deleted.");
        return payload;
    }

    @GetMapping("/api/reviews")
    public List<CustomerReview> visibleReviews() {
        return customerReviewService.getVisibleReviews();
    }

    @PatchMapping("/api/reviews/{reviewId}/reaction")
    public CustomerReview react(@PathVariable Long reviewId, @RequestParam String action) {
        return customerReviewService.reactToReview(reviewId, action);
    }

    @GetMapping("/api/admin/reviews")
    public List<CustomerReview> adminReviews() {
        return customerReviewService.getAllForAdmin();
    }

    @PatchMapping("/api/admin/reviews/{reviewId}/hidden")
    public CustomerReview setHidden(@PathVariable Long reviewId, @RequestParam boolean hidden) {
        return customerReviewService.setHiddenByAdmin(reviewId, hidden);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public Map<String, Object> handleValidationError(IllegalArgumentException exception) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("success", false);
        payload.put("message", exception.getMessage());
        return payload;
    }
}
