package com.shopai.shopai.global.config;

import com.shopai.shopai.domain.member.entity.Member;
import com.shopai.shopai.domain.member.entity.MemberRole;
import com.shopai.shopai.domain.member.repository.MemberRepository;
import com.shopai.shopai.domain.product.entity.*;
import com.shopai.shopai.domain.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Profile("local")
public class DataLoader implements CommandLineRunner {
    private final ProductRepository productRepository;
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!memberRepository.existsByEmail("admin@shopai.com")) {
            Member admin = Member.builder()
                    .email("admin@shopai.com")
                    .password(passwordEncoder.encode("admin1234"))
                    .name("관리자")
                    .phone("01000000000")
                    .role(MemberRole.ADMIN)
                    .build();
            memberRepository.save(admin);
        }

        if (productRepository.count() > 0) {
            return;
        }

        // 상품 1: 나이키 에어맥스 90
        Product airmax = Product.builder()
                .name("나이키 에어맥스 90")
                .category("신발")
                .basePrice(new BigDecimal("139000"))
                .description("클래식한 디자인의 러닝화")
                .build();

        // 옵션그룹: 사이즈
        ProductOptionGroup sizeGroup = ProductOptionGroup.builder()
                .product(airmax)
                .name("사이즈")
                .sortOrder(1)
                .build();

        ProductOptionValue size260 = ProductOptionValue.builder().optionGroup(sizeGroup).value("260").sortOrder(1).build();
        ProductOptionValue size270 = ProductOptionValue.builder().optionGroup(sizeGroup).value("270").sortOrder(2).build();
        ProductOptionValue size280 = ProductOptionValue.builder().optionGroup(sizeGroup).value("280").sortOrder(3).build();
        sizeGroup.getOptionValues().addAll(List.of(size260, size270, size280));

        // 옵션그룹: 색상
        ProductOptionGroup colorGroup = ProductOptionGroup.builder()
                .product(airmax)
                .name("색상")
                .sortOrder(2)
                .build();

        ProductOptionValue black = ProductOptionValue.builder().optionGroup(colorGroup).value("블랙").sortOrder(1).build();
        ProductOptionValue white = ProductOptionValue.builder().optionGroup(colorGroup).value("화이트").sortOrder(2).build();
        colorGroup.getOptionValues().addAll(List.of(black, white));

        airmax.getOptionGroups().addAll(List.of(sizeGroup, colorGroup));

        // Variants (사이즈 x 색상 조합)
        createVariant(airmax, "AM90-260-BLK", BigDecimal.ZERO, 10, size260, black);
        createVariant(airmax, "AM90-260-WHT", BigDecimal.ZERO, 5, size260, white);
        createVariant(airmax, "AM90-270-BLK", BigDecimal.ZERO, 8, size270, black);
        createVariant(airmax, "AM90-270-WHT", BigDecimal.ZERO, 12, size270, white);
        createVariant(airmax, "AM90-280-BLK", new BigDecimal("10000"), 3, size280, black);
        createVariant(airmax, "AM90-280-WHT", new BigDecimal("10000"), 7, size280, white);

        // 상품 2: 리바이스 501
        Product levis = Product.builder()
                .name("리바이스 501 오리지널")
                .category("바지")
                .basePrice(new BigDecimal("89000"))
                .description("클래식 스트레이트 핏 데님")
                .build();

        ProductOptionGroup waistGroup = ProductOptionGroup.builder()
                .product(levis)
                .name("허리")
                .sortOrder(1)
                .build();

        ProductOptionValue waist30 = ProductOptionValue.builder().optionGroup(waistGroup).value("30").sortOrder(1).build();
        ProductOptionValue waist32 = ProductOptionValue.builder().optionGroup(waistGroup).value("32").sortOrder(2).build();
        ProductOptionValue waist34 = ProductOptionValue.builder().optionGroup(waistGroup).value("34").sortOrder(3).build();
        waistGroup.getOptionValues().addAll(List.of(waist30, waist32, waist34));

        ProductOptionGroup lengthGroup = ProductOptionGroup.builder()
                .product(levis)
                .name("기장")
                .sortOrder(2)
                .build();

        ProductOptionValue length30 = ProductOptionValue.builder().optionGroup(lengthGroup).value("30").sortOrder(1).build();
        ProductOptionValue length32 = ProductOptionValue.builder().optionGroup(lengthGroup).value("32").sortOrder(2).build();
        lengthGroup.getOptionValues().addAll(List.of(length30, length32));

        levis.getOptionGroups().addAll(List.of(waistGroup, lengthGroup));

        createVariant(levis, "LV501-30-30", BigDecimal.ZERO, 20, waist30, length30);
        createVariant(levis, "LV501-30-32", BigDecimal.ZERO, 15, waist30, length32);
        createVariant(levis, "LV501-32-30", BigDecimal.ZERO, 25, waist32, length30);
        createVariant(levis, "LV501-32-32", BigDecimal.ZERO, 18, waist32, length32);
        createVariant(levis, "LV501-34-30", BigDecimal.ZERO, 10, waist34, length30);
        createVariant(levis, "LV501-34-32", BigDecimal.ZERO, 12, waist34, length32);

        // 상품 3: 노스페이스 눕시 (옵션 1개: 사이즈만)
        Product nuptse = Product.builder()
                .name("노스페이스 눕시 패딩")
                .category("아우터")
                .basePrice(new BigDecimal("329000"))
                .description("겨울 필수 숏패딩")
                .build();

        ProductOptionGroup nuptseSizeGroup = ProductOptionGroup.builder()
                .product(nuptse)
                .name("사이즈")
                .sortOrder(1)
                .build();

        ProductOptionValue sizeS = ProductOptionValue.builder().optionGroup(nuptseSizeGroup).value("S").sortOrder(1).build();
        ProductOptionValue sizeM = ProductOptionValue.builder().optionGroup(nuptseSizeGroup).value("M").sortOrder(2).build();
        ProductOptionValue sizeL = ProductOptionValue.builder().optionGroup(nuptseSizeGroup).value("L").sortOrder(3).build();
        ProductOptionValue sizeXL = ProductOptionValue.builder().optionGroup(nuptseSizeGroup).value("XL").sortOrder(4).build();
        nuptseSizeGroup.getOptionValues().addAll(List.of(sizeS, sizeM, sizeL, sizeXL));

        nuptse.getOptionGroups().add(nuptseSizeGroup);

        createVariant(nuptse, "NF-NUPTSE-S", BigDecimal.ZERO, 5, sizeS);
        createVariant(nuptse, "NF-NUPTSE-M", BigDecimal.ZERO, 8, sizeM);
        createVariant(nuptse, "NF-NUPTSE-L", BigDecimal.ZERO, 12, sizeL);
        createVariant(nuptse, "NF-NUPTSE-XL", BigDecimal.ZERO, 6, sizeXL);

        productRepository.saveAll(List.of(airmax, levis, nuptse));
    }

    private void createVariant(Product product, String sku, BigDecimal additionalPrice, int stock, ProductOptionValue... optionValues) {
        ProductVariant variant = ProductVariant.builder()
                .product(product)
                .sku(sku)
                .additionalPrice(additionalPrice)
                .stockQuantity(stock)
                .build();

        for (ProductOptionValue ov : optionValues) {
            ProductVariantOption vOption = ProductVariantOption.builder()
                    .variant(variant)
                    .optionValue(ov)
                    .build();
            variant.getVariantOptions().add(vOption);
        }

        product.getVariants().add(variant);
    }
}