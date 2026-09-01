package com.crm.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherRequestDTO {
    private String name;
    private String email;
    private String mobile;
    private String expertise;
}