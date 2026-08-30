package com.crm.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "enquiries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "enquiry_id")
    private Integer enquiryId;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "mobile_number", nullable = false, length = 15)
    private String mobileNumber;

    @Column(name = "alternate_mobile", length = 15)
    private String alternateMobile;

    @Column(length = 150)
    private String email;

    @Column(length = 100)
    private String city;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;

    @Enumerated(EnumType.STRING)
    @Column(name = "course_mode", length = 20)
    private CourseMode courseMode;

    @Column(name = "budget_range", length = 50)
    private String budgetRange;

    @Convert(converter = EnquirySourceConverter.class)
    @Column(name = "enquiry_source", nullable = false, length = 20)
    private EnquirySource enquirySource;

    @Convert(converter = StatusConverter.class)
    @Builder.Default
    @Column(length = 30)
    private Status status = Status.New;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(length = 10)
    private Priority priority = Priority.Warm;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "counsellor_id")
    private User counsellor;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by")
    private User updatedBy;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum CourseMode { Online, Offline }

    public enum EnquirySource {
        Walk_in("Walk-in"), Phone_Call("Phone Call"), Website("Website");
        private final String dbValue;
        EnquirySource(String dbValue) { this.dbValue = dbValue; }
        public String getDbValue() { return dbValue; }
        public static EnquirySource fromDbValue(String value) {
            for (EnquirySource s : values()) if (s.dbValue.equals(value)) return s;
            throw new IllegalArgumentException("Unknown enquiry_source: " + value);
        }
    }

    public enum Status {
        New("New"), Interested("Interested"), Demo_Scheduled("Demo Scheduled"),
        Admission_Done("Admission Done"), Not_Interested("Not Interested");
        private final String dbValue;
        Status(String dbValue) { this.dbValue = dbValue; }
        public String getDbValue() { return dbValue; }
        public static Status fromDbValue(String value) {
            for (Status s : values()) if (s.dbValue.equals(value)) return s;
            throw new IllegalArgumentException("Unknown status: " + value);
        }
    }

    public enum Priority { Hot, Warm, Cold }

    @Converter
    public static class EnquirySourceConverter implements AttributeConverter<EnquirySource, String> {
        public String convertToDatabaseColumn(EnquirySource attribute) {
            return attribute == null ? null : attribute.getDbValue();
        }
        public EnquirySource convertToEntityAttribute(String dbData) {
            return dbData == null ? null : EnquirySource.fromDbValue(dbData);
        }
    }

    @Converter
    public static class StatusConverter implements AttributeConverter<Status, String> {
        public String convertToDatabaseColumn(Status attribute) {
            return attribute == null ? null : attribute.getDbValue();
        }
        public Status convertToEntityAttribute(String dbData) {
            return dbData == null ? null : Status.fromDbValue(dbData);
        }
    }
}