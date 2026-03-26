package dev.dhev.tickets.services;

import dev.dhev.tickets.domain.entities.QrCode;
import dev.dhev.tickets.domain.entities.QrCodeStatus;
import dev.dhev.tickets.domain.entities.Ticket;
import dev.dhev.tickets.domain.entities.TicketValidation;
import dev.dhev.tickets.domain.entities.TicketValidationMethod;
import dev.dhev.tickets.domain.entities.TicketValidationStatus;
import dev.dhev.tickets.exceptions.QrCodeNotFoundException;
import dev.dhev.tickets.exceptions.TicketNotFoundException;
import dev.dhev.tickets.repositories.QrCodeRepository;
import dev.dhev.tickets.repositories.TicketRepository;
import dev.dhev.tickets.repositories.TicketValidationRepository;
import jakarta.transaction.Transactional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class DefaultTicketValidationService implements TicketValidationService {

  private final QrCodeRepository qrCodeRepository;
  private final TicketValidationRepository ticketValidationRepository;
  private final TicketRepository ticketRepository;

  @Override
  public TicketValidation validateTicketByQrCode(UUID qrCodeId) {
    QrCode qrCode = qrCodeRepository.findByIdAndStatus(qrCodeId, QrCodeStatus.ACTIVE)
        .orElseThrow(() -> new QrCodeNotFoundException(
            String.format(
                "QR Code with ID %s was not found", qrCodeId
            )
        ));

    Ticket ticket = qrCode.getTicket();

    return validateTicket(ticket, TicketValidationMethod.QR_SCAN);
  }

  private TicketValidation validateTicket(Ticket ticket,
      TicketValidationMethod ticketValidationMethod) {
    TicketValidation ticketValidation = new TicketValidation();
    ticketValidation.setTicket(ticket);
    ticketValidation.setValidationMethod(ticketValidationMethod);

    TicketValidationStatus ticketValidationStatus = ticket.getValidations().stream()
        .filter(v -> TicketValidationStatus.VALID.equals(v.getStatus()))
        .findFirst()
        .map(v -> TicketValidationStatus.INVALID)
        .orElse(TicketValidationStatus.VALID);

    ticketValidation.setStatus(ticketValidationStatus);

    return ticketValidationRepository.save(ticketValidation);
  }

  @Override
  public TicketValidation validateTicketManually(UUID ticketId) {
    Ticket ticket = ticketRepository.findById(ticketId)
        .orElseThrow(TicketNotFoundException::new);
    return validateTicket(ticket, TicketValidationMethod.MANUAL);
  }
}
