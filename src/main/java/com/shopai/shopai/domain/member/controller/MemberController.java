package com.shopai.shopai.domain.member.controller;

import com.shopai.shopai.domain.member.dto.*;
import com.shopai.shopai.domain.member.service.MemberService;
import com.shopai.shopai.global.dto.ApiResponse;
import com.shopai.shopai.global.exception.SuccessCode;
import com.shopai.shopai.global.security.AuthMemberId;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
@Tag(name = "회원 API", description = "회원가입/로그인 API")
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/signup")
    @Operation(summary = "회원가입")
    public ResponseEntity<ApiResponse<MemberResponse>> signup(@Valid @RequestBody MemberSignupRequest request) {
        MemberResponse member = memberService.signup(request);
        return ResponseEntity.status(SuccessCode.MEMBER_CREATED.getStatus())
                .body(ApiResponse.of(SuccessCode.MEMBER_CREATED, member));
    }

    @PostMapping("/login")
    @Operation(summary = "로그인")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody MemberLoginRequest request) {
        LoginResponse loginResponse = memberService.login(request);
        return ResponseEntity.ok(ApiResponse.of(SuccessCode.OK, loginResponse));
    }

    @GetMapping("/{id}")
    @Operation(summary = "회원 정보 조회")
    public ResponseEntity<ApiResponse<MemberResponse>> getMember(@PathVariable Long id) {
        MemberResponse member = memberService.getMember(id);
        return ResponseEntity.ok(ApiResponse.ok(member));
    }

    @PostMapping("/admin/create-seller")
    @Operation(summary = "셀러 계정 생성 (슈퍼관리자용)")
    public ResponseEntity<ApiResponse<MemberResponse>> createSeller(
            @AuthMemberId Long memberId,
            @Valid @RequestBody SellerCreateRequest request) {
        MemberResponse seller = memberService.createSeller(memberId, request);
        return ResponseEntity.status(SuccessCode.MEMBER_CREATED.getStatus())
                .body(ApiResponse.of(SuccessCode.MEMBER_CREATED, seller));
    }
}