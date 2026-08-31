package com.crm.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "followups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Followup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "followup_id")
    private Integer followupId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enquiry_id", nullable = false)
    private Enquiry enquiry;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "counsellor_id", nullable = false)
    private User counsellor;

    @Convert(converter = InteractionTypeConverter.class)
    @Builder.Default
    @Column(name = "interaction_type", length = 20)
    private InteractionType interactionType = InteractionType.Call;
    
    @Convert(converter = OutcomeConverter.class)
    @Column(length = 30)
    private Outcome outcome;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "scheduled_at")
    private LocalDate scheduledAt;

    @Column(name = "completed_at")
    private LocalDate completedAt;

    @Column(name = "next_followup_at")
    private LocalDate nextFollowupAt;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(length = 20)
    private FollowupStatus status = FollowupStatus.Scheduled;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public enum InteractionType {
        Call, WhatsApp, Email, Walk_in("Walk-in"), Other;
        private String dbValue;
        InteractionType() { this.dbValue = this.name(); }
        InteractionType(String dbValue) { this.dbValue = dbValue; }
        public String getDbValue() { return dbValue; }
        public static InteractionType fromDbValue(String value) {
            for (InteractionType t : values()) if (t.dbValue.equals(value)) return t;
            throw new IllegalArgumentException("Unknown interaction_type: " + value);
        }
    }

    public enum Outcome {
        Interested("Interested"), Not_Interested("Not Interested"),
        No_Response("No Response"), Call_Back_Later("Call Back Later"),
        Demo_Scheduled("Demo Scheduled"), Other("Other");
        private final String dbValue;
        Outcome(String dbValue) { this.dbValue = dbValue; }
        public String getDbValue() { return dbValue; }
        public static Outcome fromDbValue(String value) {
            for (Outcome o : values()) if (o.dbValue.equals(value)) return o;
            throw new IllegalArgumentException("Unknown outcome: " + value);
        }
    }

    public enum FollowupStatus { Scheduled, Completed, Missed, Cancelled }

    @Converter
    public static class InteractionTypeConverter implements AttributeConverter<InteractionType, String> {
        public String convertToDatabaseColumn(InteractionType attribute) {
            return attribute == null ? null : attribute.getDbValue();
        }
        public InteractionType convertToEntityAttribute(String dbData) {
            return dbData == null ? null : InteractionType.fromDbValue(dbData);
        }
    }

    @Converter
    public static class OutcomeConverter implements AttributeConverter<Outcome, String> {
        public String convertToDatabaseColumn(Outcome attribute) {
            return attribute == null ? null : attribute.getDbValue();
        }
        public Outcome convertToEntityAttribute(String dbData) {
            return dbData == null ? null : Outcome.fromDbValue(dbData);
        }
    }
}