package com.shopai.shopai.domain.product.dto;

import com.shopai.shopai.domain.product.entity.ProductOptionValue;
import lombok.*;

@Getter
@AllArgsConstructor
@Builder
public class OptionValueResponse {
    private Long id;
    private String value;
    private Integer sortOrder;

    public static OptionValueResponse from(ProductOptionValue optionValue) {
        return OptionValueResponse.builder()
                .id(optionValue.getId())
                .value(optionValue.getValue())
                .sortOrder(optionValue.getSortOrder())
                .build();
    }
}