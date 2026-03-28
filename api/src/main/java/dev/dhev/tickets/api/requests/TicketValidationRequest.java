package dev.dhev.tickets.api.requests;

import dev.dhev.tickets.entities.TicketValidationMethod;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketValidationRequest {

  @NotNull(message = "ID is required")
  private UUID id;

  @NotNull(message = "Validation method is required")
  private TicketValidationMethod method;
}
