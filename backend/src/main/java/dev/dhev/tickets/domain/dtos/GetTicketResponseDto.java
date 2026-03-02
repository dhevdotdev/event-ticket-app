package dev.dhev.tickets.domain.dtos;

import dev.dhev.tickets.domain.entities.TicketStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetTicketResponseDto {
  private UUID id;
  private TicketStatus status;
  private BigDecimal price;
  private String description;
  private String eventName;
  private String eventVenue;
  private LocalDateTime eventStart;
  private LocalDateTime eventEnd;
}
