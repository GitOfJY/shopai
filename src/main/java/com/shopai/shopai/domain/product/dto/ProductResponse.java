package com.shopai.shopai.domain.product.dto;

import com.shopai.shopai.domain.product.entity.Product;
import com.shopai.shopai.domain.product.entity.ProductStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
@Builder
@Schema(description = "상품 응답")
public class ProductResponse {
    private Long id;
    private String name;
    private String category;
    private BigDecimal basePrice;
    private String description;
    private String aiDescription;
    private String imageUrl;
    private ProductStatus status;
    private List<OptionGroupResponse> optionGroups;
    private List<VariantResponse> variants;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ProductResponse from(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .category(product.getCategory())
                .basePrice(product.getBasePrice())
                .description(product.getDescription())
                .aiDescription(product.getAiDescription())
                .imageUrl(product.getImageUrl())
                .status(product.getStatus())
                .optionGroups(product.getOptionGroups().stream()
                        .map(OptionGroupResponse::from)
                        .toList())
                .variants(product.getVariants().stream()
                        .map(VariantResponse::from)
                        .toList())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}