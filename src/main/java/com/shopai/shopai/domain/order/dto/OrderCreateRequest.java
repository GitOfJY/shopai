package com.shopai.shopai.domain.order.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderCreateRequest {
    private String recipientName;
    private String recipientPhone;
    private String shippingZipcode;
    private String shippingAddress;
    private String shippingAddressDetail;

    @NotEmpty(message = "주문 상품은 필수입니다")
    private List<OrderProductRequest> orderProducts;
}