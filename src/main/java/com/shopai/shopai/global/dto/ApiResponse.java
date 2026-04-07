package com.shopai.shopai.global.dto;

import com.shopai.shopai.global.exception.SuccessCode;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, SuccessCode.OK.getMessage(), data);
    }

    public static <T> ApiResponse<T> of(SuccessCode code, T data) {
        return new ApiResponse<>(true, code.getMessage(), data);
    }

    public static <T> ApiResponse<T> of(SuccessCode code) {
        return new ApiResponse<>(true, code.getMessage(), null);
    }
}