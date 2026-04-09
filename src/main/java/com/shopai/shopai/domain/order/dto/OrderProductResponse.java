package com.shopai.shopai.domain.order.dto;

import com.shopai.shopai.domain.order.entity.OrderProduct;
import lombok.*;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
@Builder
public class OrderProductResponse {
    private Long id;
    private Long variantId;
    private String sku;
    private String productName;
    private Integer quantity;
    private BigDecimal unitPrice;

    public static OrderProductResponse from(OrderProduct op) {
        return OrderProductResponse.builder()
                .id(op.getId())
                .variantId(op.getVariant().getId())
                .sku(op.getVariant().getSku())
                .productName(op.getVariant().getProduct().getName())
                .quantity(op.getQuantity())
                .unitPrice(op.getUnitPrice())
                .build();
    }
}