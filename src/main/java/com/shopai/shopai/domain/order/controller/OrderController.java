package com.shopai.shopai.domain.order.controller;

import com.shopai.shopai.domain.order.dto.OrderCreateRequest;
import com.shopai.shopai.domain.order.dto.OrderResponse;
import com.shopai.shopai.domain.order.dto.OrderStatusUpdateRequest;
import com.shopai.shopai.domain.order.service.OrderService;
import com.shopai.shopai.global.dto.ApiResponse;
import com.shopai.shopai.global.exception.SuccessCode;
import com.shopai.shopai.global.security.AuthMemberId;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "주문 API", description = "주문 생성/조회/취소 API")
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    @Operation(summary = "주문 생성", description = "장바구니 상품 주문 (재고 차감 포함)")
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @AuthMemberId Long memberId,
            @Valid @RequestBody OrderCreateRequest request) {
        OrderResponse order = orderService.createOrder(memberId, request);
        return ResponseEntity.status(SuccessCode.ORDER_CREATED.getStatus())
                .body(ApiResponse.of(SuccessCode.ORDER_CREATED, order));
    }

    @GetMapping
    @Operation(summary = "내 주문 목록")
    public ResponseEntity<ApiResponse<Page<OrderResponse>>> getMyOrders(
            @AuthMemberId Long memberId,
            @PageableDefault(size = 10, sort = "orderedAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<OrderResponse> orders = orderService.getMyOrders(memberId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @GetMapping("/{orderId}")
    @Operation(summary = "주문 상세 조회")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrder(
            @AuthMemberId Long memberId,
            @PathVariable Long orderId) {
        OrderResponse order = orderService.getOrder(memberId, orderId);
        return ResponseEntity.ok(ApiResponse.ok(order));
    }

    @PostMapping("/{orderId}/cancel")
    @Operation(summary = "주문 취소", description = "배송 전 주문만 취소 가능 (재고 복구)")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(
            @AuthMemberId Long memberId,
            @PathVariable Long orderId) {
        OrderResponse order = orderService.cancelOrder(memberId, orderId);
        return ResponseEntity.ok(ApiResponse.of(SuccessCode.ORDER_CANCELLED, order));
    }

    @PatchMapping("/{orderId}/status")
    @Operation(summary = "주문 상태 변경 (관리자)", description = "PAID/SHIPPING/DELIVERED 상태 변경")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long orderId,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        OrderResponse order = orderService.updateOrderStatus(orderId, request);
        return ResponseEntity.ok(ApiResponse.of(SuccessCode.OK, order));
    }
}