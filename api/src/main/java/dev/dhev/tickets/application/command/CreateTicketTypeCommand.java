package dev.dhev.tickets.application.command;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateTicketTypeCommand {

  private String name;
  private BigDecimal price;
  private String description;
  private Integer totalAvailable;
}
