package com.shopai.shopai.domain.product.dto;

import com.shopai.shopai.domain.product.entity.Product;
import com.shopai.shopai.domain.product.entity.ProductStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@Builder
@Schema(description = "상품 응답")
public class ProductResponse {
    @Schema(description = "상품 ID")
    private Long id;

    @Schema(description = "상품명")
    private String name;

    @Schema(description = "카테고리")
    private String category;

    @Schema(description = "가격")
    private BigDecimal price;

    @Schema(description = "상품 설명")
    private String description;

    @Schema(description = "AI 생성 설명")
    private String aiDescription;

    @Schema(description = "이미지 URL")
    private String imageUrl;

    @Schema(description = "재고 수량")
    private Integer stockQuantity;

    @Schema(description = "상품 상태")
    private ProductStatus status;

    @Schema(description = "생성일시")
    private LocalDateTime createdAt;

    @Schema(description = "수정일시")
    private LocalDateTime updatedAt;

    public static ProductResponse from(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .category(product.getCategory())
                .price(product.getPrice())
                .description(product.getDescription())
                .aiDescription(product.getAiDescription())
                .imageUrl(product.getImageUrl())
                .stockQuantity(product.getStockQuantity())
                .status(product.getStatus())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}