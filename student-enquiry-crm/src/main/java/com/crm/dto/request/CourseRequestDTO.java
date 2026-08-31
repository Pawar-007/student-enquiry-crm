package com.crm.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseRequestDTO {

    @Size(max = 150, message = "Course name must not exceed 150 characters")
    private String courseName;

    private String description;

    @Size(max = 50)
    private String duration;

    @DecimalMin(value = "0.0", message = "Fees cannot be negative")
    private BigDecimal fees;

    private String brochurePdf;
}