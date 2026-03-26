package dev.dhev.tickets.api.responses;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PublishedEventTicketTypeResponse {

  private UUID id;
  private String name;
  private BigDecimal price;
  private String description;
}
