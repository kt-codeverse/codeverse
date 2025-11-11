-- 데이터 초기화를 위해 테이블 데이터 삭제 (참조 무결성 순서 고려)
DELETE FROM "Message";
DELETE FROM "Payment";
DELETE FROM "Review";
DELETE FROM "Booking";
DELETE FROM "Room";
DELETE FROM "User";

-- 사용자 데이터 추가 (비밀번호는 예시이며, 실제로는 해싱된 값을 넣어야 합니다)
-- 참고: User 테이블의 ID는 보통 자동 증가(auto-increment)되므로 명시적으로 넣지 않습니다.
INSERT INTO "User" (email, name, password, role, verified, "createdAt", "updatedAt") VALUES
('host1@example.com', '김민준', 'hashed_password_1', 'HOST', true, NOW(), NOW()),
('guest1@example.com', '강지우', 'hashed_password_2', 'GUEST', true, NOW(), NOW());

-- 숙소 데이터 추가 (위에서 생성된 HOST 사용자의 ID를 알아야 합니다)
-- 이 예시에서는 ID가 1이라고 가정합니다. 실제 환경에서는 ID를 확인해야 합니다.
INSERT INTO "Room" (title, description, country, city, pricePerNight, amenities, "hostId", "createdAt", "updatedAt") VALUES
('서울역 근처 아늑한 아파트', '설명...', 'South Korea', 'Seoul', 120, ARRAY['WiFi', 'Kitchen'], 1, NOW(), NOW());