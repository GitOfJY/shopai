# ShopAI

이커머스 OMS(Order Management System) + AI Agent 연동 프로젝트

## 프로젝트 소개

쇼핑몰 운영에 필요한 상품/주문/재고/정산 관리 시스템과 AI 기반 재고 분석 Agent를 결합한 백엔드 프로젝트입니다. 실제 쇼핑몰 재고 처리 용도로 사용하며, 마이크로서비스 아키텍처와 비동기 메시지 통신을 적용했습니다.

## 기술 스택

| 구분 | 기술 |
|------|------|
| Backend | Spring Boot 3.4, Java 17, JPA, QueryDSL |
| AI Service | FastAPI, LangGraph, OpenAI API |
| Database | MySQL 8.0, Redis 7 |
| Message Queue | RabbitMQ |
| Infra | Docker Compose, OCI (Oracle Cloud), GitHub Actions CI/CD |
| Docs | Swagger (springdoc), Flyway |

## 시스템 아키텍처

```
Spring Boot (OMS)  ──▶  RabbitMQ  ──▶  FastAPI (AI Service)
 상품/주문/재고/정산    ai.request       LangGraph Agent
 REST API          ◀── ai.response ◀── OpenAI Function Calling
 Redis 캐싱                             + Embedding

       ↓                                      ↓
  MySQL + Redis                          OpenAI API
```

## ERD

[docs/ERD.md](docs/ERD.md)

## API

### 상품 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/products | 상품 목록 (페이징, 정렬, 필터) |
| GET | /api/products/{id} | 상품 상세 |
| POST | /api/products | 상품 등록 (옵션 + Variant 포함) |
| PUT | /api/products/{id} | 상품 기본정보 수정 |
| DELETE | /api/products/{id} | 상품 삭제 |
| POST | /api/products/{id}/variants | Variant 추가 |
| PATCH | /api/products/{id}/variants/{variantId} | Variant 수정 |
| DELETE | /api/products/{id}/variants/{variantId} | Variant 삭제 |

## 기술 선택 이유

**상품 옵션 설계 — Option Group + Variant 패턴**

옵션 종류(사이즈, 색상)와 옵션 값을 분리하고, Variant(SKU) 단위로 재고와 가격을 관리합니다. 단일 상품 테이블에 옵션을 문자열로 저장하는 방식 대신 정규화된 테이블 구조를 선택하여 옵션 조합별 독립적인 재고 추적과 가격 설정이 가능합니다.

**Flyway — DB 마이그레이션**

JPA ddl-auto 대신 SQL 기반 버전 관리를 적용하여 프로덕션 환경에서 의도하지 않은 스키마 변경을 방지합니다. 마이그레이션 이력이 코드에 남아 변경 추적이 가능합니다.

**프로파일 분리 — local / prod**

로컬 환경은 localhost 직접 접속과 ddl-auto: validate를 사용하고, 프로덕션은 Docker 내부 서비스명 접속과 환경변수 기반 비밀번호 주입으로 분리합니다.

## 실행 방법

```bash
# 인프라 실행
docker-compose up -d

# 애플리케이션 실행
./gradlew bootRun

# Swagger 확인
http://localhost:8080/swagger-ui.html
```

## 문서

- [ERD](docs/ERD.md)
