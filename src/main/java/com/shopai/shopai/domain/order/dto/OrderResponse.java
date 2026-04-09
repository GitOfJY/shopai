package com.shopai.shopai.domain.order.dto;

import com.shopai.shopai.domain.order.entity.Order;
import com.shopai.shopai.domain.order.entity.OrderStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class OrderResponse {
    private Long id;
    private String orderNumber;
    private BigDecimal totalAmount;
    private String recipientName;
    private String recipientPhone;
    private String shippingZipcode;
    private String shippingAddress;
    private String shippingAddressDetail;
    private OrderStatus status;
    private List<OrderProductResponse> orderProducts;
    private LocalDateTime orderedAt;

    public static OrderResponse from(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .totalAmount(order.getTotalAmount())
                .recipientName(order.getRecipientName())
                .recipientPhone(order.getRecipientPhone())
                .shippingZipcode(order.getShippingZipcode())
                .shippingAddress(order.getShippingAddress())
                .shippingAddressDetail(order.getShippingAddressDetail())
                .status(order.getStatus())
                .orderProducts(order.getOrderProducts().stream()
                        .map(OrderProductResponse::from)
                        .toList())
                .orderedAt(order.getOrderedAt())
                .build();
    }
}