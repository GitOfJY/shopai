package com.shopai.shopai.domain.product.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "variant 수정 요청")
public class VariantUpdateRequest {
    private BigDecimal additionalPrice;
    private Integer stockQuantity;
    private String status;
}