package com.shopai.shopai.domain.product.dto;

import com.shopai.shopai.domain.product.entity.ProductVariant;
import com.shopai.shopai.domain.product.entity.ProductStatus;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class VariantResponse {
    private Long id;
    private String sku;
    private BigDecimal additionalPrice;
    private Integer stockQuantity;
    private ProductStatus status;
    private List<String> optionValues;

    public static VariantResponse from(ProductVariant variant) {
        return VariantResponse.builder()
                .id(variant.getId())
                .sku(variant.getSku())
                .additionalPrice(variant.getAdditionalPrice())
                .stockQuantity(variant.getStockQuantity())
                .status(variant.getStatus())
                .optionValues(variant.getVariantOptions().stream()
                        .map(vo -> vo.getOptionValue().getValue())
                        .toList())
                .build();
    }
}