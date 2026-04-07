package com.shopai.shopai.domain.product.dto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OptionGroupCreateRequest {
    @NotBlank(message = "옵션그룹명은 필수입니다")
    private String name;

    private Integer sortOrder;

    @Valid
    private List<OptionValueCreateRequest> optionValues;
}
