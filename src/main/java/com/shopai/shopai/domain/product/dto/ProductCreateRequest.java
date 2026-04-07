package com.shopai.shopai.domain.product.dto;

import com.shopai.shopai.domain.product.entity.Product;
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
@Schema(description = "상품 등록 요청")
public class ProductCreateRequest {
    @NotBlank(message = "상품명은 필수입니다")
    @Schema(description = "상품명", example = "나이키 에어맥스 90")
    private String name;

    @Schema(description = "카테고리", example = "신발")
    private String category;

    @NotNull(message = "가격은 필수입니다")
    @Positive(message = "가격은 0보다 커야합니다")
    @Schema(description = "가격", example = "139000")
    private BigDecimal price;

    @Schema(description = "상품 설명", example = "클래식한 디자인의 나이키 에어맥스")
    private String description;

    @Schema(description = "이미지 URL", example = "https://example.com/image.jpg")
    private String imageUrl;

    @Schema(description = "초기 재고", example = "100")
    private Integer stockQuantity;

    public Product toEntity() {
        return Product.builder()
                .name(name)
                .category(category)
                .price(price)
                .description(description)
                .imageUrl(imageUrl)
                .stockQuantity(stockQuantity != null ? stockQuantity : 0)
                .build();
    }
}