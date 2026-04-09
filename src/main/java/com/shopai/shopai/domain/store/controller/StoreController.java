package com.shopai.shopai.domain.store.controller;

import com.shopai.shopai.domain.product.dto.ProductResponse;
import com.shopai.shopai.domain.product.entity.Product;
import com.shopai.shopai.domain.product.repository.ProductRepository;
import com.shopai.shopai.domain.seller.entity.SellerProfile;
import com.shopai.shopai.domain.seller.repository.SellerProfileRepository;
import com.shopai.shopai.domain.store.dto.StoreResponse;
import com.shopai.shopai.global.dto.ApiResponse;
import com.shopai.shopai.global.exception.BaseException;
import com.shopai.shopai.global.exception.ErrorCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/store")
@RequiredArgsConstructor
@Tag(name = "스토어 API", description = "셀러 스토어 조회 API")
public class StoreController {
    private final SellerProfileRepository sellerProfileRepository;
    private final ProductRepository productRepository;

    @GetMapping("/{slug}")
    @Operation(summary = "스토어 정보 조회")
    public ResponseEntity<ApiResponse<StoreResponse>> getStore(@PathVariable String slug) {
        SellerProfile profile = sellerProfileRepository.findByStoreSlug(slug)
                .orElseThrow(() -> new BaseException(ErrorCode.STORE_NOT_FOUND));
        return ResponseEntity.ok(ApiResponse.ok(StoreResponse.from(profile)));
    }

    @GetMapping("/{slug}/products")
    @Operation(summary = "스토어 상품 목록")
    public ResponseEntity<ApiResponse<Page<ProductResponse>>> getStoreProducts(
            @PathVariable String slug,
            @RequestParam(required = false) String category,
            @PageableDefault(size = 30, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        SellerProfile profile = sellerProfileRepository.findByStoreSlug(slug)
                .orElseThrow(() -> new BaseException(ErrorCode.STORE_NOT_FOUND));

        Page<Product> products;
        if (category != null) {
            products = productRepository.findBySellerIdAndCategory(profile.getMember().getId(), category, pageable);
        } else {
            products = productRepository.findBySellerId(profile.getMember().getId(), pageable);
        }

        return ResponseEntity.ok(ApiResponse.ok(products.map(ProductResponse::from)));
    }

    @GetMapping("/{slug}/products/{productId}")
    @Operation(summary = "스토어 상품 상세")
    public ResponseEntity<ApiResponse<ProductResponse>> getStoreProduct(
            @PathVariable String slug,
            @PathVariable Long productId) {
        sellerProfileRepository.findByStoreSlug(slug)
                .orElseThrow(() -> new BaseException(ErrorCode.STORE_NOT_FOUND));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new BaseException(ErrorCode.PRODUCT_NOT_FOUND));

        return ResponseEntity.ok(ApiResponse.ok(ProductResponse.from(product)));
    }

    @GetMapping("/by-seller/{sellerId}")
    @Operation(summary = "셀러 ID로 스토어 정보 조회")
    public ResponseEntity<ApiResponse<StoreResponse>> getStoreBySellerId(@PathVariable Long sellerId) {
        SellerProfile profile = sellerProfileRepository.findByMemberId(sellerId)
                .orElseThrow(() -> new BaseException(ErrorCode.STORE_NOT_FOUND));
        return ResponseEntity.ok(ApiResponse.ok(StoreResponse.from(profile)));
    }
}