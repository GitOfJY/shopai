package com.shopai.shopai.domain.member.dto;

import lombok.*;

@Getter
@AllArgsConstructor
@Builder
public class LoginResponse {
    private String token;
    private MemberResponse member;
}