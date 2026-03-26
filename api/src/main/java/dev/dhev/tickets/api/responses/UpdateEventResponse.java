package dev.dhev.tickets.api.responses;

import dev.dhev.tickets.domain.entities.EventStatus;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateEventResponse {

  private UUID id;
  private String name;
  private LocalDateTime start;
  private LocalDateTime end;
  private String venue;
  private LocalDateTime salesStart;
  private LocalDateTime salesEnd;
  private EventStatus status;
  private List<UpdateTicketTypeResponse> ticketTypes;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
