package com.shopai.shopai.domain.product.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OptionValueCreateRequest {
    @NotBlank(message = "옵션값은 필수입니다")
    private String value;

    private Integer sortOrder;
}
