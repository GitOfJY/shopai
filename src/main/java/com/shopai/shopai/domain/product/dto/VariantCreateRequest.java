package com.shopai.shopai.domain.product.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VariantCreateRequest {
    @NotBlank(message = "SKU는 필수입니다")
    private String sku;

    private BigDecimal additionalPrice;
    private Integer stockQuantity;
    private List<String> optionValues;
}