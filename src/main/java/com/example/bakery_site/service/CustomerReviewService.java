package com.example.bakery_site.service;

import com.example.bakery_site.dto.CustomerReviewRequestDto;
import com.example.bakery_site.model.CustomerReview;
import com.example.bakery_site.repository.CustomerReviewRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class CustomerReviewService {

    private final CustomerReviewRepository customerReviewRepository;

    public CustomerReviewService(CustomerReviewRepository customerReviewRepository) {
        this.customerReviewRepository = customerReviewRepository;
    }

    public CustomerReview createReview(CustomerReviewRequestDto request) {
        validate(request);
        CustomerReview review = new CustomerReview();
        review.setCustomerId(request.getCustomerId());
        review.setCustomerName(clean(request.getCustomerName()));
        review.setCustomerEmail(clean(request.getCustomerEmail()).toLowerCase());
        review.setReviewText(clean(request.getReviewText()));
        review.setLikesCount(0);
        review.setDislikesCount(0);
        review.setHiddenByAdmin(false);
        review.setAutoHidden(false);
        review.setCreatedAt(now());
        review.setUpdatedAt(now());
        return customerReviewRepository.save(review);
    }

    public CustomerReview updateOwnReview(Long reviewId, CustomerReviewRequestDto request) {
        validate(request);
        CustomerReview review = customerReviewRepository.findByIdAndCustomerId(reviewId, request.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Review not found for this customer."));
        review.setReviewText(clean(request.getReviewText()));
        review.setUpdatedAt(now());
        return customerReviewRepository.save(review);
    }

    public List<CustomerReview> getOwnReviews(Integer customerId) {
        return customerReviewRepository.findByCustomerIdOrderByIdDesc(customerId);
    }

    public void deleteOwnReview(Long reviewId, Integer customerId) {
        if (customerId == null) throw new IllegalArgumentException("Customer login required.");
        CustomerReview review = customerReviewRepository.findByIdAndCustomerId(reviewId, customerId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found for this customer."));
        customerReviewRepository.delete(review);
    }

    public List<CustomerReview> getVisibleReviews() {
        return customerReviewRepository.findByHiddenByAdminFalseAndAutoHiddenFalseOrderByIdDesc();
    }

    public CustomerReview reactToReview(Long reviewId, String action) {
        CustomerReview review = customerReviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found."));
        if ("like".equalsIgnoreCase(clean(action))) {
            review.setLikesCount((review.getLikesCount() == null ? 0 : review.getLikesCount()) + 1);
        } else if ("dislike".equalsIgnoreCase(clean(action))) {
            int dislikes = (review.getDislikesCount() == null ? 0 : review.getDislikesCount()) + 1;
            review.setDislikesCount(dislikes);
            if (dislikes >= 3) {
                review.setAutoHidden(true);
            }
        } else {
            throw new IllegalArgumentException("Invalid reaction type.");
        }
        review.setUpdatedAt(now());
        return customerReviewRepository.save(review);
    }

    public List<CustomerReview> getAllForAdmin() {
        return customerReviewRepository.findAllByOrderByIdDesc();
    }

    public CustomerReview setHiddenByAdmin(Long reviewId, boolean hidden) {
        CustomerReview review = customerReviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found."));
        review.setHiddenByAdmin(hidden);
        review.setUpdatedAt(now());
        return customerReviewRepository.save(review);
    }

    private void validate(CustomerReviewRequestDto request) {
        if (request.getCustomerId() == null) throw new IllegalArgumentException("Customer login required.");
        if (clean(request.getCustomerName()).isEmpty()) throw new IllegalArgumentException("Customer name required.");
        if (clean(request.getCustomerEmail()).isEmpty()) throw new IllegalArgumentException("Customer email required.");
        if (clean(request.getReviewText()).isEmpty()) throw new IllegalArgumentException("Review text is required.");
    }

    private String now() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    private String clean(String v) {
        return v == null ? "" : v.trim();
    }
}
