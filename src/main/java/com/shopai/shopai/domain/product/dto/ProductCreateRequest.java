package com.shopai.shopai.domain.product.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "상품 등록 요청")
public class ProductCreateRequest {
    @NotBlank(message = "상품명은 필수입니다")
    private String name;

    private String category;

    @NotNull(message = "기본 가격은 필수입니다")
    @Positive(message = "가격은 0보다 커야합니다")
    private BigDecimal basePrice;

    private String description;
    private String imageUrl;

    @Valid
    private List<OptionGroupCreateRequest> optionGroups;

    @Valid
    private List<VariantCreateRequest> variants;
}