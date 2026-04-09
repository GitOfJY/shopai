package com.shopai.shopai.domain.order.service;

import com.shopai.shopai.domain.member.entity.Member;
import com.shopai.shopai.domain.member.repository.MemberRepository;
import com.shopai.shopai.domain.order.dto.*;
import com.shopai.shopai.domain.order.entity.Order;
import com.shopai.shopai.domain.order.entity.OrderProduct;
import com.shopai.shopai.domain.order.entity.OrderStatus;
import com.shopai.shopai.domain.order.repository.OrderRepository;
import com.shopai.shopai.domain.product.entity.ProductVariant;
import com.shopai.shopai.domain.product.repository.ProductVariantRepository;
import com.shopai.shopai.global.exception.BaseException;
import com.shopai.shopai.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {
    private final OrderRepository orderRepository;
    private final MemberRepository memberRepository;
    private final ProductVariantRepository productVariantRepository;

    @Transactional
    public OrderResponse createOrder(Long memberId, OrderCreateRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BaseException(ErrorCode.MEMBER_NOT_FOUND));

        // 배송지 없으면 회원 기본 주소 사용
        String recipientName = request.getRecipientName() != null ? request.getRecipientName() : member.getName();
        String recipientPhone = request.getRecipientPhone() != null ? request.getRecipientPhone() : member.getPhone();
        String shippingZipcode = request.getShippingZipcode() != null ? request.getShippingZipcode() : member.getZipcode();
        String shippingAddress = request.getShippingAddress() != null ? request.getShippingAddress() : member.getAddress();
        String shippingAddressDetail = request.getShippingAddressDetail() != null ? request.getShippingAddressDetail() : member.getAddressDetail();

        Order order = Order.builder()
                .member(member)
                .totalAmount(BigDecimal.ZERO)
                .recipientName(recipientName)
                .recipientPhone(recipientPhone)
                .shippingZipcode(shippingZipcode)
                .shippingAddress(shippingAddress)
                .shippingAddressDetail(shippingAddressDetail)
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderProductRequest item : request.getOrderProducts()) {
            ProductVariant variant = productVariantRepository.findById(item.getVariantId())
                    .orElseThrow(() -> new BaseException(ErrorCode.VARIANT_NOT_FOUND));

            // 재고 차감
            variant.decreaseStock(item.getQuantity());

            // 단가 = 기본가 + 추가금액
            BigDecimal unitPrice = variant.getProduct().getBasePrice().add(variant.getAdditionalPrice());
            BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));
            totalAmount = totalAmount.add(subtotal);

            OrderProduct orderProduct = OrderProduct.builder()
                    .order(order)
                    .variant(variant)
                    .quantity(item.getQuantity())
                    .unitPrice(unitPrice)
                    .build();

            order.getOrderProducts().add(orderProduct);
        }

        order.updateTotalAmount(totalAmount);
        Order saved = orderRepository.save(order);
        return OrderResponse.from(saved);
    }

    public Page<OrderResponse> getMyOrders(Long memberId, Pageable pageable) {
        return orderRepository.findByMemberId(memberId, pageable)
                .map(OrderResponse::from);
    }

    public OrderResponse getOrder(Long memberId, Long orderId) {
        Order order = findOrderById(orderId);
        if (!order.getMember().getId().equals(memberId)) {
            throw new BaseException(ErrorCode.ORDER_NOT_FOUND);
        }
        return OrderResponse.from(order);
    }

    @Transactional
    public OrderResponse cancelOrder(Long memberId, Long orderId) {
        Order order = findOrderById(orderId);
        if (!order.getMember().getId().equals(memberId)) {
            throw new BaseException(ErrorCode.ORDER_NOT_FOUND);
        }

        order.cancel();

        // 재고 복구
        for (OrderProduct op : order.getOrderProducts()) {
            op.getVariant().increaseStock(op.getQuantity());
        }

        return OrderResponse.from(order);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatusUpdateRequest request) {
        Order order = findOrderById(orderId);
        OrderStatus newStatus = OrderStatus.valueOf(request.getStatus());
        order.changeStatus(newStatus);
        return OrderResponse.from(order);
    }

    private Order findOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new BaseException(ErrorCode.ORDER_NOT_FOUND));
    }

    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable)
                .map(OrderResponse::from);
    }

    public Page<OrderResponse> getSellerOrders(Long sellerId, Pageable pageable) {
        return orderRepository.findByOrderProducts_Variant_Product_SellerId(sellerId, pageable)
                .map(OrderResponse::from);
    }
}