package com.shopai.shopai.domain.member.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SellerCreateRequest {
    @NotBlank(message = "이메일은 필수입니다")
    @Email
    private String email;

    @NotBlank(message = "비밀번호는 필수입니다")
    private String password;

    @NotBlank(message = "이름은 필수입니다")
    private String name;

    private String phone;

    @NotBlank(message = "스토어 슬러그는 필수입니다")
    private String storeSlug;

    @NotBlank(message = "스토어 이름은 필수입니다")
    private String storeName;

    @NotBlank(message = "은행명은 필수입니다")
    private String bankName;

    @NotBlank(message = "계좌번호는 필수입니다")
    private String bankAccount;

    @NotBlank(message = "예금주는 필수입니다")
    private String bankHolder;
}