package com.shopai.shopai.domain.product.controller;

import com.shopai.shopai.domain.product.dto.*;
import com.shopai.shopai.domain.product.entity.ProductStatus;
import com.shopai.shopai.domain.product.service.ProductService;
import com.shopai.shopai.global.dto.ApiResponse;
import com.shopai.shopai.global.exception.SuccessCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "상품 API", description = "상품 CRUD API")
public class ProductController {
    private final ProductService productService;

    @GetMapping
    @Operation(summary = "상품 목록 조회", description = "페이징, 정렬, 카테고리/상태 필터 지원")
    public ResponseEntity<ApiResponse<Page<ProductResponse>>> getProducts(
            @Parameter(description = "카테고리 필터") @RequestParam(required = false) String category,
            @Parameter(description = "상태 필터") @RequestParam(required = false) ProductStatus status,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<ProductResponse> products = productService.getProducts(category, status, pageable);
        return ResponseEntity.ok(ApiResponse.ok(products));
    }

    @GetMapping("/{id}")
    @Operation(summary = "상품 상세 조회")
    public ResponseEntity<ApiResponse<ProductResponse>> getProduct(
            @PathVariable Long id) {
        ProductResponse product = productService.getProduct(id);
        return ResponseEntity.ok(ApiResponse.ok(product));
    }

    @PostMapping
    @Operation(summary = "상품 등록")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
            @Valid @RequestBody ProductCreateRequest request) {
        ProductResponse product = productService.createProduct(request);
        return ResponseEntity.status(SuccessCode.PRODUCT_CREATED.getStatus())
                .body(ApiResponse.of(SuccessCode.PRODUCT_CREATED, product));
    }

    @PutMapping("/{id}")
    @Operation(summary = "상품 수정")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductUpdateRequest request) {
        ProductResponse product = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.of(SuccessCode.PRODUCT_UPDATED, product));
    }

    @PostMapping("/{id}/variants")
    @Operation(summary = "상품 variant 추가")
    public ResponseEntity<ApiResponse<VariantResponse>> addVariant(
            @PathVariable Long id,
            @Valid @RequestBody VariantCreateRequest request) {
        VariantResponse variant = productService.addVariant(id, request);
        return ResponseEntity.status(SuccessCode.PRODUCT_UPDATED.getStatus())
                .body(ApiResponse.of(SuccessCode.PRODUCT_UPDATED, variant));
    }

    @PatchMapping("/{id}/variants/{variantId}")
    @Operation(summary = "variant 수정 (재고/가격/상태)")
    public ResponseEntity<ApiResponse<VariantResponse>> updateVariant(
            @PathVariable Long id,
            @PathVariable Long variantId,
            @Valid @RequestBody VariantUpdateRequest request) {
        VariantResponse variant = productService.updateVariant(id, variantId, request);
        return ResponseEntity.ok(ApiResponse.of(SuccessCode.PRODUCT_UPDATED, variant));
    }

    @DeleteMapping("/{id}/variants/{variantId}")
    @Operation(summary = "variant 삭제")
    public ResponseEntity<ApiResponse<Void>> deleteVariant(
            @PathVariable Long id,
            @PathVariable Long variantId) {
        productService.deleteVariant(id, variantId);
        return ResponseEntity.ok(ApiResponse.of(SuccessCode.PRODUCT_DELETED));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "상품 삭제")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(
            @PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.of(SuccessCode.PRODUCT_DELETED));
    }

    @PostMapping("/{id}/ai-description")
    @Operation(summary = "AI 상품 설명 생성")
    public ResponseEntity<ApiResponse<Void>> generateAiDescription(
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.of(SuccessCode.PRODUCT_AI_DESCRIPTION_REQUESTED));
    }
}