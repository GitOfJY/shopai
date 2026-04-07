package com.shopai.shopai.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum SuccessCode {
    // Common
    OK(HttpStatus.OK, "요청이 성공했습니다."),

    // Product
    PRODUCT_CREATED(HttpStatus.CREATED, "상품이 등록되었습니다."),
    PRODUCT_UPDATED(HttpStatus.OK, "상품이 수정되었습니다."),
    PRODUCT_DELETED(HttpStatus.OK, "상품이 삭제되었습니다."),
    PRODUCT_AI_DESCRIPTION_REQUESTED(HttpStatus.OK, "AI 설명 생성이 요청되었습니다."),
    VARIANT_CREATED(HttpStatus.CREATED, "variant가 추가되었습니다."),
    VARIANT_UPDATED(HttpStatus.OK, "variant가 수정되었습니다."),
    VARIANT_DELETED(HttpStatus.OK, "variant가 삭제되었습니다."),

    // Order
    ORDER_CREATED(HttpStatus.CREATED, "주문이 생성되었습니다."),
    ORDER_CANCELLED(HttpStatus.OK, "주문이 취소되었습니다."),
    ORDER_RETURNED(HttpStatus.OK, "반품이 처리되었습니다."),

    // Settlement
    SETTLEMENT_CALCULATED(HttpStatus.OK, "정산이 완료되었습니다."),
    ;

    private final HttpStatus status;
    private final String message;
}