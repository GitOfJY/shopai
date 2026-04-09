package com.shopai.shopai.domain.store.dto;

import com.shopai.shopai.domain.seller.entity.SellerProfile;
import lombok.*;

@Getter
@AllArgsConstructor
@Builder
public class StoreResponse {
    private String storeSlug;
    private String storeName;
    private String bankName;
    private String bankAccount;
    private String bankHolder;

    public static StoreResponse from(SellerProfile profile) {
        return StoreResponse.builder()
                .storeSlug(profile.getStoreSlug())
                .storeName(profile.getStoreName())
                .bankName(profile.getBankName())
                .bankAccount(profile.getBankAccount())
                .bankHolder(profile.getBankHolder())
                .build();
    }
}