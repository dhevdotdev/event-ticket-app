package dev.dhev.tickets.controllers;

import dev.dhev.tickets.api.requests.TicketValidationRequest;
import dev.dhev.tickets.api.responses.TicketValidationResponse;
import dev.dhev.tickets.entities.TicketValidation;
import dev.dhev.tickets.entities.TicketValidationMethod;
import dev.dhev.tickets.mappers.TicketValidationMapper;
import dev.dhev.tickets.services.TicketValidationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/v1/ticket-validations")
@RequiredArgsConstructor
public class TicketValidationController {

  private final TicketValidationService ticketValidationService;
  private final TicketValidationMapper ticketValidationMapper;

  @PostMapping
  public ResponseEntity<TicketValidationResponse> validateTicket(
      @Valid @RequestBody TicketValidationRequest request
   ){
    TicketValidationMethod method = request.getMethod();
    TicketValidation ticketValidation;
    if(TicketValidationMethod.MANUAL.equals(method)) {
      ticketValidation = ticketValidationService.validateTicketManually(
          request.getId());
    } else {
      ticketValidation = ticketValidationService.validateTicketByQrCode(
          request.getId()
      );
    }
    return ResponseEntity.ok(
        ticketValidationMapper.toTicketValidationResponse(ticketValidation)
    );
  }

}
