package com.crm.dto.response;

import com.crm.entity.User;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDTO {

    private Integer userId;
    private String name;
    private String email;          // password KABHI include mat karo
    private User.Role role;
    private String mobile;
    private User.UserStatus status;
    private LocalDateTime createdAt;

    public static UserResponseDTO fromEntity(User user) {
        return UserResponseDTO.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .mobile(user.getMobile())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .build();
    }
}