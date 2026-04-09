package com.shopai.shopai.domain.member.dto;

import com.shopai.shopai.domain.member.entity.Member;
import com.shopai.shopai.domain.member.entity.MemberRole;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@Builder
public class MemberResponse {
    private Long id;
    private String email;
    private String name;
    private String phone;
    private String zipcode;
    private String address;
    private String addressDetail;
    private MemberRole role;
    private LocalDateTime createdAt;

    public static MemberResponse from(Member member) {
        return MemberResponse.builder()
                .id(member.getId())
                .email(member.getEmail())
                .name(member.getName())
                .phone(member.getPhone())
                .zipcode(member.getZipcode())
                .address(member.getAddress())
                .addressDetail(member.getAddressDetail())
                .role(member.getRole())
                .createdAt(member.getCreatedAt())
                .build();
    }
}