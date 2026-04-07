package com.shopai.shopai.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    // Common
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "C001", "서버 내부 오류가 발생했습니다."),
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "C002", "잘못된 입력값입니다."),

    // Product
    PRODUCT_NOT_FOUND(HttpStatus.NOT_FOUND, "P001", "상품을 찾을 수 없습니다."),
    PRODUCT_OUT_OF_STOCK(HttpStatus.BAD_REQUEST, "P002", "재고가 부족합니다."),
    VARIANT_NOT_FOUND(HttpStatus.NOT_FOUND, "P003", "variant를 찾을 수 없습니다."),

    // Order
    ORDER_NOT_FOUND(HttpStatus.NOT_FOUND, "O001", "주문을 찾을 수 없습니다."),
    ORDER_ALREADY_CANCELLED(HttpStatus.BAD_REQUEST, "O002", "이미 취소된 주문입니다."),

    // Inventory
    INVENTORY_NOT_FOUND(HttpStatus.NOT_FOUND, "I001", "재고 정보를 찾을 수 없습니다."),

    // Settlement
    SETTLEMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "S001", "정산 정보를 찾을 수 없습니다."),
    ;

    private final HttpStatus status;
    private final String code;
    private final String message;
}