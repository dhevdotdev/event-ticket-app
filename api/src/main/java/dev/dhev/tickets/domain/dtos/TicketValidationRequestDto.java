package dev.dhev.tickets.domain.dtos;

import dev.dhev.tickets.domain.entities.TicketValidationMethod;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketValidationRequestDto {

  @NotNull(message = "ID is required")
  private UUID id;

  @NotNull(message = "Validation method is required")
  private TicketValidationMethod method;
}
