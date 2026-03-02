package dev.dhev.tickets.domain.dtos;

import dev.dhev.tickets.domain.entities.TicketStatus;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ListTicketResponseDto {
  private UUID id;
  private TicketStatus status;
  private ListTicketTicketTypeResponseDto ticketType;
}
