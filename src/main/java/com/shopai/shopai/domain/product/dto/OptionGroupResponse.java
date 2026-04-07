package com.shopai.shopai.domain.product.dto;

import com.shopai.shopai.domain.product.entity.ProductOptionGroup;
import lombok.*;

import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class OptionGroupResponse {
    private Long id;
    private String name;
    private Integer sortOrder;
    private List<OptionValueResponse> optionValues;

    public static OptionGroupResponse from(ProductOptionGroup group) {
        return OptionGroupResponse.builder()
                .id(group.getId())
                .name(group.getName())
                .sortOrder(group.getSortOrder())
                .optionValues(group.getOptionValues().stream()
                        .map(OptionValueResponse::from)
                        .toList())
                .build();
    }
}