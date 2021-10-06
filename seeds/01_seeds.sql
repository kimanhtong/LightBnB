/* TABLE users */
INSERT INTO users (name, email, password)
VALUES ('anh','a@b.c','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('kim','d@e.f','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('tong','g@h.i','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

/* TABLE properties */
INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
VALUES (1, 'PROPERTY 1', 'description', 'https://media.minto.com/img/models/icons/3615_Haven_AC_654x420.jpg', 'http://localhost/images/3615_Haven_AC_654x420.png', 500, 4, 4, 4, 'Canada', 'Terry Fox', 'Ottawa', 'Ontario', 'K3G 4L8'),
(2, 'PROPERTY 2', 'description', 'https://media.minto.com/img/models/icons/3628_Laguna_TypeB__654x420.jpg', 'http://localhost/images/628_Laguna_TypeB__654x420.png', 600, 5, 5, 5, 'Canada', 'Katimavik', 'Ottawa', 'Ontario', 'K2G 3T3'),
(3, 'PROPERTY 3', 'description', 'https://media.minto.com/img/models/icons/3620_Monterey_AC_654x420.jpg', 'http://localhost/images/3620_Monterey_AC_654x420.png', 700, 6, 6, 6, 'Canada', 'Kanata', 'Ottawa', 'Ontario', 'K9U 2N8');

/* TABLE reservations */
INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2021-07-20','2021-07-29',1,2), ('2021-10-01','2021-10-06',2,3), ('2021-10-05','2021-10-08',3,1);

/* TABLE property_reviews */
INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (2, 1, 1, 1, 'message'), (3, 2, 2, 2,'message'), (1,3,3,6,'message');