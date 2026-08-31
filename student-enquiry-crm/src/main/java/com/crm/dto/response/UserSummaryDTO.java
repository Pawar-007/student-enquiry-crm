package com.crm.dto.response;

import com.crm.entity.User;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSummaryDTO {

    private Integer userId;
    private String name;
    private String email;

    public static UserSummaryDTO fromEntity(User user) {
        if (user == null) return null;
        return UserSummaryDTO.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }
}