package com.bookatable.reservationapp.repository;

import com.bookatable.reservationapp.dto.RestaurantWithRatingDTO;
import com.bookatable.reservationapp.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    // deocamdată nu ai nevoie de metode custom aici
    @Query("""
        SELECT new com.bookatable.reservationapp.dto.RestaurantWithRatingDTO(
            r.id, r.name, r.imageUrl, AVG(rv.rating)
        )
        FROM Restaurant r
        LEFT JOIN r.reviews rv
        GROUP BY r.id, r.name, r.imageUrl
        ORDER BY r.name
    """)
    List<RestaurantWithRatingDTO> findAllWithAverageRating();
}
