package com.shopai.shopai.domain.product.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "상품 수정 요청")
public class ProductUpdateRequest {
    @NotBlank(message = "상품명은 필수입니다")
    @Schema(description = "상품명", example = "나이키 에어맥스 95")
    private String name;

    @Schema(description = "카테고리", example = "신발")
    private String category;

    @NotNull(message = "가격은 필수입니다")
    @Positive(message = "가격은 0보다 커야합니다")
    @Schema(description = "가격", example = "159000")
    private BigDecimal price;

    @Schema(description = "상품 설명", example = "업그레이드된 에어맥스")
    private String description;

    @Schema(description = "이미지 URL", example = "https://example.com/image2.jpg")
    private String imageUrl;
}