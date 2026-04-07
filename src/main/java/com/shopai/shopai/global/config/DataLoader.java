package com.shopai.shopai.global.config;

import com.shopai.shopai.domain.product.entity.Product;
import com.shopai.shopai.domain.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Profile("local")
public class DataLoader implements CommandLineRunner {

    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) {
            return;
        }

        List<Product> products = List.of(
                Product.builder().name("나이키 에어맥스 90").category("신발").price(new BigDecimal("139000")).description("클래식한 디자인의 러닝화").stockQuantity(50).build(),
                Product.builder().name("아디다스 울트라부스트 22").category("신발").price(new BigDecimal("189000")).description("편안한 쿠셔닝의 러닝화").stockQuantity(30).build(),
                Product.builder().name("리바이스 501 오리지널").category("바지").price(new BigDecimal("89000")).description("클래식 스트레이트 핏 데님").stockQuantity(100).build(),
                Product.builder().name("유니클로 히트텍 이너웨어").category("상의").price(new BigDecimal("19900")).description("겨울철 필수 기능성 이너웨어").stockQuantity(200).build(),
                Product.builder().name("자라 오버사이즈 코트").category("아우터").price(new BigDecimal("159000")).description("트렌디한 오버핏 울 코트").stockQuantity(25).build(),
                Product.builder().name("뉴발란스 993").category("신발").price(new BigDecimal("259000")).description("프리미엄 메이드 인 USA 러닝화").stockQuantity(15).build(),
                Product.builder().name("무지 린넨 셔츠").category("상의").price(new BigDecimal("49900")).description("여름용 내추럴 린넨 셔츠").stockQuantity(80).build(),
                Product.builder().name("노스페이스 눕시 패딩").category("아우터").price(new BigDecimal("329000")).description("겨울 필수 숏패딩").stockQuantity(40).build(),
                Product.builder().name("캘빈클라인 드로즈 3팩").category("속옷").price(new BigDecimal("59000")).description("기본 코튼 드로즈 세트").stockQuantity(150).build(),
                Product.builder().name("구찌 GG 마몬트 벨트").category("액세서리").price(new BigDecimal("650000")).description("시그니처 더블G 버클 가죽 벨트").stockQuantity(10).build()
        );

        productRepository.saveAll(products);
    }
}
