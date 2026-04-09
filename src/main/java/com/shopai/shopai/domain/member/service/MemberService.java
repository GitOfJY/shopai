package com.shopai.shopai.domain.member.service;

import com.shopai.shopai.domain.member.dto.LoginResponse;
import com.shopai.shopai.domain.member.dto.MemberLoginRequest;
import com.shopai.shopai.domain.member.dto.MemberResponse;
import com.shopai.shopai.domain.member.dto.MemberSignupRequest;
import com.shopai.shopai.domain.member.entity.Member;
import com.shopai.shopai.domain.member.repository.MemberRepository;
import com.shopai.shopai.global.exception.BaseException;
import com.shopai.shopai.global.exception.ErrorCode;
import com.shopai.shopai.global.security.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {
    private final MemberRepository memberRepository;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public MemberResponse signup(MemberSignupRequest request) {
        if (memberRepository.existsByEmail(request.getEmail())) {
            throw new BaseException(ErrorCode.MEMBER_ALREADY_EXISTS);
        }

        Member member = Member.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .phone(request.getPhone())
                .zipcode(request.getZipcode())
                .address(request.getAddress())
                .addressDetail(request.getAddressDetail())
                .build();

        Member saved = memberRepository.save(member);
        return MemberResponse.from(saved);
    }

    public LoginResponse login(MemberLoginRequest request) {
        Member member = memberRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BaseException(ErrorCode.MEMBER_NOT_FOUND));

        if (!passwordEncoder.matches(request.getPassword(), member.getPassword())) {
            throw new BaseException(ErrorCode.INVALID_PASSWORD);
        }

        String token = jwtProvider.createToken(member.getId(), member.getEmail(), member.getRole().name());
        return LoginResponse.builder()
                .token(token)
                .member(MemberResponse.from(member))
                .build();
    }

    public MemberResponse getMember(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new BaseException(ErrorCode.MEMBER_NOT_FOUND));
        return MemberResponse.from(member);
    }
}