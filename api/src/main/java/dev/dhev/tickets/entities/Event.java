package dev.dhev.tickets.entities;

import jakarta.persistence.Column;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event extends Auditable {

  @Id
  @Column(name = "id", updatable = false, nullable = false)
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(name = "name", nullable = false)
  private String name;

  @Column(name = "starts_at")
  private LocalDateTime start;

  @Column(name = "ends_at")
  private LocalDateTime end;

  @Column(name = "venue", nullable = false)
  private String venue;

  @Column(name = "sales_starts_at")
  private LocalDateTime salesStart;

  @Column(name = "sales_ends_at")
  private LocalDateTime salesEnd;

  @Column(name = "status", nullable = false)
  @Enumerated(EnumType.STRING)
  private EventStatus status;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "organizer_id")
  private User organizer;

  @ManyToMany(mappedBy = "attendingEvents")
  private List<User> attendees = new ArrayList<>();

  @ManyToMany(mappedBy = "staffingEvents")
  private List<User> staff = new ArrayList<>();

  @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<TicketType> ticketTypes = new ArrayList<>();

  @Override
  public boolean equals(Object o) {
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Event event = (Event) o;
    return Objects.equals(id, event.id) && Objects.equals(name, event.name) && Objects.equals(start,
        event.start) && Objects.equals(end, event.end) && Objects.equals(venue, event.venue)
        && Objects.equals(salesStart, event.salesStart) && Objects.equals(salesEnd, event.salesEnd)
        && status == event.status && Objects.equals(getCreatedAt(), event.getCreatedAt())
        && Objects.equals(getUpdatedAt(), event.getUpdatedAt());
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, name, start, end, venue, salesStart, salesEnd, status, getCreatedAt(),
        getUpdatedAt());
  }
}
