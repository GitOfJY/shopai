# ShopAI

이커머스 OMS(Order Management System) + AI Agent 연동 프로젝트

## 프로젝트 소개

멀티셀러 쇼핑몰 플랫폼으로, 셀러마다 독립 스토어 페이지(`/store/{slug}`)를 제공합니다. 상품/주문/재고/정산 관리 시스템과 AI 기반 분석 Agent를 결합한 풀스택 프로젝트입니다. 실제 쇼핑몰 재고 처리 용도로 사용하며, 비동기 메시지 통신과 JWT 인증을 적용했습니다.

## 기술 스택

| 구분 | 기술 |
|------|------|
| Backend | Spring Boot 3.4, Java 17, JPA, QueryDSL |
| Frontend | React 18, React Router, Axios |
| AI Service | FastAPI, LangGraph, OpenAI API |
| Auth | JWT (jjwt), Spring Security, BCrypt |
| Database | MySQL 8.0, Redis 7 |
| Message Queue | RabbitMQ |
| Infra | Docker Compose, OCI (Oracle Cloud), GitHub Actions CI/CD |
| Docs | Swagger (springdoc), Flyway |

## 시스템 아키텍처

```
React (Frontend)  ──▶  Spring Boot (OMS)  ──▶  RabbitMQ    ──▶  FastAPI (AI)
 USER 쇼핑 페이지         상품/주문/재고/정산         ai.request       LangGraph Agent
 ADMIN 관리 페이지        JWT 인증             ◀── ai.response ◀── OpenAI API
 Store 셀러 페이지        REST API
                       Redis 캐싱

                           ↓
                       MySQL + Redis
```

## 주요 기능

**멀티셀러 스토어**

셀러마다 독립된 스토어 URL을 가지며(`/store/shopai`, `/store/friend-store`), 스토어별 상품 목록, 계좌 정보가 분리됩니다. 셀러 프로필은 `seller_profiles` 테이블로 별도 관리합니다.

**상품 옵션 — Option Group + Variant 패턴**

옵션 종류(사이즈, 색상)와 옵션 값을 분리하고, Variant(SKU) 단위로 재고와 가격을 관리합니다.

**주문/결제 정책**

계좌이체 전용이며, 셀러별 계좌 정보가 동적으로 표시됩니다. 배송 시작 전까지 취소 가능하고, 입금 확인 이후 환불 불가 정책을 적용합니다.

**JWT 인증 + 역할 기반 접근 제어**

회원가입/로그인 시 JWT 토큰을 발급하고, ADMIN/USER 역할에 따라 접근 가능한 API와 페이지가 분리됩니다. 비로그인 사용자도 상품 조회와 장바구니 이용이 가능합니다.

## ERD

[docs/ERD.md](docs/ERD.md)

## API

### 회원 API

| Method | Endpoint | 인증 | 설명 |
|--------|----------|------|------|
| POST | /api/members/signup | X | 회원가입 |
| POST | /api/members/login | X | 로그인 (JWT 발급) |
| GET | /api/members/{id} | O | 회원 정보 조회 |
| POST | /api/members/admin/create-seller | ADMIN | 셀러 계정 생성 |

### 상품 API

| Method | Endpoint | 인증 | 설명 |
|--------|----------|------|------|
| GET | /api/products | X | 상품 목록 (페이징, 정렬, 필터) |
| GET | /api/products/{id} | X | 상품 상세 |
| POST | /api/products | O | 상품 등록 (옵션 + Variant 포함) |
| PUT | /api/products/{id} | O | 상품 기본정보 수정 |
| DELETE | /api/products/{id} | O | 상품 삭제 |
| POST | /api/products/{id}/variants | O | Variant 추가 |
| PATCH | /api/products/{id}/variants/{variantId} | O | Variant 수정 |
| DELETE | /api/products/{id}/variants/{variantId} | O | Variant 삭제 |

### 주문 API

| Method | Endpoint | 인증 | 설명 |
|--------|----------|------|------|
| POST | /api/orders | O | 주문 생성 (재고 차감) |
| GET | /api/orders | O | 내 주문 목록 |
| GET | /api/orders/{id} | O | 주문 상세 |
| POST | /api/orders/{id}/cancel | O | 주문 취소 (재고 복구) |
| PATCH | /api/orders/{id}/status | ADMIN | 주문 상태 변경 |
| GET | /api/orders/admin | ADMIN | 셀러 주문 목록 |

### 스토어 API

| Method | Endpoint | 인증 | 설명 |
|--------|----------|------|------|
| GET | /api/store/{slug} | X | 스토어 정보 조회 |
| GET | /api/store/{slug}/products | X | 스토어 상품 목록 |
| GET | /api/store/{slug}/products/{id} | X | 스토어 상품 상세 |
| GET | /api/store/by-seller/{sellerId} | X | 셀러 ID로 스토어 조회 |

## 기술 선택 이유

**셀러 프로필 분리 — seller_profiles 테이블**

셀러 정보(스토어명, 계좌)를 members에 넣으면 일반 회원에게 불필요한 NULL 컬럼이 생깁니다. 별도 테이블로 분리하여 ADMIN인 회원만 프로필 레코드를 가지도록 설계했습니다.

**Flyway — DB 마이그레이션**

JPA ddl-auto 대신 SQL 기반 버전 관리를 적용하여 프로덕션 환경에서 의도하지 않은 스키마 변경을 방지합니다. 마이그레이션 이력이 코드에 남아 변경 추적이 가능합니다.

**프로파일 분리 — local / prod**

로컬 환경은 localhost 직접 접속과 ddl-auto: validate를 사용하고, 프로덕션은 Docker 내부 서비스명 접속과 환경변수 기반 비밀번호 주입으로 분리합니다.

## 프론트엔드 구조

```
frontend/src/
├── api/axios.js (JWT 인터셉터)
├── components/
│   ├── AdminNav.js (어드민 상단 네비)
│   └── UserNav.js (유저/비로그인 네비)
├── pages/
│   ├── admin/
│   │   ├── AdminProductListPage.js
│   │   ├── AdminOrderListPage.js
│   │   ├── AdminInventoryPage.js
│   │   ├── AdminSettlementPage.js
│   │   └── AdminAIPage.js
│   ├── HomePage.js (어드민 대시보드)
│   ├── UserHomePage.js (상품 그리드)
│   ├── StorePage.js (셀러별 스토어)
│   ├── ProductDetailPage.js (옵션 선택)
│   ├── CartPage.js (장바구니)
│   ├── CheckoutPage.js (주문/결제)
│   ├── OrderCompletePage.js (주문 완료)
│   ├── OrderListPage.js (주문 내역)
│   ├── LoginPage.js
│   └── SignupPage.js
└── App.js (라우팅 + 인증 분기)
```

## 실행 방법

```bash
# 인프라 실행
docker-compose up -d

# 백엔드 실행
./gradlew bootRun

# 프론트엔드 실행
cd frontend && npm start

# 접속
http://localhost:3000          # 메인 쇼핑
http://localhost:3000/store/shopai  # 스토어
http://localhost:8080/swagger-ui.html  # API 문서

# 관리자 계정
admin@shopai.com / admin1234
```

## 문서

- [ERD](docs/ERD.md)